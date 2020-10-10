import { useQuery } from 'react-query'
import { getWalletSerialized } from 'services/wallet'

export const useGetWallet = () => {
  const hook = useQuery(['getWalletSerialized'], getWalletSerialized)
  return hook
}
