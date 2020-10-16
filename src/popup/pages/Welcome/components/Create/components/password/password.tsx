/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import styles from './password.module.css'

interface Props {
  setPasswordWallet: (value) => void
}
export const Password: React.FC<Props> = ({ setPasswordWallet }) => (
  <div className={`w-full flex flex-col ${styles.passwordContainer}`}>
    <label htmlFor="password" className={styles.label}>
      Password
    </label>
    <input id="password" type="password" className={styles.input} onChange={(e) => setPasswordWallet(e.target.value)} />
  </div>
)
