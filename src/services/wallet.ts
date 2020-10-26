import * as Mnemonic from 'bitcore-mnemonic'
import { passwordSecret } from 'constants/crypto'
import crypto from 'crypto-js'
import * as i from 'incognito-sdk'
import { WalletInstance } from 'incognito-sdk'
import { PrivacyToken } from 'incognito-sdk/build/web/module/src/walletInstance/token'

import * as CONSTANTS from '../constants/app'
import { serializeWallet } from '../models/wallet-model'
import { ERROR_CODE } from './errors'
import { sdk } from './incognito/sdk'
import { storageService } from './storage'

// eslint-disable-next-line import/no-mutable-exports
export let walletRuntime: WalletInstance

let runtimePassword: string

export const getWalletInstance = async () => {
  await sdk.initSDK()
  const isHaveBackup = await isHaveBackupWallet()

  if (walletRuntime?.name) {
    return walletRuntime
  }

  if (isHaveBackup) {
    const wallet = await unlockWallet()
    return wallet
  }
}

export const getAccountRuntime = async (accountName: string) => {
  const wa = await getWalletInstance()
  const account = wa.masterAccount.getAccountByName(accountName)
  return account
}

export const createWalletWithPassword = async (name: string, password: string) => {
  runtimePassword = crypto.SHA256(password, passwordSecret).toString()
  const code = new Mnemonic(Mnemonic.Words.ENGLISH)
  const instance = new i.WalletInstance()
  walletRuntime = await instance.init(code.toString() + password, name)
  storageService.set(CONSTANTS.PASS_KEY, runtimePassword)
  storageService.set(CONSTANTS.PARA_KEY, code.toString())
  await backupWallet(runtimePassword)
  return walletRuntime
}

export const isHaveBackupWallet = async () => {
  if (walletRuntime?.name) {
    return true
  }
  const backup = await storageService.get(CONSTANTS.WALLET_BACKUP_KEY)
  if (backup) {
    return true
  }

  return false
}

export const unlockWallet = async () => {
  const backup = await storageService.get(CONSTANTS.WALLET_BACKUP_KEY)
  const password = await storageService.get(CONSTANTS.PASS_KEY)

  console.log(backup, password)
  if (!backup) {
    throw new Error('Create wallet before!')
  }
  walletRuntime = await i.WalletInstance.restore(backup, password)
  return walletRuntime
}

export const backupWallet = async (password: string) => {
  const backupStr = walletRuntime.backup(password)
  console.log('set', backupStr, password)
  storageService.set(CONSTANTS.WALLET_BACKUP_KEY, backupStr)
}

export const downloadBackupWallet = async () => {
  const text = [
    'NAME:',
    walletRuntime.name,
    'WALLET: ',
    walletRuntime.seed,
    'MNEMONIC: ',
    walletRuntime.mnemonic,
    'PASS_PARAPHRASE: ',
    walletRuntime.passPhrase,
    'ENTROPY: ',
    walletRuntime.entropy.toString(),
    'SEED: ',
    walletRuntime.seed.toString(),
  ].join('\n')
  const element = document.createElement('a')
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`)
  element.setAttribute('download', `backup-${walletRuntime.name}-${new Date().toISOString()}.txt`)
  element.style.display = 'none'
  element.click()
}

export const downloadAccountBackup = async (accountName: string) => {
  const account = walletRuntime.masterAccount.getAccountByName(accountName)
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
  nanoOfAmount: i.BN
  estimatedFee: i.BN
  message?: string
}

export const sendInNetwork = async (payload: SendInNetWorkPayload) => {
  const account = walletRuntime.masterAccount.getAccountByName(payload.fromAccountName)
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

    return account.nativeToken.transfer([payment], i.CONSTANT.DEFAULT_NATIVE_FEE)
  }

  throw new Error('Not supported yet!')
}

export const isNative = (token: string) => i.CONSTANT.WALLET_CONSTANT.PRVIDSTR === token

export const followToken = async (selectedAccount: string, tokenId: string) => {
  const account = await getAccountRuntime(selectedAccount)
  account.followTokenById(tokenId)
  const password = await storageService.get(CONSTANTS.PASS_KEY)
  await backupWallet(password)
}

export const unfollowToken = async (selectedAccount: string, tokenId: string) => {
  const account = await getAccountRuntime(selectedAccount)
  account.unfollowTokenById(tokenId)
  const password = await storageService.get(CONSTANTS.PASS_KEY)
  await backupWallet(password)
}

export const importAccountFromPrivateKey = async (accountName: string, privateKey: string) => {
  const wallet = await getWalletInstance()
  const newAccount = await wallet.masterAccount.importAccount(accountName, privateKey)
  return newAccount
}

export const getTokenBalanceForAccount = async (accountName: string, tokenId: string) => {
  const wallet = await getWalletInstance()
  const account = wallet.masterAccount.getAccountByName(accountName)

  if (tokenId === i.CONSTANT.WALLET_CONSTANT.PRVIDSTR) {
    return ((await account.nativeToken.getAvaiableBalance()).toNumber() * i.CONSTANT.WALLET_CONSTANT.NanoUnit).toFixed(2)
  }

  const tokenInstance = (await account.getFollowingPrivacyToken(tokenId)) as PrivacyToken
  const result = await tokenInstance.getAvaiableBalance()
  return result.toNumber()
}
