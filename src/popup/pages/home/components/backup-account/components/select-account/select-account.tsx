import React from 'react'
import { useGetWalletGeneral } from 'queries/wallet.queries'
import styles from './select-account.module.css'

export const SelectAccount = () => {
  const { data, status } = useGetWalletGeneral()

  if (status !== 'loading') {
    return (
      <div className={styles.container}>
        <select className="w-full">
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
