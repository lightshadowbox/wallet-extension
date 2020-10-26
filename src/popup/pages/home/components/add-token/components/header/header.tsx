import React from 'react'
import { FontIcon } from '@fluentui/react'
import styles from './header.module.css'

type Props = {
  title: string
  icon: string
  dismissPanel: () => void
  setValueInput: (value) => void
}
export const Header: React.FC<Props> = ({ title, icon, dismissPanel, setValueInput }) => (
  <div className={styles.header}>
    <div className={`absolute ${styles.headerIcon} `}>
      <FontIcon
        iconName={icon}
        onClick={() => {
          setValueInput('')
          dismissPanel()
        }}
      />
    </div>
    <h3 className={styles.headerText}>{title}</h3>
  </div>
)
