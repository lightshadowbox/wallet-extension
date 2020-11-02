import React from 'react'
import { TooltipHost, ITooltipHostStyles, FontIcon } from '@fluentui/react'
import { useId } from '@uifabric/react-hooks'
import { AccountModelType } from 'models/account-model'

import styles from './list-data.module.css'

interface Props {
  account: any
  selectedAccount: AccountModelType
}

const calloutProps = { gapSpace: 0 }
const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } }

export const ListData: React.FC<Props> = ({ account, selectedAccount }) => {
  const tooltipId = useId('tooltip')
  console.log(selectedAccount)
  const [contentTooltip, setContentTooltip] = React.useState('Copy')
  const onClickCopy = React.useCallback((value: string) => {
    const text = value
    setContentTooltip('Copied')
    setTimeout(() => {
      setContentTooltip('Copy')
      const elem = document.createElement('textarea')
      document.body.appendChild(elem)
      elem.value = text
      elem.select()
      document.execCommand('copy')
      document.body.removeChild(elem)
    }, 1500)
  }, [])
  if (account.status === 'success') {
    return (
      <ul className={styles.container}>
        <li className={styles.listItem}>
          <span className={styles.label}>Incognito address</span>
          <div className={styles.key}>
            <div className="flex flex-row">
              <p>{!selectedAccount ? account.data.paymentAddress : selectedAccount.paymentAddress}</p>
              <span>...</span>
            </div>
            <div className={styles.icon}>
              <FontIcon iconName="QRcode" />
              <TooltipHost content={contentTooltip} id={tooltipId} calloutProps={calloutProps} styles={hostStyles}>
                <FontIcon
                  iconName="Copy"
                  onClick={() => (!selectedAccount ? onClickCopy(account.data.paymentAddress) : onClickCopy(selectedAccount.paymentAddress))}
                />
              </TooltipHost>
            </div>
          </div>
        </li>
        <li className={styles.listItem}>
          <span className={styles.label}>Private key</span>
          <div className={styles.key}>
            <div className="flex flex-row">
              <p>{!selectedAccount ? account.data.privateKey : selectedAccount.privateKey}</p>
              <span>...</span>
            </div>
            <div className={styles.icon}>
              <FontIcon iconName="QRcode" />
              <TooltipHost content={contentTooltip} id={tooltipId} calloutProps={calloutProps} styles={hostStyles}>
                <FontIcon iconName="Copy" onClick={() => (!selectedAccount ? onClickCopy(account.data.privateKey) : onClickCopy(selectedAccount.privateKey))} />
              </TooltipHost>
            </div>
          </div>
        </li>
        <li className={styles.listItem}>
          <span className={styles.label}>Public key</span>
          <div className={styles.key}>
            <div className="flex flex-row">
              <p>{!selectedAccount ? account.data.publicKey : selectedAccount.publicKey}</p>
              <span>...</span>
            </div>

            <div className={styles.icon}>
              <FontIcon iconName="QRcode" />
              <TooltipHost content={contentTooltip} id={tooltipId} calloutProps={calloutProps} styles={hostStyles}>
                <FontIcon iconName="Copy" onClick={() => (!selectedAccount ? onClickCopy(account.data.publicKey) : onClickCopy(selectedAccount.publicKey))} />
              </TooltipHost>
            </div>
          </div>
        </li>
        <li className={styles.listItem}>
          <span className={styles.label}>Readonly key</span>
          <div className={styles.key}>
            <div className="flex flex-row">
              <p>{!selectedAccount ? account.data.viewingKey : selectedAccount.viewingKey}</p>
              <span>...</span>
            </div>
            <div className={styles.icon}>
              <FontIcon iconName="QRcode" />
              <TooltipHost content={contentTooltip} id={tooltipId} calloutProps={calloutProps} styles={hostStyles}>
                <FontIcon iconName="Copy" onClick={() => (!selectedAccount ? onClickCopy(account.data.viewingKey) : onClickCopy(selectedAccount.viewingKey))} />
              </TooltipHost>
            </div>
          </div>
        </li>
        <li className={styles.listItem}>
          <span className={styles.label}>Validator key</span>
          <div className={styles.key}>
            <div className="flex flex-row">
              <p>{!selectedAccount ? account.data.privateKey : selectedAccount.privateKey}</p>
              <span>...</span>
            </div>
            <div className={styles.icon}>
              <FontIcon iconName="QRcode" />
              <TooltipHost content={contentTooltip} id={tooltipId} calloutProps={calloutProps} styles={hostStyles}>
                <FontIcon iconName="Copy" onClick={() => (!selectedAccount ? onClickCopy(account.data.privateKey) : onClickCopy(selectedAccount.privateKey))} />
              </TooltipHost>
            </div>
          </div>
        </li>
      </ul>
    )
  }
}
