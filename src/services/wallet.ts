/* eslint-disable import/no-mutable-exports */
import * as Mnemonic from 'bitcore-mnemonic'
import { passwordSecret } from 'constants/crypto'
import crypto from 'crypto-js'
import * as i from 'incognito-sdk'
import { WalletInstance } from 'incognito-sdk'
import { AccountModelType, serializeAccount } from 'models/account-model'
import { PrivacyToken } from 'incognito-sdk/build/web/module/src/walletInstance/token'

import { createDraft, finishDraft } from 'immer'
import { WritableDraft } from 'immer/dist/internal'
import * as CONSTANTS from '../constants/app'
import { sdk } from './incognito/sdk'
import { storageService } from './storage'

export let runtime: WritableDraft<{ walletRuntime: WalletInstance; loaded: boolean; runtimePassword?: string }> = createDraft({
  walletRuntime: null,
  loaded: false,
})

export const loadingWallet = async () => {
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
  runtimeDraft.walletRuntime = await instance.init(code.toString() + password, name)
  storageService.set(CONSTANTS.PASS_KEY, runtimeDraft.runtimePassword)
  storageService.set(CONSTANTS.PARA_KEY, code.toString())
  runtimeDraft.loaded = true
  runtime = finishDraft(runtimeDraft)
  await backupWallet()
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

export const downloadBackupWallet = async () => {
  const wallet = await getWalletInstance()

  const text = [
    'NAME:',
    wallet.name,
    'WALLET: ',
    wallet.seed,
    'MNEMONIC: ',
    wallet.mnemonic,
    'PASS_PARAPHRASE: ',
    wallet.passPhrase,
    'ENTROPY: ',
    wallet.entropy.toString(),
    'SEED: ',
    wallet.seed.toString(),
  ].join('\n')
  const element = document.createElement('a')
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`)
  element.setAttribute('download', `backup-${wallet.name}-${new Date().toISOString()}.txt`)
  element.style.display = 'none'
  element.click()
}

export const downloadAccountBackup = async (accountName: string) => {
  const wallet = await getWalletInstance()
  const account = wallet.masterAccount.getAccountByName(accountName)
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

    return account.nativeToken.transfer([payment], i.CONSTANT.DEFAULT_NATIVE_FEE)
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

  const tokenInstance = (await account.getFollowingPrivacyToken(tokenId)) as PrivacyToken

  if (!tokenInstance) {
    return 0
  }

  const result = await tokenInstance.getAvaiableBalance()
  return result.toNumber()
}

export const getAccountListName = async () => {
  const wallet = await getWalletInstance()
  return wallet.masterAccount.getAccounts().map((i) => i.name)
}
