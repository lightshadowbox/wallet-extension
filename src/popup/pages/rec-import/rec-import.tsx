/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/button-has-type */
import classNames from 'classnames'
import React from 'react'
import { FontIcon, mergeStyles, mergeStyleSets } from '@fluentui/react'
import { SecondaryButton } from 'popup/components/button'
import styles from './rec-import.module.css'

const iconClass = mergeStyles({
  fontSize: 26,
  height: 26,
  width: 26,
  fontWeight: 500,
  transform: 'rotate(90deg)',
})
const classNamesIcon = mergeStyleSets({
  deepBlue: [{ color: '#276EF1' }, iconClass],
})

export const RecImport: React.FC<{ showPanel: () => void }> = ({ showPanel }) => (
  <div className={`border border-dashed w-full ${styles.borderContainer}`}>
    <div className={classNames('flex flex-row items-center')}>
      <FontIcon iconName="Import" className={classNamesIcon.deepBlue} />
      <p className={styles.paragraph}>A crypto wallet & gateway to blockchain apps.</p>
    </div>
    <div onClick={showPanel} className={`flex w-full ${styles.btn}`}>
      <SecondaryButton full>Import</SecondaryButton>
    </div>
  </div>
)
