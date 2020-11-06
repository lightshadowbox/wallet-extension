import classNames from 'classnames'
import React from 'react'
import { FontIcon } from '@fluentui/react'
import styles from './search-input.module.css'
import './search-input.css'

export const SearchInput: React.FC<{ placeholder: string; setValueInput: (value) => void; setShowCustom: (value) => void }> = ({
  placeholder,
  setValueInput,
  setShowCustom,
}) => (
  <div className={classNames('w-full relative search')}>
    <input type="text" className={styles.input} placeholder={placeholder} onChange={(e) => setValueInput(e.target.value)} />
    <div className={styles.icon}>
      <FontIcon iconName="Search" />
    </div>
    <div className={styles.verifyContainer}>
      <input type="checkbox" onChange={(e) => setShowCustom(e.target.checked)} value="verified" className="check-verify" id="verify" />
      <label htmlFor="verify">Verified</label>
    </div>
  </div>
)
