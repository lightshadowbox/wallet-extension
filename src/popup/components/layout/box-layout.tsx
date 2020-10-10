import React from 'react'

import styles from './box-layout.module.css'

export const BoxLayout: React.FC = ({ children }) => {
  return <div className={`container max-w-sm mx-auto ${styles.borderBoxContainer}`}>{children}</div>
}
