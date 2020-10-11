/* eslint-disable react/button-has-type */
import React from 'react'
import styles from './btn-pri.module.css'

export const BtnPri = () => (
  <div className={`h-full ${styles.containerBtn}`}>
    <button className={styles.btn}>Next</button>
  </div>
)
