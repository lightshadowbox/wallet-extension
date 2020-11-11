import { AccountModelType, serializeAccount } from 'models/account-model'
import { useSettingStore } from 'popup/stores/features/settings'
import { useQuery } from 'react-query'
import { getAccountListName, getAccountRuntime, getBackupAccount } from 'services/wallet'
import * as i from 'incognito-sdk'

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

export const useGetBackupAccount = (accountName = null) => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  console.log(selectedAccount)
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
      refetchOnWindowFocus: true,
    },
  )
}
