import { store } from 'popup/stores'
import { settingSlices, useSettingStore } from 'popup/stores/features/settings'
import { useMutation } from 'react-query'
import { queryCache } from 'services/query-cache'

import { createWalletWithPassword, followToken, importAccountFromPrivateKey, unfollowToken } from '../services/wallet'

import { useGetAccount } from './account.queries'
import { useGetTokenForAccount } from './token.queries'
import { GET_WALLET_KEY } from './wallet.queries'

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
export const useSwitchAccount = (accountName: string) => {
  store.dispatch(settingSlices.actions.selectAccount({ accountName }))
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

export const useImportAccountFromPrivateKey = (onSuccess?: CallableFunction) => {
  return useMutation((variables: { accountName: string; privateKey: string }) => importAccountFromPrivateKey(variables.accountName, variables.privateKey), {
    onSuccess: async (data) => {
      // Select account to new
      store.dispatch(settingSlices.actions.selectAccount({ accountName: data.name }))
      // Reload cache of useGetTokenForAccount hook
      await queryCache.invalidateQueries([useGetAccount.name])
      await queryCache.invalidateQueries([useGetTokenForAccount.name])
      onSuccess && onSuccess()
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
