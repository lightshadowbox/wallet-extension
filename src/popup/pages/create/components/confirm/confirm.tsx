/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import styles from './confirm.module.css'

interface Props {
  setConfirmPass: (value) => void
  errMsg?: string;
}

export const ConfirmPassword: React.FC<Props> = ({ setConfirmPass, errMsg }) => (
  <div className={`w-full flex flex-col ${styles.confirmContainer}`}>
    <label htmlFor="confirm" className={styles.label}>
      Confirm Password
    </label>
    <input id="confirm" type="password" className={styles.input} onChange={(e) => setConfirmPass(e.target.value)} />
    {errMsg && <span className={styles.errMsg}>{errMsg}</span>}
  </div>
)
