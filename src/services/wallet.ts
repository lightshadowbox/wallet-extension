import * as Mnemonic from 'bitcore-mnemonic'
import { passwordSecret } from 'constants/crypto'
import crypto from 'crypto-js'
import { WalletInstance } from 'incognito-sdk'

import * as CONSTANTS from '../constants/app'
import { serializeWallet } from '../models/wallet-model'
import { ERROR_CODE } from './errors'
import * as sdk from './incognito/sdk'
import { storageService } from './storage'

let walletRuntime: WalletInstance
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
  walletRuntime = await sdk.getWalletInstance().init(code.toString() + password, name)
  console.log(CONSTANTS.PARA_KEY, code.toString())
  storageService.set(CONSTANTS.PASS_KEY, runtimePassword)
  storageService.set(CONSTANTS.PARA_KEY, code.toString())
  await backupWallet(password)
  return walletRuntime
}

export const isCreatedWallet = async () => {
  await sdk.initSDK()
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
  walletRuntime = await WalletInstance.restore(backup, password)
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
