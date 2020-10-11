import classNames from 'classnames'
import React from 'react'
import { TextField } from '@fluentui/react'
import './password.css'
import styles from './password.module.css'

export const Password = () => (
  <div className={classNames(`password ${styles.passwordContainer}`)}>
    <TextField label="Password" type="password" canRevealPassword />
  </div>
)
