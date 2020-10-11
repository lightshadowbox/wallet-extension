import { useMutation } from 'react-query'
import { queryCache } from 'services/query-cache'

import { createWalletWithPassword } from '../services/wallet'
import { GET_WALLET_KEY } from './use-get-wallet'

export const useCreateWallet = () => {
  return useMutation(
    (params: { password: string; name: string }) => createWalletWithPassword(params.name, params.password),
    {
      onSuccess: async (data, { name }) => {
        console.log('created wallet name: ', name)
        await queryCache.invalidateQueries(GET_WALLET_KEY)
      },
      onError: (err) => {
        console.error(err)
      },
    }
  )
}
