/* eslint-disable no-await-in-loop */
import { AccountModelType, serializeAccount } from 'models/account-model'
import { useSettingStore } from 'popup/stores/features/settings'
import { getAccountListName, getAccountRuntime, getBackupAccount } from 'services/wallet'
import { useQuery } from 'react-query'

import * as i from 'incognito-sdk/build/web/browser'

export const useGetAccount = () => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  return useQuery<AccountModelType>(
    ['useGetAccount.name', selectedAccount],
    async () => {
      const accountInstance = await getAccountRuntime(selectedAccount)
      const accountSerizialed = await serializeAccount(accountInstance)
      return accountSerizialed
    },
    {
      enabled: selectedAccount,
    },
  )
}

export type GetListAccountType = { accountName: string; USD: string; PRV: string }

export const useGetListAccountName = () => {
  return useQuery<string[]>('useGetListAccountName.name', getAccountListName)
}

export const useGetAccountBasicInfo = (accountName: string) => {
  return useQuery<GetListAccountType>(['useGetAccountBasicInfo.name', accountName], async () => {
    const account = await getAccountRuntime(accountName)
    const nanoPRV = await account.nativeToken.getAvaiableBalance()

    return {
      accountName: account.name,
      USD: '0.00',
      PRV: (nanoPRV.toNumber() * i.CONSTANT.WALLET_CONSTANT.NanoUnit).toFixed(2),
    }
  })
}

export const useGetListAccountBasicInfo = (accountsName: string[]) => {
  return useQuery(['useGetAccountListBasicInfo.name', accountsName], async () => {
    const listInfo = []
    for (let index = 0; index < accountsName.length; index += 1) {
      const account = await getAccountRuntime(accountsName[index])
      const nanoPRV = await account.nativeToken.getAvaiableBalance()
      listInfo.push({
        accountName: accountsName[index],
        USD: '0.00',
        PRV: (nanoPRV.toNumber() * i.CONSTANT.WALLET_CONSTANT.NanoUnit).toFixed(2),
        paymentAddress: account.key.keySet.paymentAddressKeySerialized,
      })
    }

    return listInfo
  })
}

export const useGetBackupAccount = (accountName = null) => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  return useQuery(
    ['useGetBackupAccount.name', accountName, selectedAccount],
    () => {
      if (!accountName) {
        return getBackupAccount(selectedAccount)
      }
      return getBackupAccount(accountName)
    },
    {
      enabled: selectedAccount,
    },
  )
}
