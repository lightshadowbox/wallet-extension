import { WalletModelType } from 'models/wallet-model'
import { useQuery } from 'react-query'
import { getFromCache } from 'services/query-cache'
import { getWalletInstance, walletRuntime } from 'services/wallet'

export const GET_WALLET_KEY = 'getWalletSerialized'

export const useGetWallet = () => {
  const hook = useQuery(useGetWallet.name, getWalletInstance)
  return hook
}

export const getWalletSerializedFromCache = () => getFromCache<WalletModelType>(GET_WALLET_KEY)

export const useGetWalletGeneral = () => {
  const walletHook = useQuery(useGetWalletGeneral.name, () => {
    return {
      walletName: walletRuntime.name,
      accounts: walletRuntime.masterAccount.getAccounts().map((i) => i.name),
    }
  })
  return walletHook
}
