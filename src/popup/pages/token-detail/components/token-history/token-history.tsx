/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from 'classnames'
import React from 'react'
import styles from './token-history.module.css'

export const TokenHistoty = () => {
  const listItem = [
    {
      price: 25.05,
      day: '10:30 20 Aug 2020',
    },
    {
      price: 25.05,
      day: '10:30 20 Aug 2020',
    },
    {
      price: 25.05,
      day: '10:30 20 Aug 2020',
    },
    {
      price: 25.05,
      day: '10:30 20 Aug 2020',
    },
  ]
  return (
    <div>
      <div className={classNames('flex flex-row w-full')}>
        <div className={styles.btn}>
          <a>Send</a>
        </div>
        <div className={styles.btn}>
          <a>Receive</a>
        </div>
      </div>
      <ul>
        {listItem.map((item) => {
          return (
            <li key={item.day} className={classNames(`flex flex-row justify-between p-4 ${styles.container}`)}>
              <span className={styles.price}>{item.price}</span>
              <p className={styles.day}>{item.day}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
