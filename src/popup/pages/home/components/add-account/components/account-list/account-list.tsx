import React from 'react'
import classNames from 'classnames'
import { useGetListAccount } from 'queries/account.queries'
import { SpinnerWallet } from 'popup/components/spinner/spinner-wallet'
import styles from './account-list.module.css'

export const AccountList = () => {
  const accountList = useGetListAccount()
  if (!accountList.isLoading && accountList.data) {
    return (
      <ul className={classNames('mt-4 p-4')}>
        {accountList.data.map((a) => {
          return (
            <li className={styles.container} key={a.accountName}>
              <img className={styles.image} src="https://picsum.photos/200" alt="avatar" />
              <div className={classNames('flex flex-col ml-4')}>
                <h3>{a.accountName}</h3>
                <div className={`flex flex-row mt-2 ${styles.balance}`}>
                  <p>USD: {a.USD}</p>
                  <p className="ml-2">PRV: {a.PRV}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }
  return <SpinnerWallet />
}
