/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import classNames from 'classnames'
import { useGetHistory } from 'queries/token.queries'
import styles from './token-history.module.css'
import './token-history.css'

export const TokenHistory: React.FC<{ tokenId: string; accountName: string }> = ({ tokenId, accountName }) => {
  const [activeBtn, setActiveBtn] = React.useState('btn-send')
  const { data, status } = useGetHistory(accountName, tokenId)

  const onClickBtn = (value) => {
    const preNode = document.querySelector(`.token-history .${activeBtn}`) as HTMLElement
    preNode.classList.remove('isActive')
    const activeNode = document.querySelector(`.token-history .${value}`) as HTMLElement
    activeNode.classList.add('isActive')
    setActiveBtn(value)
  }
  const listItem = [
    {
      price: 25.05,
      day: '10:30 20 Aug 2020',
    },
    {
      price: 25.05,
      day: '10:31 20 Aug 2020',
    },
    {
      price: 25.05,
      day: '10:32 20 Aug 2020',
    },
    {
      price: 25.05,
      day: '10:33 20 Aug 2020',
    },
  ]
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
