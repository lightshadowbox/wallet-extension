import React from 'react'
import { TooltipHost, ITooltipHostStyles, FontIcon } from '@fluentui/react'
import { useId } from '@uifabric/react-hooks'
import { useGetAccount } from 'queries/account.queries'

import styles from './list-data.module.css'

const calloutProps = { gapSpace: 0 }
const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } }

export const ListData = () => {
  const account = useGetAccount()
  const tooltipId = useId('tooltip')
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
              <p>{account.data.paymentAddress}</p>
              <span>...</span>
            </div>
            <div className={styles.icon}>
              <FontIcon iconName="QRcode" />
              <TooltipHost content={contentTooltip} id={tooltipId} calloutProps={calloutProps} styles={hostStyles}>
                <FontIcon iconName="Copy" onClick={() => onClickCopy(account.data.paymentAddress)} />
              </TooltipHost>
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
              <TooltipHost content={contentTooltip} id={tooltipId} calloutProps={calloutProps} styles={hostStyles}>
                <FontIcon iconName="Copy" onClick={() => onClickCopy(account.data.privateKey)} />
              </TooltipHost>
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
              <TooltipHost content={contentTooltip} id={tooltipId} calloutProps={calloutProps} styles={hostStyles}>
                <FontIcon iconName="Copy" onClick={() => onClickCopy(account.data.publicKey)} />
              </TooltipHost>
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
              <TooltipHost content={contentTooltip} id={tooltipId} calloutProps={calloutProps} styles={hostStyles}>
                <FontIcon iconName="Copy" onClick={() => onClickCopy(account.data.viewingKey)} />
              </TooltipHost>
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
              <TooltipHost content={contentTooltip} id={tooltipId} calloutProps={calloutProps} styles={hostStyles}>
                <FontIcon iconName="Copy" onClick={() => onClickCopy(account.data.privateKey)} />
              </TooltipHost>
            </div>
          </div>
        </li>
      </ul>
    )
  }
}
