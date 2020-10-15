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

  if (!walletRuntime) {
    await unlockWallet()
  }

  const walletSerialized = await serializeWallet(walletRuntime)
  return walletSerialized
}

export const createWalletWithPassword = async (name: string, password: string) => {
  runtimePassword = crypto.SHA256(password, passwordSecret).toString()
  const code = new Mnemonic(Mnemonic.Words.ENGLISH)
  walletRuntime = await sdk.getWalletInstance().init(code.toString() + password, name)
  storageService.set(CONSTANTS.PASS_KEY, runtimePassword)
  storageService.set(CONSTANTS.PARA_KEY, code.toString())
  return walletRuntime
}

export const isCreatedWallet = async () => {
  if (walletRuntime) {
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

  if (!backup) {
    throw new Error('Create wallet before!')
  }
  walletRuntime = await WalletInstance.restore(backup, password)
  return walletRuntime
}

export const backupWallet = async () => {
  const password = await storageService.get(CONSTANTS.PASS_KEY)
  storageService.set(CONSTANTS.WALLET_BACKUP_KEY, walletRuntime.backup(password))
}
