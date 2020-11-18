/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react'
import classNames from 'classnames'
import { useGetListAccountName, useGetAccountBasicInfo } from 'queries/account.queries'
import { FontIcon, Persona, Spinner } from '@fluentui/react'
import { Shimmer } from 'popup/components/shimmer/shimmer'
import { store } from 'popup/stores'
import { settingSlices, useSettingStore } from 'popup/stores/features/settings'
import styles from './account-list.module.css'

const AccountItem: React.FC<{ name: string }> = ({ name }) => {
  const currentAccount = useSettingStore((s) => s.selectAccountName)

  const switchAccount = (accountName: string) => {
    store.dispatch(settingSlices.actions.selectAccount({ accountName }))
  }

  const { data: accountInfo } = useGetAccountBasicInfo(name)

  return (
    <li onClick={() => switchAccount(name)} key={name} className={styles.item}>
      <div className={styles.container}>
        <Persona
          text={name}
          imageAlt={name}
          onRenderSecondaryText={() =>
            accountInfo ? (
              <>
                <div className={`flex flex-row mt-2 ${styles.balance}`}>
                  <p>USD: {accountInfo.USD}</p>
                  <p className="ml-2">PRV: {accountInfo.PRV}</p>
                </div>
              </>
            ) : (
              <Spinner />
            )
          }
        />
      </div>
      {currentAccount === name ? (
        <div className={styles.icon}>
          <FontIcon iconName="Accept" />
        </div>
      ) : null}
    </li>
  )
}

export const AccountList = () => {
  const { data: accountListName, isLoading } = useGetListAccountName()

  if (isLoading || !accountListName) {
    return (
      <div className={classNames('mt-4 p-4')}>
        <Shimmer />
      </div>
    )
  }
  return (
    <ul className={classNames('mt-4 p-4')}>
      {accountListName.map((name) => {
        return <AccountItem name={name} />
      })}
    </ul>
  )
}
