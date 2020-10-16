import React from 'react'
import { FontIcon } from '@fluentui/react'
import styles from './list-network.module.css'
import './list-network.css'

const list = [
  {
    name: 'DAppChain',
    color: '#59B4AE',
  },
  {
    name: 'Ethereum',
    color: '#EC5A8D',
  },
  {
    name: 'Rinkeby',
    color: '#6A5FF6',
  },
  {
    name: 'Goerli',
    color: '#EFC45C',
  },
  {
    name: 'Localhost',
    color: '#4E9AEB',
  },
  {
    name: 'custom',
    color: '#AFAFAF',
  },
]
export const ListNetwork = () => {
  return (
    <ul className="list">
      {list.map((a) => (
        <li className={`flex flex-row item ${styles.item}`}>
          <div className={styles.front}>
            <div style={{ color: a.color }}>
              <FontIcon iconName="CircleFill" />
            </div>
            <span className={styles.name}>{a.name}</span>
          </div>
          <div style={{ color: '#276EF1' }}>
            <FontIcon iconName="Accept" />
          </div>
        </li>
      ))}
    </ul>
  )
}
