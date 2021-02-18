/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import classNames from 'classnames'
import { useGetHistory } from 'queries/token.queries'
import { TxHistoryModel } from 'incognito-sdk/build/web/browser'
import { SpinnerWallet } from 'popup/components'

import styles from './token-history.module.css'
import './token-history.css'

export const TokenHistory: React.FC<{ tokenId: string; accountName: string }> = ({ tokenId, accountName }) => {
  const [activeBtn, setActiveBtn] = React.useState('btn-send')
  const { data, status } = useGetHistory(tokenId)
  const [tradeActive] = React.useState(JSON.parse(localStorage.getItem('his_trade')) || [])
  const onClickBtn = (value) => {
    const preNode = document.querySelector(`.token-history .${activeBtn}`) as HTMLElement
    preNode.classList.remove('isActive')
    const activeNode = document.querySelector(`.token-history .${value}`) as HTMLElement
    activeNode.classList.add('isActive')
    setActiveBtn(value)
  }
  return (
    <div className="container-tokenHistory">
      <div className={classNames('flex flex-row w-full token-history')}>
        <div onClick={() => onClickBtn('btn-send')} className={`btn-send isActive ${styles.btn}`}>
          <a>Send</a>
        </div>
        <div onClick={() => onClickBtn('btn-receive')} className={`btn-receive ${styles.btn}`}>
          <a>Receive</a>
        </div>
        <div onClick={() => onClickBtn('btn-trade')} className={`btn-trade ${styles.btn}`}>
          <a>Trade</a>
        </div>
      </div>
      {status === 'success' ? (
        activeBtn === 'btn-send' ? ( // send history
          <ul className={styles.listContainer}>
            {data.map((item: TxHistoryModel) => {
              return (
                <li key={item.lockTime} className={classNames(`flex flex-row justify-between p-4 ${styles.container}`)}>
                  <span className={styles.price}>
                    {(parseFloat(item.nativeTokenInfo.amount) * 0.000000001 + parseFloat(item.nativeTokenInfo.fee) * 0.000000001).toFixed(3)}
                  </span>
                  <p className={styles.day}>{new Date(item.lockTime * 1000).toISOString()}</p>
                </li>
              )
            })}
          </ul>
        ) : activeBtn === 'btn-receive' ? ( // receive-history
          <ul className={styles.listContainer}>
            <li className={classNames(`flex flex-row justify-between p-4 ${styles.container}`)}>Coming soon</li>
          </ul>
        ) : (
          // trade active
          <ul className={styles.listContainer}>
            {tradeActive.map((trade) => (
              <HistoryTradeReturn accountName={accountName} tokenId={tokenId} trade={trade} />
            ))}
          </ul>
        )
      ) : (
        <SpinnerWallet />
      )}
    </div>
  )
}
const HistoryTradeReturn = ({ trade, accountName, tokenId }) => {
  if (trade.accountName === accountName && tokenId === trade.tokenId) {
    return (
      <li
        key={trade.date}
        onClick={() => window.open(`https://mainnet.incognito.org/tx/${trade.txId}`, '_blank')}
        className={classNames(`flex cursor-pointer flex-row justify-between p-4 ${styles.container}`)}
      >
        <span className={styles.price}>{`${trade.txId.toString().substr(0, 8)}...`}</span>
        <p className={styles.day}>{`${trade.date.toString().substr(0, 25)}...`}</p>
      </li>
    )
  }
  return null
}
