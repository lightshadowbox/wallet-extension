/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import classNames from 'classnames'
import { Button, SecondaryButton } from 'popup/components/button'
import { FontIcon } from '@fluentui/react'
import styles from './detail-cover.module.css'

export const DetailCover = () => {
  return (
    <div className={classNames('w-full h-full')}>
      <div className={classNames('p-16')}>
        <div className={classNames('flex flex-row w-full items-end justify-center')}>
          <span className={styles.price}>181.50</span>
          <p className={styles.usd}>USD</p>
        </div>
        <div className={classNames(`flex flex-row w-full items-end justify-center m-2 ${styles.prv}`)}>
          <span>15.92</span>
          <p>PRD</p>
        </div>
      </div>
      <div className={classNames('flex flex-row w-full')}>
        <div className={styles.btnReceive}>
          <FontIcon iconName="QRCode" />
          <a href="#">Receive</a>
        </div>
        <div className={styles.btnSend}>
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
