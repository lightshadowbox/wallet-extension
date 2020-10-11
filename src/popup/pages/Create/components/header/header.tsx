import classNames from 'classnames'
import React from 'react'
import { FontIcon } from '@fluentui/react'
import styles from './header.module.css'

export const Header = () => (
  <div
    className={classNames(`flex flex-row w-full justify-center items-center relative border-solid ${styles.header}`)}
  >
    <div className={classNames(`absolute  ${styles.headerIcon} `)}>
      <FontIcon iconName="SkypeArrow" />
    </div>
    <h3 className={classNames(`${styles.headerText}`)}>Create New Wallet</h3>
  </div>
)
