/* eslint-disable import/no-mutable-exports */
import * as Mnemonic from 'bitcore-mnemonic'
import { cloneDeep } from 'lodash'
import { passwordSecret } from 'constants/crypto'
import crypto from 'crypto-js'
import * as i from 'incognito-sdk/build/web/browser'
import { WalletInstance, CONSTANT } from 'incognito-sdk/build/web/browser'
import { serializeAccount } from 'models/account-model'
import { createDraft, finishDraft } from 'immer'
import { WritableDraft } from 'immer/dist/internal'
import { MAX_DEX_FEE, PRV_ID } from 'constants/fee.constant'
import { TokenItemInterface } from 'queries/token.queries'
import { AxiosResponse } from 'axios'
import * as CONSTANTS from '../constants/app'
import { sdk } from './incognito/sdk'
import { storageService } from './storage'
import { apiGetEstimateFeeFromChain, estimateUserFees, genCentralizedWithdrawAddress } from './fee'
import convert from './convert'
import { PRIVATE_TOKEN_CURRENCY_TYPE, CRYPTO_SYMBOL } from '../constants/common'

export let runtime: WritableDraft<{ walletRuntime: WalletInstance; loaded: boolean; runtimePassword?: string }> = createDraft({
  walletRuntime: null,
  loaded: false,
})

export const loadingWallet = async () => {
  i.setConfig({
    chainURL: 'https://lb-fullnode.incognito.org/fullnode',
    apiURL: 'https://api.incognito.org',
    mainnet: true,
    wasmPath: '../../privacy.wasm',
    deviceId: '1234',
    deviceToken: '1234',
    logMethod: (mess) => {
      console.log(mess)
    },
  })

  if (runtime.loaded) {
    return
  }
  await sdk.initSDK()

  if (runtime.loaded) {
    return runtime.walletRuntime
  }

  const isHaveBackup = await isHaveBackupWallet()
  if (isHaveBackup) {
    await unlockWallet()
    return runtime.walletRuntime
  }
}

export const removeAccount = async (accountName: string) => {
  const wallet = await getWalletInstance()
  wallet.masterAccount.removeAccount(accountName)
}
export const getBackupAccount = async (accountName: string) => {
  const accountInstance = await getAccountRuntime(accountName)
  const accountSerizialed = await serializeAccount(accountInstance)
  return accountSerizialed
}
export const getWalletInstance = async () => {
  await loadingWallet()
  return runtime.walletRuntime
}

export const getAccountRuntime = async (accountName: string) => {
  const wa = await getWalletInstance()
  const account = wa.masterAccount.getAccountByName(accountName)
  if (!account) {
    return wa.masterAccount.getAccounts()[0]
  }
  return account
}

export const createWalletWithPassword = async (name: string, password: string) => {
  const runtimeDraft = createDraft(runtime)
  runtimeDraft.runtimePassword = crypto.SHA256(password, passwordSecret).toString()
  const code = new Mnemonic(Mnemonic.Words.ENGLISH)
  const instance = new i.WalletInstance()
  runtimeDraft.walletRuntime = await instance.init(name)
  storageService.set(CONSTANTS.PASS_KEY, runtimeDraft.runtimePassword)
  storageService.set(CONSTANTS.PARA_KEY, code.toString())
  runtimeDraft.loaded = true
  runtime = finishDraft(runtimeDraft)
  localStorage.setItem('isCreatedWallet', 'true')
  await backupWallet()
  if (name && password) {
    const date = new Date()
    downloadBackupWallet(password)
    localStorage.setItem('de', JSON.stringify(date.getTime() + 86400000))
  }
}

export const isHaveBackupWallet = async () => {
  const backup = await storageService.get(CONSTANTS.WALLET_BACKUP_KEY)
  if (backup) {
    return true
  }

  return false
}

export const unlockWallet = async () => {
  const backup = await storageService.get(CONSTANTS.WALLET_BACKUP_KEY)
  const password = await storageService.get(CONSTANTS.PASS_KEY)
  if (!backup) {
    throw new Error('Create wallet before!')
  }
  const runtimeDraft = createDraft(runtime)
  runtimeDraft.walletRuntime = await i.WalletInstance.restore(backup, password)
  runtimeDraft.loaded = true

  runtime = finishDraft(runtimeDraft)
}

export const backupWallet = async () => {
  const wallet = await getWalletInstance()
  const password = await storageService.get(CONSTANTS.PASS_KEY)
  const backupStr = wallet.backup(password)
  storageService.set(CONSTANTS.WALLET_BACKUP_KEY, backupStr)
}

export const downloadBackupWallet = async (password) => {
  const wallet = await getWalletInstance()
  console.log('wallet', wallet)
  const text = ['NAME:', wallet.name, 'WALLET: ', wallet.seed, 'MNEMONIC: ', wallet.mnemonic, 'PASSWORD: ', password, 'SEED: ', wallet.seed.toString()].join(
    '\n',
  )
  const element = document.createElement('a')
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`)
  element.setAttribute('download', `backup-${wallet.name}-${new Date().toISOString()}.txt`)
  element.style.display = 'none'
  element.click()
}

export const downloadAccountBackup = async (accountName: string) => {
  const wallet = await getWalletInstance()
  const account = wallet.masterAccount.getAccountByName(accountName)
  const password = await storageService.get(CONSTANTS.PASS_KEY)
  const text = [
    'ADDRESS: ',
    account.key.keySet.paymentAddressKeySerialized,
    'PRIVATE_KEY: ',
    account.key.keySet.privateKeySerialized,
    'PUBLIC_KEY: ',
    account.key.keySet.publicKeySerialized,
    'VIEW_ONLY_KEY: ',
    account.key.keySet.viewingKeySerialized,
    'MINING_SEED_KEY: ',
    account.key.keySet.miningSeedKey.join(' '),
    'PASSWORD: ',
    password,
  ].join('\n')
  const element = document.createElement('a')
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`)
  element.setAttribute('download', `backup-account-${accountName}-${new Date().toISOString()}.txt`)
  element.style.display = 'none'
  element.click()
}

export type SendInNetWorkPayload = {
  fromAccountName: string
  targetAccountAddress: string
  token: string
  nanoOfAmount: any
  estimatedFee: any
  message?: string
}

export const sendInNetwork = async (payload: SendInNetWorkPayload) => {
  const account = await getAccountRuntime(payload.fromAccountName)
  if (account) {
    throw new Error(`Account ${payload.fromAccountName} not existed!`)
  }

  if (isNative(payload.token)) {
    const balance = await account.nativeToken.getAvaiableBalance()
    if (balance <= payload.nanoOfAmount) {
      throw new Error(`Currently balance is not enough: ${balance}`)
    }

    const payment = new i.PaymentInfoModel({
      paymentAddress: payload.targetAccountAddress,
      amount: payload.nanoOfAmount.toString(),
      message: payload.message,
    })

    return account.nativeToken.transfer([payment], '0')
  }

  throw new Error('Not supported yet!')
}

export const isNative = (token: string) => i.CONSTANT.WALLET_CONSTANT.PRVIDSTR === token

export const followToken = async (selectedAccount: string, tokenId: string) => {
  const account = await getAccountRuntime(selectedAccount)
  account.followTokenById(tokenId)
  await backupWallet()
}

export const unfollowToken = async (selectedAccount: string, tokenId: string) => {
  const account = await getAccountRuntime(selectedAccount)
  account.unfollowTokenById(tokenId)

  await backupWallet()
}

export const importAccountFromPrivateKey = async (accountName: string, privateKey: string) => {
  const wallet = await getWalletInstance()
  const newAccount = await wallet.masterAccount.importAccount(accountName, privateKey)
  await backupWallet()

  return newAccount
}

export const addNewAccount = async (accountName: string) => {
  const wallet = await getWalletInstance()
  const newAccount = await wallet.masterAccount.addAccount(accountName)
  await backupWallet()
  return newAccount
}

export const getTokenBalanceForAccount = async (accountName: string, tokenId: string) => {
  const wallet = await getWalletInstance()
  const account = wallet.masterAccount.getAccountByName(accountName)

  if (!account) {
    return 0
  }
  if (tokenId === i.CONSTANT.WALLET_CONSTANT.PRVIDSTR) {
    return ((await account.nativeToken.getAvaiableBalance()).toNumber() * i.CONSTANT.WALLET_CONSTANT.NanoUnit).toFixed(2)
  }

  const tokenInstance = (await account.getFollowingPrivacyToken(tokenId)) as i.PrivacyTokenInstance
  if (!tokenInstance) {
    return 0
  }

  const { pDecimals } = tokenInstance.bridgeInfo
  const result = await tokenInstance.getAvaiableBalance()
  return (result.toNumber() * Math.pow(10, -pDecimals)).toFixed(2)
}

export const getAccountListName = async () => {
  const wallet = await getWalletInstance()
  return wallet.masterAccount.getAccounts().map((i) => i.name)
}

export const estimateFee = async (
  paymentAmount: number,
  tokenId: TokenItemInterface['TokenID'],
  accountName: string,
  walletAddress: string,
  network = 'in-network',
  setIsLoading = (value) => {},
) => {
  if (paymentAmount === 0) {
    return 0
  }
  const wallet = await getWalletInstance()
  const account = wallet.masterAccount.getAccountByName(accountName)

  if (!account) {
    setIsLoading(false)
    return MAX_DEX_FEE
  }

  if (tokenId === CONSTANT.WALLET_CONSTANT.PRVIDSTR) {
    setIsLoading(false)
    return MAX_DEX_FEE
  }
  let userFeesData: any = {}
  let userFee = '0'
  let feeEst = 0
  const feePayload = {
    Prv: MAX_DEX_FEE,
    TokenID: tokenId,
  }

  const feeEstResponse = (await apiGetEstimateFeeFromChain(feePayload)) as AxiosResponse<any>
  const tokenInstance = (await account.getFollowingPrivacyToken(tokenId)) as i.PrivacyTokenInstance
  const { bridgeInfo } = tokenInstance
  const isErc20Token = tokenInstance.isPrivacyToken && tokenInstance.bridgeInfo.currencyType === PRIVATE_TOKEN_CURRENCY_TYPE.ERC20
  const isETH = tokenInstance.symbol === CRYPTO_SYMBOL.ETH
  const isDecentralized = isETH || isErc20Token
  const originalAmount = paymentAmount
  const requestedAmount = convert.toOriginalAmount(paymentAmount, bridgeInfo.pDecimals)
  const { paymentAddress } = account.getSerializedInformations()
  const { currencyType } = tokenInstance.bridgeInfo
  const tokenContractID = isETH ? '' : tokenInstance.bridgeInfo.contractID
  const externalSymbol = tokenInstance.bridgeInfo.symbol
  const isUsedPRVFee = true // change when calculate by other token

  if (isDecentralized) {
    const data = {
      requestedAmount,
      originalAmount,
      paymentAddress,
      walletAddress,
      tokenContractID,
      tokenId,
      burningTxId: '',
      currencyType,
      isErc20Token,
      externalSymbol,
      isUsedPRVFee,
    }
    const userFeesResponse = await estimateUserFees(data)
    userFeesData = userFeesResponse.data
  } else {
    const centralizedPayload = {
      originalAmount: paymentAmount,
      requestedAmount: convert.toOriginalAmount(paymentAmount, bridgeInfo.pDecimals),
      paymentAddress: account.getSerializedInformations().paymentAddress,
      walletAddress,
      tokenId,
      currencyType: tokenInstance.bridgeInfo.currencyType,
    }
    userFeesData = await genCentralizedWithdrawAddress(centralizedPayload)
  }
  userFee = isUsedPRVFee ? userFeesData.Result.PrivacyFees.Level1 : userFeesData.Result.TokenFees.Level1
  feeEst = feeEstResponse.data.Params[0].NativeTokenAmount
  switch (network) {
    case 'in-network':
      console.log('in-net')
      const totalEstInNetworkFee = Math.floor(feeEst + parseInt(userFee))
      const totalInNetworkFee = Math.min(totalEstInNetworkFee || MAX_DEX_FEE, MAX_DEX_FEE)
      console.info('[Info] Token tokenId', tokenId, 'totalFee in nano', totalInNetworkFee)
      setIsLoading(false)
      return totalInNetworkFee
    case 'out-network':
      const internalFee = Math.min(Math.floor(feeEst), MAX_DEX_FEE)
      const externalFee = Math.floor(parseInt(userFee))
      const totalOutNetworkFee = internalFee + externalFee
      console.info('[Info] Token tokenId', tokenId, 'totalFee in nano', totalOutNetworkFee)
      setIsLoading(false)
      return totalOutNetworkFee
  }
}
export const NETWORK_FEE_PRV = {
  fee: 4 * MAX_DEX_FEE,
  feeToken: {
    id: '0000000000000000000000000000000000000000000000000000000000000004',
    name: 'Privacy',
    displayName: 'Privacy',
    symbol: 'PRV',
    pDecimals: 9,
    hasIcon: true,
    originalSymbol: 'PRV',
    isVerified: true,
  },
}
export const initFee = {
  fee: NETWORK_FEE_PRV.fee,
  feeToken: NETWORK_FEE_PRV.feeToken,

  originalFee: NETWORK_FEE_PRV.fee,
  originalFeeToken: NETWORK_FEE_PRV.feeToken,

  canChooseFee: false,
}

export const caculatorFee = (payload) => {
  const { inputToken, outputToken } = payload
  // const prvFee = MAX_DEX_FEE
  // const prvFeeToken = {
  //   id: '0000000000000000000000000000000000000000000000000000000000000004',
  //   name: 'Privacy',
  //   displayName: 'Privacy',
  //   symbol: 'PRV',
  //   pDecimals: 9,
  //   hasIcon: true,
  //   originalSymbol: 'PRV',
  //   isVerified: true,
  // }
  if (inputToken?.id === PRV_ID || outputToken?.id !== PRV_ID) {
    return cloneDeep(initFee)
  }
}
