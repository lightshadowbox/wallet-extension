import { store } from 'popup/stores'
import { settingSlices, useSettingStore } from 'popup/stores/features/settings'
import { useMutation } from 'react-query'
import { queryCache } from 'services/query-cache'
import { getAccountRuntime, runtime, requestTrade } from 'services/wallet'
import { storageService } from 'services/storage'

import { passwordSecret } from 'constants/crypto'
import crypto from 'crypto-js'
import * as CONSTANTS from '../constants/app'
import { createWalletWithPassword, followToken, importAccountFromPrivateKey, unfollowToken } from '../services/wallet'

import { GET_WALLET_KEY } from './wallet.queries'

const PRV_TOKEN_ID = '0000000000000000000000000000000000000000000000000000000000000004'
export const useUnlockWallet = (setError: (value) => void) => {
  return useMutation(
    async (password: string) => {
      const passwordWallet = await storageService.get(CONSTANTS.PASS_KEY)
      const passwordEncrypt = crypto.SHA256(password, passwordSecret).toString()
      console.log('password', password, passwordWallet)
      if (passwordWallet === passwordEncrypt || password === passwordWallet) {
        return () => {}
      }
      setError('Please enter valid password!')
      throw new Error('Please enter valid password!')
    },
    {
      onSuccess: () => {
        const firstAccount = runtime.walletRuntime.masterAccount.getAccounts()[0]
        store.dispatch(settingSlices.actions.setWalletName({ walletName: runtime.walletRuntime.name }))
        store.dispatch(settingSlices.actions.selectAccount({ accountName: firstAccount.name }))
        localStorage.removeItem('isLogout')
      },
      onError: (err) => {
        console.log(err)
      },
    },
  )
}
export const useCreateWallet = () => {
  const [addAccount] = useAddAccount(() => {})
  return useMutation((params: { password: string; name: string }) => createWalletWithPassword(params.name, params.password), {
    onSuccess: async (data, { name }) => {
      await addAccount(name)
      await runtime.walletRuntime.masterAccount.removeAccount('Anon')
      await queryCache.invalidateQueries(GET_WALLET_KEY)
      const firstAccount = runtime.walletRuntime.masterAccount.getAccounts()[0]
      store.dispatch(settingSlices.actions.setWalletName({ walletName: runtime.walletRuntime.name }))
      store.dispatch(settingSlices.actions.selectAccount({ accountName: firstAccount.name }))
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
export const useRemoveAccount = () => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  return useMutation(() => removeAccount(selectedAccount), {
    onSuccess: () => {
      const firstAccount = runtime.walletRuntime.masterAccount.getAccounts()[0]
      store.dispatch(settingSlices.actions.selectAccount({ accountName: firstAccount.name }))
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
export const removeAccount = async (accountName: string) => {
  runtime.walletRuntime.masterAccount.removeAccount(accountName)
  console.log(`Removed: ${accountName}`)
  return accountName
}

export const useAddToken = () => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  return useMutation((tokenId: string) => followToken(selectedAccount, tokenId), {
    onSuccess: async () => {
      await queryCache.invalidateQueries(['useGetAccount.name'])
      await queryCache.invalidateQueries(['useGetTokenForAccount.name'])
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
export const useRecordTokens = () => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  return useMutation(async () => {
    const account = await getAccountRuntime(selectedAccount)
    const tokens = [...account.privacyTokenIds]
    const accountRecord = {
      accountName: selectedAccount,
      privateKey: account.key.keySet.privateKeySerialized,
      tokens,
    }
    localStorage.setItem('accountRecords', JSON.stringify(accountRecord))
    return tokens
  })
}
export const useRemoveToken = () => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)

  return useMutation((tokenId: string) => unfollowToken(selectedAccount, tokenId), {
    onSuccess: async () => {
      // Reload cache of useGetTokenForAccount hook
      await queryCache.invalidateQueries(['useGetAccount.name'])
      await queryCache.invalidateQueries(['useGetTokenForAccount.name'])
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
export const useAddAccount = (hidePanel: () => void) => {
  return useMutation((accountName: string) => addAccount(accountName), {
    onSuccess: async () => {
      await queryCache.invalidateQueries(['useGetListAccountName.name'])
      hidePanel()
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
export const useRenameAccount = (accountName: string) => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  const [importAccount] = useImportAccountFromPrivateKey(() => {})
  const [reAccount] = useRemoveAccount()
  return useMutation((params: { accountName: string }) => renameAccount(selectedAccount, params.accountName, reAccount, importAccount), {
    onSuccess: async () => {
      await queryCache.invalidateQueries(['useGetListAccountName.name'])
      await queryCache.invalidateQueries(['useGetAccount.name'])
      await queryCache.invalidateQueries(['useGetTokenForAccount.name'])
    },
    onError: async (err) => {
      console.log(err)
    },
  })
}
const renameAccount = async (selectedAccount: string, accountName: string, reAccount: any, importAccount: any) => {
  const account = await getAccountRuntime(selectedAccount)
  await reAccount()
  const importAcc = await importAccountFromPrivateKey(accountName, account.key.keySet.privateKeySerialized)
  return importAcc
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
export const useSendToken = (setLoading: (value) => void, setMessage: (value: any) => void) => {
  return useMutation(
    (variables: { accountName: string; paymentInfoList: PaymentInfoModel[]; tokenId: string; nativeFee: number; privacyFee?: number }) =>
      sendToken({
        accountName: variables.accountName,
        paymentInfoList: variables.paymentInfoList,
        tokenId: variables.tokenId,
        nativeFee: variables.nativeFee,
      }),
    {
      onSuccess: async () => {
        // hidePanel()
        setLoading(false)
        setMessage({
          name: 'Success',
          message: 'Send successfully!',
        })
      },
      onError: (err: ErrorSendToken) => {
        if (err.message) {
          setMessage({
            name: 'error',
            message: err.message,
          })
        } else {
          setMessage({
            name: 'error',
            message: 'Something went wrong',
          })
        }
        setLoading(false)
      },
    },
  )
}

export const useBurningToken = (setMessage: (value: any) => void, setLoading: (value: any) => void) => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  return useMutation(
    (variables: { tokenId: string; address: string; accountName: string | null; burningAmount: string; nativeFee: string }) => {
      if (variables.accountName) {
        return burningToken(variables.tokenId, variables.address, variables.accountName, variables.burningAmount, variables.nativeFee)
      }
      return burningToken(variables.tokenId, variables.address, selectedAccount, variables.burningAmount, variables.nativeFee)
    },
    {
      onSuccess: async () => {
        await queryCache.invalidateQueries(['useGetListAccountName.name'])
        await queryCache.invalidateQueries(['useGetAccount.name'])
        await queryCache.invalidateQueries(['useGetTokenForAccount.name'])
        setLoading(false)
      },
      onError: (err: ErrorSendToken) => {
        setLoading(false)
        setMessage({
          name: 'error',
          message: err.message,
        })
      },
    },
  )
}
const burningToken = async (tokenId: string, address: string, accountName: string, burningAmount: string, nativeFee: string) => {
  const account = await getAccountRuntime(accountName)
  const token = (await account.getFollowingPrivacyToken(tokenId)) as any
  const history = await token.burning(address, burningAmount, nativeFee, '0')
  console.log('Privacy token burned with history', history)
}

export interface SendInNetworkPayload {
  accountName: string
  paymentInfoList: any[]
  tokenId: string
  nativeFee: number // nanoPRV
  privacyFee?: number // nanoPRV
}

const sendToken = async (payload: SendInNetworkPayload) => {
  const { accountName, paymentInfoList, tokenId, nativeFee, privacyFee = 0 } = payload
  const account = await getAccountRuntime(accountName)
  console.log(account)
  if (tokenId !== PRV_TOKEN_ID) {
    const token = (await account.getFollowingPrivacyToken(tokenId)) as any
    const history = await token.transfer(paymentInfoList, nativeFee.toString(), privacyFee.toString())
    console.log(history)
  } else {
    const history = await account.nativeToken.transfer({
      paymentInfoList,
      nativeFee: nativeFee.toString(),
    })
    console.log(history)
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
      await queryCache.invalidateQueries(['useGetListAccountName.name'])
      await queryCache.invalidateQueries(['useGetAccount.name'])
      await queryCache.invalidateQueries(['useGetTokenForAccount.name'])
      onSuccess && onSuccess()
    },
    onError: (err) => {
      console.error(err)
    },
  })
}
export const useRequestTrade = (setMessage: (value: any) => void) => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  return useMutation(
    (variables: {
      tokenIdSell: string
      tokenIdBuy: string
      sellAmount: string
      minimumAcceptableAmount: string
      nativeFee: string
      privacyFee: string
      tradingFee: string
      accountName: string
    }) => {
      console.log(variables)
      if (variables.accountName) {
        return requestTrade(
          variables.accountName,
          variables.tokenIdSell,
          variables.tokenIdBuy,
          variables.sellAmount,
          variables.minimumAcceptableAmount,
          variables.nativeFee,
          variables.privacyFee,
          variables.tradingFee,
        )
      }
      return requestTrade(
        selectedAccount,
        variables.tokenIdSell,
        variables.tokenIdBuy,
        variables.sellAmount,
        variables.minimumAcceptableAmount,
        variables.nativeFee,
        variables.privacyFee,
        variables.tradingFee,
      )
    },
    {
      onSuccess: () => {
        setMessage({
          name: 'Success',
          message: 'Successful trade request',
        })
      },
      onError: (err: ErrorSendToken) => {
        if (err.message) {
          setMessage({
            name: 'error',
            message: err.message,
          })
        } else {
          setMessage({
            name: 'error',
            message: 'Something went wrong',
          })
        }
      },
    },
  )
}
