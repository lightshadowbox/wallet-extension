import { PrivacyToken } from 'incognito-sdk/build/web/module/src/walletInstance/token'
import { map } from 'lodash'
import { AccountModelType, serializeAccount } from 'models/account-model'
import { TokenModelType } from 'models/token-model'
import { useSettingStore } from 'popup/stores/features/settings'
import { useQuery } from 'react-query'
import { useGetWallet } from './wallet.queries'

export const useGetAccount = () => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  const { data: wallet } = useGetWallet()

  return useQuery<AccountModelType>(
    [useGetAccount.name, selectedAccount],
    async () => {
      const accountInstance = wallet.masterAccount.getAccountByName(selectedAccount)
      const accountSerizialed = await serializeAccount(accountInstance)
      return accountSerizialed
    },
    { enabled: wallet && selectedAccount },
  )
}
