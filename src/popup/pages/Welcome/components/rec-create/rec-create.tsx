/* eslint-disable react/button-has-type */
import classNames from 'classnames'
import React from 'react'
import { FontIcon, mergeStyles, mergeStyleSets } from '@fluentui/react'
import styles from './rec-create.module.css'

const iconClass = mergeStyles({
  fontSize: 26,
  height: 26,
  width: 26,
  fontWeight: 700,
})
const classNamesIcon = mergeStyleSets({
  deepBlue: [{ color: '#276EF1' }, iconClass],
})
export const RecCreate = () => (
  <div className={classNames(`border border-dashed ${styles.borderContainer}`)}>
    <div className={classNames('flex flex-row items-center')}>
      <FontIcon iconName="Add" className={classNamesIcon.deepBlue} />
      <p className={styles.paragraph}>A crypto wallet & gateway to blockchain apps.</p>
    </div>
    <button className={styles.btn}>Create</button>
  </div>
)
