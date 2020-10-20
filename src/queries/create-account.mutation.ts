import { useMutation } from 'react-query'
import { queryCache } from 'services/query-cache'
import { store } from 'popup/stores'
import { settingSlices, useSettingStore } from 'popup/stores/features/settings'

import { createWalletWithPassword, followToken, unfollowToken } from '../services/wallet'
import { GET_WALLET_KEY } from './wallet.queries'
import { useGetTokenForAccount } from './token.queries'
import { useGetAccount } from './account.queries'

export const useCreateWallet = () => {
  return useMutation((params: { password: string; name: string }) => createWalletWithPassword(params.name, params.password), {
    onSuccess: async (data, { name }) => {
      console.log('created wallet name: ', name)
      await queryCache.invalidateQueries(GET_WALLET_KEY)
      const firstAccount = data.masterAccount.getAccounts()[0]
      console.log('Set default first account: ', name)
      store.dispatch(settingSlices.actions.setWalletName({ walletName: data.name }))
      store.dispatch(settingSlices.actions.selectAccount({ accountName: firstAccount.name }))
    },
    onError: (err) => {
      console.error(err)
    },
  })
}

export const useAddToken = () => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)

  return useMutation((tokenId: string) => followToken(selectedAccount, tokenId), {
    onSuccess: async () => {
      await queryCache.invalidateQueries([useGetAccount.name])
      await queryCache.invalidateQueries([useGetTokenForAccount.name])
    },
    onError: (err) => {
      console.error(err)
    },
  })
}

export const useRemoveToken = () => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)

  return useMutation((tokenId: string) => unfollowToken(selectedAccount, tokenId), {
    onSuccess: async () => {
      // Reload cache of useGetTokenForAccount hook
      await queryCache.invalidateQueries([useGetAccount.name])
      await queryCache.invalidateQueries([useGetTokenForAccount.name])
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
