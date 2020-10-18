import { useQuery } from 'react-query'
import { isCreatedWallet } from 'services/wallet'
import { GET_WALLET_KEY } from './use-get-wallet'

export const useIsAlreadyHaveWallet = () => {
  const hookRes = useQuery([GET_WALLET_KEY], isCreatedWallet, {
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  })
  return !!hookRes.data
}
