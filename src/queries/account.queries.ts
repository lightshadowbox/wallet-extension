import { AccountModelType, serializeAccount } from 'models/account-model'
import { useSettingStore } from 'popup/stores/features/settings'
import { useQuery } from 'react-query'
import { getAccountRuntime, getBackupAccount, getWalletInstance } from 'services/wallet'
import { toPRV } from 'services/utils'
import * as i from 'incognito-sdk'
import { useGetWallet } from './wallet.queries'

export const useGetAccount = () => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)

  return useQuery<AccountModelType>(
    [useGetAccount.name, selectedAccount],
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
  const { data: wallet } = useGetWallet()

  return useQuery<string[]>(
    [useGetListAccountName.name],
    async () => {
      const wallet = await getWalletInstance()
      const accounts = wallet.masterAccount.getAccounts()
      return accounts.map((i) => i.name)
    },
    { enabled: wallet },
  )
}

export const useGetAccountBasicInfo = (accountName: string) => {
  return useQuery<GetListAccountType>([useGetAccountBasicInfo.name, accountName], async () => {
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
  return useQuery(
    [useGetBackupAccount.name, accountName, selectedAccount],
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
