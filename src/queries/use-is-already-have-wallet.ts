import { useQuery } from 'react-query'
import { isCreatedWallet } from 'services/wallet'

export const GET_WALLET_KEY = 'getWalletSerialized'

export const useIsAlreadyHaveWallet = () => {
  return useQuery([GET_WALLET_KEY], isCreatedWallet, { refetchInterval: 1000, refetchIntervalInBackground: true })
}
