import { AccountModelType, serializeAccount } from 'models/account-model'
import { useSettingStore } from 'popup/stores/features/settings'
import { useQuery } from 'react-query'
import { getAccountRuntime } from 'services/wallet'
import { useGetWallet } from './wallet.queries'

export const useGetAccount = () => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  const { data: wallet } = useGetWallet()

  return useQuery<AccountModelType>(
    [useGetAccount.name, selectedAccount],
    async () => {
      const accountInstance = await getAccountRuntime(selectedAccount)
      const accountSerizialed = await serializeAccount(accountInstance)
      return accountSerizialed
    },
    { enabled: wallet && selectedAccount },
  )
}
