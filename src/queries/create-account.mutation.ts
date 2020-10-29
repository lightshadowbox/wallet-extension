import { store } from 'popup/stores'
import { settingSlices, useSettingStore } from 'popup/stores/features/settings'
import { useMutation } from 'react-query'
import { queryCache } from 'services/query-cache'
import { getAccountRuntime, runtime } from 'services/wallet'
import { PrivacyToken } from 'incognito-sdk/build/web/module/src/walletInstance/token'
import { useGetAccount, useGetListAccount } from './account.queries'

import { createWalletWithPassword, followToken, importAccountFromPrivateKey, unfollowToken } from '../services/wallet'

import { useGetTokenForAccount } from './token.queries'
import { GET_WALLET_KEY } from './wallet.queries'

export const useCreateWallet = () => {
  return useMutation((params: { password: string; name: string }) => createWalletWithPassword(params.name, params.password), {
    onSuccess: async (data, { name }) => {
      console.log('created wallet name: ', name)
      await queryCache.invalidateQueries(GET_WALLET_KEY)
      const firstAccount = runtime.walletRuntime.masterAccount.getAccounts()[0]
      console.log('Set default first account: ', name)
      store.dispatch(settingSlices.actions.setWalletName({ walletName: runtime.walletRuntime.name }))
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
export const useAddAccount = (hidePanel: () => void) => {
  return useMutation((accountName: string) => addAccount(accountName), {
    onSuccess: async () => {
      await queryCache.invalidateQueries([useGetListAccount.name])
      hidePanel()
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
interface PaymentInfoModel {
  paymentAddressStr: string
  amount: number
  message: string
}
interface ErrorSendToken {
  name: string
  code: string
  message: string
}
export const useSendNativeToken = (hidePanel: () => void, setMessage: (value: any) => void) => {
  return useMutation(
    (variables: { accountName: string; paymentInfoList: PaymentInfoModel[]; tokenId: string }) =>
      sendNativeToken(variables.accountName, variables.paymentInfoList, variables.tokenId),
    {
      onSuccess: async () => {
        // hidePanel()
        setMessage({
          name: 'Success',
          message: 'Send successfully!',
        })
      },
      onError: (err: ErrorSendToken) => {
        setMessage({
          name: 'error',
          message: err.message,
        })
      },
    },
  )
}
const sendNativeToken = async (accountName: string, paymentInfoList: any[], tokenId) => {
  const account = await getAccountRuntime(accountName)
  if (tokenId === null) {
    const history = await account.nativeToken.transfer(paymentInfoList, '20')
    console.log(history)
  } else {
    const token = (await account.getFollowingPrivacyToken(tokenId)) as PrivacyToken
    const history1 = await token.transfer(paymentInfoList, '20', '1')
    console.log(history1)
  }
}
export const addAccount = async (accountName: string) => {
  const account = await runtime.walletRuntime.masterAccount.addAccount(accountName, 3)
  console.log('Account with shard ID 3', account)
  console.log(runtime.walletRuntime.masterAccount.getAccounts())
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
