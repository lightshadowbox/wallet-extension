import React from 'react'
import { FontIcon } from '@fluentui/react'
import styles from './header.module.css'

type Props = {
  title: string
  icon: string
  dismissPanel: () => void
  removeInfor: () => void
}
export const Header: React.FC<Props> = ({ title, icon, dismissPanel, removeInfor }) => (
  <div className={styles.header}>
    <div
      onClick={() => {
        dismissPanel()
        removeInfor()
      }}
      className={`absolute ${styles.headerIcon} `}
    >
      <FontIcon iconName={icon} />
    </div>
    <h3 className={styles.headerText}>{title}</h3>
  </div>
)
