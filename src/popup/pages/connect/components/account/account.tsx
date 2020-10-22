/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { Button } from 'popup/components/button/button'
import classNames from 'classnames'
import { walletRuntime } from 'services/wallet'
import styles from './account.module.css'

interface Props {
  privateKey: string
  accountName: string
  setPrivateKey: (value) => void
  setAccountName: (value) => void
}
export const Account: React.FC<Props> = ({ privateKey, accountName, setPrivateKey, setAccountName }) => {
  const onImportClick = () => {
    walletRuntime.masterAccount.importAccount(accountName, privateKey)
    console.log('Accounts:', walletRuntime.masterAccount.getAccounts()[0].key.keySet.privateKeySerialized)
  }
  return (
    <div className={classNames('w-full h-full flex flex-col justify-between')}>
      <div className={classNames(`flex flex-col ${styles.input}`)}>
        <label htmlFor="private-key">Private Key</label>
        <input id="private-key" type="text" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
      </div>
      <div className={classNames(`flex flex-col ${styles.input}`)}>
        <label htmlFor="private-key">Account Name</label>
        <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
      </div>
      <div onClick={onImportClick} className="w-full flex flex-col">
        <Button>Import</Button>
      </div>
    </div>
  )
}
