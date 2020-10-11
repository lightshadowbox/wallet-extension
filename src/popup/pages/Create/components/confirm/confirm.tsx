import React from 'react'
import { TextField, FontIcon } from '@fluentui/react'
import '../password/password'
import './confirm.css'
import styles from './confirm.module.css'

export const ConfirmPassword = () => (
  <div className={`confirm ${styles.containerConfirm}`}>
    <TextField label="Confirm Password" type="password" canRevealPassword />
    <div className={`absolute ${styles.iconDelete}`}>
      <FontIcon iconName="CircleAdditionSolid" />
    </div>
  </div>
)
