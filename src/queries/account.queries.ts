import { AccountModelType, serializeAccount } from 'models/account-model'
import { useSettingStore } from 'popup/stores/features/settings'
import { useQuery } from 'react-query'
import { toPRV } from 'services/utils'
import { getAccountRuntime } from 'services/wallet'
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
export const useGetListAccount = () => {
  const { data: wallet } = useGetWallet()

  return useQuery<GetListAccountType[]>(
    [useGetListAccount.name],
    async () => {
      const accounts = wallet.masterAccount.getAccounts()
      const accountLists = await Promise.all(
        accounts.map<Promise<GetListAccountType>>(async (account) => {
          const nanoPRV = await account.nativeToken.getAvaiableBalance()
          return {
            accountName: account.name,
            USD: '0.00',
            PRV: (nanoPRV.toNumber() * i.CONSTANT.WALLET_CONSTANT.NanoUnit).toFixed(2),
          }
        }),
      )
      return accountLists
    },
    { enabled: wallet },
  )
}
