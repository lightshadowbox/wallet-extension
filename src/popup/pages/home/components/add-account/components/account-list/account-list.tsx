import React from 'react'
import classNames from 'classnames'
import { useGetWalletGeneral } from 'queries/wallet.queries'
import styles from './account-list.module.css'

export const AccountList = () => {
  const wallet = useGetWalletGeneral()

  if (!wallet.isLoading) {
    return (
      <ul className={classNames('mt-4 p-4')}>
        {Object.keys(wallet.data.accounts).map((name) => {
          return (
            <li className={styles.container} key={name}>
              <img className={styles.image} src="https://picsum.photos/200" alt="avatar" />
              <div className={classNames('flex flex-col ml-4')}>
                <h3>{name}</h3>
                <div className={`flex flex-row mt-2 ${styles.balance}`}>
                  <p>USD: 0</p>
                  <p className="ml-2">TRX: 15.60</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }
  return <h1>Loading...</h1>
}
