import React from 'react'
import { useGetWalletGeneral } from 'queries/wallet.queries'
import { getBackupAccount } from 'services/wallet'
import { AccountModelType } from 'models/account-model'
import styles from './select-account.module.css'

export const SelectAccount: React.FC<{ changeAccount: (accountName: AccountModelType) => void }> = ({ changeAccount }) => {
  const { data, status } = useGetWalletGeneral()
  const onChangeOption = async () => {
    const element = document.querySelector('#select-account') as HTMLInputElement
    const account = await getBackupAccount(element.value)
    changeAccount(account)
  }
  if (status !== 'loading') {
    return (
      <div className={styles.container} onChange={onChangeOption}>
        <select id="select-account" className="w-full">
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
