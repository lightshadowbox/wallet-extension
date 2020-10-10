import * as incognitos from 'incognito-js'
import { useQuery } from 'react-query'

import { serializeWallet } from '../models/wallet-model'
import { sdk } from './incognito/sdk'

let wallet: incognitos.WalletInstance

export const createEmptyWalletForTest = async () => {
  // For mocking only, replace when create wallet
  wallet = await sdk.walletInstance.init('passparaphraase', 'this is name')
}

export const getWalletSerialized = async () => {
  // TODO: Replace by load wallet from storage after feature CreateWallet is implemented
  if (!wallet) {
    await createEmptyWalletForTest()
  }

  const walletSerialized = await serializeWallet(wallet)
  return walletSerialized
}

export const useGetWallet = () => {
  const hook = useQuery(['getWalletSerialized', { walletName: wallet.name }], getWalletSerialized)
  return hook
}
