/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import { FontIcon } from '@fluentui/react'
import classNames from 'classnames'
import styles from './token-list.module.css'
import './token-list.css'

interface ItemProp {
  // eslint-disable-next-line @typescript-eslint/ban-types
  name: string
  imgUrl: string
  isActive: boolean
}
const list: ItemProp[] = [
  {
    name: 'Ethersocial',
    isActive: true,
    imgUrl: 'https://picsum.photos/200',
  },
  {
    name: 'ZClassic',
    isActive: true,
    imgUrl: 'https://picsum.photos/200',
  },
  {
    name: 'Bitcoin',
    isActive: true,
    imgUrl: 'https://picsum.photos/200',
  },
  {
    name: '0 NEO',
    isActive: true,
    imgUrl: 'https://picsum.photos/200',
  },
  {
    name: 'Stellar',
    isActive: true,
    imgUrl: 'https://picsum.photos/200',
  },
  {
    name: 'DigixDAO',
    isActive: false,
    imgUrl: 'https://picsum.photos/200',
  },
  {
    name: 'Zcash',
    isActive: false,
    imgUrl: 'https://picsum.photos/200',
  },
]
export const TokenItem: React.FC<ItemProp> = ({ name, imgUrl, isActive }) => {
  return (
    <li className={`flex flex-row item ${styles.item}`}>
      <div className={classNames(`imgContainer ${styles.imgContainer}`)}>
        <img src={imgUrl} className={styles.img} />
        {isActive ? (
          <div className={styles.containerIcon}>
            <FontIcon iconName="SkypeCircleCheck" />
          </div>
        ) : null}
      </div>
      <span className={styles.name}>{name}</span>
    </li>
  )
}
export const TokenList = () => {
  return (
    <ul className={`list ${styles.list}`}>
      {list.map((a) => {
        return <TokenItem name={a.name} imgUrl={a.imgUrl} isActive={a.isActive} />
      })}
    </ul>
  )
}
