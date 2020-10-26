/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react'
import classNames from 'classnames'
import { useGetListAccount, useGetAccount } from 'queries/account.queries'
import { FontIcon } from '@fluentui/react'
import { Shimmer } from 'popup/components/shimmer/shimmer'
import { store } from 'popup/stores'
import { settingSlices } from 'popup/stores/features/settings'
import styles from './account-list.module.css'

export const AccountList = () => {
  const { data: account } = useGetAccount()
  console.log(account)
  const switchAccount = React.useCallback((accountName: string) => {
    store.dispatch(settingSlices.actions.selectAccount({ accountName }))
  }, [])
  const accountList = useGetListAccount()
  if (!accountList.isLoading && accountList.data) {
    return (
      <ul className={classNames('mt-4 p-4')}>
        {accountList.data.map((a) => {
          return (
            <li onClick={() => switchAccount(a.accountName)} key={a.accountName} className={styles.item}>
              <div className={styles.container}>
                <img className={styles.image} src="https://picsum.photos/200" alt="avatar" />
                <div className={classNames('flex flex-col ml-4')}>
                  <h3>{a.accountName}</h3>
                  <div className={`flex flex-row mt-2 ${styles.balance}`}>
                    <p>USD: {a.USD}</p>
                    <p className="ml-2">PRV: {a.PRV}</p>
                  </div>
                </div>
              </div>
              {account?.name === a.accountName ? (
                <div className={styles.icon}>
                  <FontIcon iconName="Accept" />
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
    )
  }
  return (
    <div className={classNames('mt-4 p-4')}>
      <Shimmer />
    </div>
  )
}
