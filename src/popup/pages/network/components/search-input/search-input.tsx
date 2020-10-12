import classNames from 'classnames'
import React from 'react'
import { FontIcon } from '@fluentui/react'
import styles from './search-input.module.css'
import './search-input.css'

export const SearchInput: React.FC<{ placeholder: string }> = ({ placeholder }) => (
  <div className={classNames('w-full relative search')}>
    <input type="text" className={styles.input} placeholder={placeholder} />
    <div className={styles.icon}>
      <FontIcon iconName="Search" />
    </div>
  </div>
)
