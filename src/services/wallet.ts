import * as Mnemonic from 'bitcore-mnemonic'
import { passwordSecret } from 'constants/crypto'
import crypto from 'crypto-js'
import * as i from 'incognito-sdk'
import token from 'popup/pages/home/components/add-token/components/token-list/token'

import * as CONSTANTS from '../constants/app'
import { serializeWallet } from '../models/wallet-model'
import { ERROR_CODE } from './errors'
import { sdk } from './incognito/sdk'
import { storageService } from './storage'

let walletRuntime: i.WalletInstance
let runtimePassword: string

export const getWalletSerialized = async () => {
  await sdk.initSDK()
  const isHaveWallet = await isCreatedWallet()

  if (!walletRuntime && !isHaveWallet) {
    throw new Error(ERROR_CODE.WALLET_NOT_CREATED)
  }

  const walletSerialized = await serializeWallet(walletRuntime)
  return walletSerialized
}

export const createWalletWithPassword = async (name: string, password: string) => {
  runtimePassword = crypto.SHA256(password, passwordSecret).toString()
  const code = new Mnemonic(Mnemonic.Words.ENGLISH)
  const instance = new i.WalletInstance()
  walletRuntime = await instance.init(code.toString() + password, name)
  storageService.set(CONSTANTS.PASS_KEY, runtimePassword)
  storageService.set(CONSTANTS.PARA_KEY, code.toString())
  await backupWallet(password)
  return walletRuntime
}

export const isCreatedWallet = async () => {
  // console.log('unlockWallet ',  walletRuntime)

  if (walletRuntime?.name) {
    return true
  }
  // const backup = await storageService.get(CONSTANTS.WALLET_BACKUP_KEY)

  // if (backup) {
  //   await unlockWallet()
  //   console.log('unlockWallet', walletRuntime.name, backup)
  //   return true
  // }

  return false
}

export const unlockWallet = async () => {
  const backup = await storageService.get(CONSTANTS.WALLET_BACKUP_KEY)
  const password = await storageService.get(CONSTANTS.PASS_KEY)

  if (!backup) {
    throw new Error('Create wallet before!')
  }
  walletRuntime = await i.WalletInstance.restore(backup, password)
  return walletRuntime
}

export const backupWallet = async (password: string) => {
  storageService.set(CONSTANTS.WALLET_BACKUP_KEY, walletRuntime.backup(password))
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
