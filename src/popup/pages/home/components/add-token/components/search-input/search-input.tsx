import classNames from 'classnames'
import React, { useState } from 'react'
import { debounce } from 'lodash'
import { FontIcon } from '@fluentui/react'
import styles from './search-input.module.css'
import './search-input.css'

const debounceInput = 500 // ms

export const SearchInput: React.FC<{ placeholder: string; setValueInput: (value) => void; setShowCustom: (value) => void }> = ({
  placeholder,
  setValueInput,
  setShowCustom,
}) => {
  return (
    <div className={classNames('w-full relative search')}>
      <input type="text" className={styles.input} placeholder={placeholder} onChange={debounce((e) => setValueInput(e.target.value), debounceInput)} />
      <div className={styles.icon}>
        <FontIcon iconName="Search" />
      </div>
      <div className={styles.verifyContainer}>
        <input type="checkbox" onChange={(e) => setShowCustom(e.target.checked)} className="check-verify" id="verify" />
        <label htmlFor="verify">Verified</label>
      </div>
    </div>
  )
}
