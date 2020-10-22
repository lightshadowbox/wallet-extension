import React from 'react'
import { FontIcon } from '@fluentui/react'
import classNames from 'classnames'
import styles from './dropdown-menu.module.css'
import './dropdown-menu.css'

const list = [
  {
    title: 'Account',
    icon: 'Contact',
  },
  {
    title: 'Backup',
    icon: 'Subscribe',
  },
  {
    title: 'Lock',
    icon: 'Lock',
  },
  {
    title: 'Full Screen',
    icon: 'ChromeFullScreen',
  },
  {
    title: 'About us',
    icon: 'InfoSolid',
  },
  {
    title: 'Log out',
    icon: 'Leave',
  },
]

export const DropdownMenu = () => {
  return (
    <div className={classNames(`absolute inset-0 dropdown ${styles.dropdownContainer}`)}>
      <ul>
        {list.map((item) => {
          return (
            <li className={styles.dropdownItem}>
              <FontIcon iconName={item.icon} />
              <p>{item.title}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
