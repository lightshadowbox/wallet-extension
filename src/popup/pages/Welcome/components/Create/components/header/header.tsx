import React from 'react'
import { FontIcon } from '@fluentui/react'
import styles from './header.module.css'

interface Props {
  dismissPanel: () => void
}
export const Header: React.FC<Props> = ({ dismissPanel }) => (
  <div className={styles.header}>
    <div className={`absolute ${styles.headerIcon} `}>
      <FontIcon onClick={dismissPanel} iconName="ChromeBack" />
    </div>
    <h3 className={styles.headerText}>Create New Wallet</h3>
  </div>
)
