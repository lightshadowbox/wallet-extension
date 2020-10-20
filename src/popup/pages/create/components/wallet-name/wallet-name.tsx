/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames'
import React from 'react'
import styles from './wallet-name.module.css'

interface Props {
  setName: (value) => void
}
export const WalletName: React.FC<Props> = ({ setName }) => (
  <div className={classNames(`w-full flex flex-col ${styles.container}`)}>
    <label htmlFor="#name" className={styles.label}>
      Name
    </label>
    <input type="text" id="name" className={styles.input} onChange={(e) => setName(e.target.value)} />
  </div>
)
