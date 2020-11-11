/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import classNames from 'classnames'
import { useGetTokenBalance, getTokenFromTokenIds } from 'queries/token.queries'
import { FontIcon } from '@fluentui/react'
import { useSettingStore } from 'popup/stores/features/settings'
import styles from './detail-cover.module.css'

export const DetailCover: React.FC<{ tokenId: string; showPanelReceive: () => void; showPanelSend: (e, tokenId, accountName) => void }> = ({
  tokenId,
  showPanelReceive,
  showPanelSend,
}) => {
  const { data: totalBalance, isSuccess } = useGetTokenBalance(tokenId)
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  const tokenDetail = getTokenFromTokenIds([tokenId])
  return (
    <div className={classNames('w-full h-full')}>
      <div className={classNames('p-16')}>
        <div className={classNames('flex flex-row w-full items-end justify-center')}>
          {/* coming soon */}
          {isSuccess ? <span className={styles.price}>{totalBalance}</span> : <span className={styles.price}>0</span>}
          <p className={styles.usd}>USD</p>
        </div>
        <div className={classNames(`flex flex-row w-full items-end justify-center m-2 ${styles.prv}`)}>
          <span>{totalBalance}</span>
          <p>Balance</p>
        </div>
      </div>
      <div className={classNames('flex flex-row w-full')}>
        <div
          onClick={showPanelReceive}
          className={styles.btnReceive}
          style={
            !tokenDetail[tokenId].Verified
              ? {
                  opacity: 0.4,
                  pointerEvents: 'none',
                }
              : {}
          }
        >
          <FontIcon iconName="QRCode" />
          <a href="#">Receive</a>
        </div>
        <div
          onClick={(e) => {
            showPanelSend(e, tokenId, selectedAccount)
          }}
          className={styles.btnSend}
        >
          <FontIcon iconName="Send" />
          <a href="#">Send</a>
        </div>
        <div className={styles.btnSwap}>
          <FontIcon iconName="Switch" />
          <a href="#">Swap</a>
        </div>
      </div>
    </div>
  )
}
