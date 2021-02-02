/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import styles from './password.module.css'

interface Props {
  setPasswordWallet: (value) => void
  isHasLabel: boolean
}
export const Password: React.FC<Props> = ({ setPasswordWallet, isHasLabel }) => (
  <div className={`w-full relative flex flex-col ${styles.passwordContainer}`}>
    {isHasLabel ? (
      <label htmlFor="password" className={styles.label}>
        Password
      </label>
    ) : null}
    <input id="password" type="password" className={styles.input} onChange={(e) => setPasswordWallet(e.target.value)} />
    {isHasLabel ? <p className={`italic text-xs ${styles.least}`}>*At least 6 characters</p> : null}
  </div>
)
