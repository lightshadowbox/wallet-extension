import * as incognitos from 'incognito-js/build/web/module'

import { serializeWallet } from '../models/wallet-model'
import { sdk } from './incognito/sdk'

let walletRuntime: incognitos.WalletInstance

export const createEmptyWalletForTest = async () => {
  // For mocking only, replace when create wallet
  walletRuntime = await sdk.walletInstance.init('passparaphraase', 'this is name')
}

export const getWalletSerialized = async () => {
  // TODO: Replace by load wallet from storage after feature CreateWallet is implemented
  if (!walletRuntime) {
    await sdk.initSDK()
    await createEmptyWalletForTest()
  }

  const walletSerialized = await serializeWallet(walletRuntime)
  return walletSerialized
}
