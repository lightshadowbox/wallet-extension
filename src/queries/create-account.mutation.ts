import { store } from 'popup/stores'
import { settingSlices, useSettingStore } from 'popup/stores/features/settings'
import { useMutation } from 'react-query'
import { queryCache } from 'services/query-cache'

import { addNewAccount, createWalletWithPassword, followToken, getWalletInstance, importAccountFromPrivateKey, unfollowToken } from '../services/wallet'

import { useGetAccount, useGetListAccount } from './account.queries'
import { useGetTokenForAccount } from './token.queries'
import { GET_WALLET_KEY } from './wallet.queries'

export const useCreateWallet = () => {
  return useMutation((params: { password: string; name: string }) => createWalletWithPassword(params.name, params.password), {
    onSuccess: async (_, { name }) => {
      console.log('created wallet name: ', name)
      await queryCache.invalidateQueries(GET_WALLET_KEY)
      const wallet = await getWalletInstance()
      const firstAccount = wallet.masterAccount.getAccounts()[0]
      console.log('Set default first account: ', name)
      store.dispatch(settingSlices.actions.setWalletName({ walletName: wallet.name }))
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

export const useAddAccount = (onSuccess: () => void) => {
  return useMutation((accountName: string) => addNewAccount(accountName), {
    onSuccess: async () => {
      await queryCache.invalidateQueries([useGetListAccount.name])
      onSuccess()
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
      await queryCache.invalidateQueries([useGetListAccount.name])
      await queryCache.invalidateQueries([useGetAccount.name])
      await queryCache.invalidateQueries([useGetTokenForAccount.name])
      onSuccess && onSuccess()
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
