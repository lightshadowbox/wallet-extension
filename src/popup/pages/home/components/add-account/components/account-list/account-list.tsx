import React from 'react'
import { useGetWallet } from 'queries/use-get-wallet'
import classNames from 'classnames'
import styles from './account-list.module.css'

export const AccountList = () => {
  const wallet = useGetWallet()
  console.log()
  if (!wallet.isLoading) {
    return (
      <ul className={classNames('mt-4 p-4')}>
        {Object.keys(wallet.data.accounts).map((key, index) => {
          return (
            <li className={styles.container} key={wallet.data.accounts[key].privateKey}>
              <img className={styles.image} src="https://picsum.photos/200" alt="avatar" />
              <div className={classNames('flex flex-col ml-4')}>
                <h3>{wallet.data.accounts[key].name}</h3>
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
