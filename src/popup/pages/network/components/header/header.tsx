import React from 'react'
import { FontIcon } from '@fluentui/react'
import styles from './header.module.css'

export const Header = () => (
  <div className={styles.header}>
    <div className={`absolute ${styles.headerIcon} `}>
      <FontIcon iconName="SkypeArrow" />
    </div>
    <h3 className={styles.headerText}>Choose Network</h3>
  </div>
)
