import React from 'react'
import { FontIcon } from '@fluentui/react'
import styles from './header.module.css'

type Props = {
  title: string
  icon: string
}
export const Header: React.FC<Props> = (props: Props) => (
  <div className={styles.header}>
    <div className={`absolute ${styles.headerIcon} `}>
      <FontIcon iconName={props.icon} />
    </div>
    <h3 className={styles.headerText}>{props.title}</h3>
  </div>
)
