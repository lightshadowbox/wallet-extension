/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { Button } from 'popup/components/button/button'
import classNames from 'classnames'
import { useImportAccountFromPrivateKey } from 'queries/create-account.mutation'
import { MessageBar, MessageBarType } from '@fluentui/react'
import styles from './account.module.css'

interface Props {
  privateKey: string
  accountName: string
  setPrivateKey: (value) => void
  setAccountName: (value) => void
  closePopup: CallableFunction
}

export const Account: React.FC<Props> = ({ privateKey, accountName, setPrivateKey, setAccountName, closePopup }) => {
  const [importPrivateKey, status] = useImportAccountFromPrivateKey(() => closePopup())
  const [error, setError] = React.useState('')

  const onImportClick = React.useCallback(() => {
    setError('')
    if (privateKey.trim() !== '' && privateKey.trim() !== '') {
      importPrivateKey({ accountName, privateKey })
    } else {
      setError('Please enter private key and account name')
    }
  }, [privateKey, accountName])

  React.useEffect(() => {
    if (status.isError) {
      setError((status.error as Error).message)
    } else {
      setError('')
    }
  }, [status.isError])

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
      {error !== '' && (
        <MessageBar messageBarType={MessageBarType.error} isMultiline dismissButtonAriaLabel="Close">
          {error}
        </MessageBar>
      )}
      <div onClick={onImportClick} className="flex flex-col w-full">
        <Button>Import</Button>
      </div>
    </div>
  )
}
