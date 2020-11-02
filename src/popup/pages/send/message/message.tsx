import React from 'react'
import { FontIcon } from '@fluentui/react'
import styles from './message.module.css'

export const Message: React.FC<{ message: string; name: string }> = ({ name, message }) => {
  return (
    <div className={name === 'error' ? styles.containerError : styles.containerSuccess}>
      <FontIcon iconName={name === 'error' ? 'ChromeClose' : 'Accept'} />
      <p className={styles.message}>{message}</p>
    </div>
  )
}
