import React from 'react'
import { getBackupAccount } from 'services/wallet'
import { AccountModelType } from 'models/account-model'
import { useSettingStore } from 'popup/stores/features/settings'
import styles from './select-account.module.css'

export const SelectAccount: React.FC<{ changeAccount: (accountName: AccountModelType) => void; data: any; status: string }> = ({
  changeAccount,
  data,
  status,
}) => {
  const onChangeOption = async () => {
    const element = document.querySelector('#select-account') as HTMLInputElement
    const account = await getBackupAccount(element.value)
    changeAccount(account)
  }
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  if (status !== 'loading') {
    return (
      <div className={styles.container} onChange={onChangeOption}>
        <select defaultValue={selectedAccount} id="select-account" className="w-full">
          {data.accounts.map((accountName) => (
            <option key={accountName} value={accountName}>
              {accountName}
            </option>
          ))}
        </select>
      </div>
    )
  }
  return <h1>Loading</h1>
}
