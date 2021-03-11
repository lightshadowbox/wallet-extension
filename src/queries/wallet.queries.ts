import { WalletModelType } from 'models/wallet-model'
import { useQuery } from 'react-query'
import { getFromCache } from 'services/query-cache'
import { getWalletInstance, getBackupWallet } from 'services/wallet'

export const GET_WALLET_KEY = 'getWalletSerialized'

export const useGetWallet = () => {
  const hook = useQuery(useGetWallet.name, getWalletInstance)
  return hook
}
export const useGetBackupWallet = () => {
  return useQuery(['useGetBackupWallet.name'], () => getBackupWallet())
}

export const getWalletSerializedFromCache = () => getFromCache<WalletModelType>(GET_WALLET_KEY)

export const useGetWalletGeneral = () => {
  const walletHook = useQuery(useGetWalletGeneral.name, async () => {
    const wallet = await getWalletInstance()

    return {
      walletName: wallet.name,
      accounts: wallet.masterAccount.getAccounts().map((i) => i.name),
    }
  })
  return walletHook
}
