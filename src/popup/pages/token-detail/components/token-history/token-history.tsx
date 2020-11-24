/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import classNames from 'classnames'
import { useGetHistory } from 'queries/token.queries'
import { TxHistoryModel } from 'incognito-sdk'
import { SpinnerWallet } from 'popup/components/spinner/spinner-wallet'
import styles from './token-history.module.css'
import './token-history.css'

export const TokenHistory: React.FC<{ tokenId: string; accountName: string }> = ({ tokenId, accountName }) => {
  const [activeBtn, setActiveBtn] = React.useState('btn-send')
  const { data, status } = useGetHistory(tokenId)
  console.log(data)
  const onClickBtn = (value) => {
    const preNode = document.querySelector(`.token-history .${activeBtn}`) as HTMLElement
    preNode.classList.remove('isActive')
    const activeNode = document.querySelector(`.token-history .${value}`) as HTMLElement
    activeNode.classList.add('isActive')
    setActiveBtn(value)
  }
  return (
    <div>
      <div className={classNames('flex flex-row w-full token-history')}>
        <div onClick={() => onClickBtn('btn-send')} className={`btn-send isActive ${styles.btn}`}>
          <a>Send</a>
        </div>
        <div onClick={() => onClickBtn('btn-receive')} className={`btn-receive ${styles.btn}`}>
          <a>Receive</a>
        </div>
      </div>
      {status === 'success' ? (
        <ul>
          {data.map((item: TxHistoryModel) => {
            return (
              <li key={item.lockTime} className={classNames(`flex flex-row justify-between p-4 ${styles.container}`)}>
                <span className={styles.price}>
                  {parseFloat(item.nativeTokenInfo.amount) * 0.000000001 + parseFloat(item.nativeTokenInfo.fee) * 0.000000001}
                </span>
                <p className={styles.day}>{new Date(item.lockTime * 1000).toISOString()}</p>
              </li>
            )
          })}
        </ul>
      ) : (
          <SpinnerWallet />
        )}
    </div>
  )
}
