import React from 'react'
import { useGetAccount } from 'queries/account.queries'
import { FontIcon } from '@fluentui/react'
import styles from './list-data.module.css'

export const ListData = () => {
  const account = useGetAccount()
  if (account.status === 'success') {
    return (
      <ul className={styles.container}>
        <li className={styles.listItem}>
          <span className={styles.label}>Incognito address</span>
          <div className={styles.key}>
            <div className="flex flex-row">
              <p>{account.data.paymentAddress}</p>
              <span>...</span>
            </div>
            <div className={styles.icon}>
              <FontIcon iconName="QRcode" />
              <FontIcon iconName="Copy" />
            </div>
          </div>
        </li>
        <li className={styles.listItem}>
          <span className={styles.label}>Private key</span>
          <div className={styles.key}>
            <div className="flex flex-row">
              <p>{account.data.privateKey}</p>
              <span>...</span>
            </div>
            <div className={styles.icon}>
              <FontIcon iconName="QRcode" />
              <FontIcon iconName="Copy" />
            </div>
          </div>
        </li>
        <li className={styles.listItem}>
          <span className={styles.label}>Public key</span>
          <div className={styles.key}>
            <div className="flex flex-row">
              <p>{account.data.publicKey}</p>
              <span>...</span>
            </div>

            <div className={styles.icon}>
              <FontIcon iconName="QRcode" />
              <FontIcon iconName="Copy" />
            </div>
          </div>
        </li>
        <li className={styles.listItem}>
          <span className={styles.label}>Readonly key</span>
          <div className={styles.key}>
            <div className="flex flex-row">
              <p>{account.data.viewingKey}</p>
              <span>...</span>
            </div>
            <div className={styles.icon}>
              <FontIcon iconName="QRcode" />
              <FontIcon iconName="Copy" />
            </div>
          </div>
        </li>
        <li className={styles.listItem}>
          <span className={styles.label}>Validator key</span>
          <div className={styles.key}>
            <div className="flex flex-row">
              <p>{account.data.privateKey}</p>
              <span>...</span>
            </div>
            <div className={styles.icon}>
              <FontIcon iconName="QRcode" />
              <FontIcon iconName="Copy" />
            </div>
          </div>
        </li>
      </ul>
    )
  }
}
