import * as Mnemonic from 'bitcore-mnemonic'
import { passwordSecret } from 'constants/crypto'
import crypto from 'crypto-js'

import {
  PARA_KEY,
  PASS_KEY,
  WALLET_BACKUP_KEY
} from '../constants/app'
import { serializeWallet } from '../models/wallet-model'
import { ERROR_CODE } from './errors'
import {
  incognitos,
  sdk
} from './incognito/sdk'
import { storageService } from './storage'

let walletRuntime: incognitos.WalletInstance
let runtimePassword: string

export const createEmptyWalletForTest = async () => {
  // For mocking only, replace when create wallet
  walletRuntime = await sdk.walletInstance.init('passparaphraase', 'this is name')
}

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
  walletRuntime = await sdk.walletInstance.init(code.toString() + password, name)
  storageService.set(PASS_KEY, runtimePassword)
  storageService.set(PARA_KEY, code.toString())
  return walletRuntime
}

export const isCreatedWallet = async () => {
  if (walletRuntime) {
    return true
  }
  const backup = await storageService.get(WALLET_BACKUP_KEY)
  if (backup) {
    return true
  }
  return false
}

export const unlockWallet = async () => {
  const backup = await storageService.get(WALLET_BACKUP_KEY)
  const password = await storageService.get(PASS_KEY)

  if (!backup) {
    throw new Error('Create wallet before!')
  }
  walletRuntime = await incognitos.WalletInstance.restore(backup, password)
  return walletRuntime
}

export const backupWallet = async () => {
  const password = await storageService.get(PASS_KEY)
  storageService.set(WALLET_BACKUP_KEY, walletRuntime.backup(password))
}
