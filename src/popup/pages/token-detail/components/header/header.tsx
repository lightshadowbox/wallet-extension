/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import { FontIcon } from '@fluentui/react'
import styles from './header.module.css'

type Props = {
  title: string
  icon: string
  dismissPanel: () => void
}
export const Header: React.FC<Props> = ({ title, icon, dismissPanel }) => (
  <div className={styles.header}>
    <div onClick={dismissPanel} className={`absolute ${styles.headerIcon} `}>
      <FontIcon iconName={icon} />
    </div>
    <h3 className={styles.headerText}>{title}</h3>
  </div>
)
