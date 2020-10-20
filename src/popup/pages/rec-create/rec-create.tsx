/* eslint-disable react/button-has-type */
import classNames from 'classnames'
import React from 'react'
import { FontIcon, mergeStyles, mergeStyleSets } from '@fluentui/react'
import { Button } from 'popup/components/button'
import styles from './rec-create.module.css'

interface Props {
  showPanel: () => void
}
const iconClass = mergeStyles({
  fontSize: 26,
  height: 26,
  width: 26,
  fontWeight: 700,
})
const classNamesIcon = mergeStyleSets({
  deepBlue: [{ color: '#276EF1' }, iconClass],
})
export const RecCreate: React.FC<Props> = ({ showPanel }) => (
  <div className={`border border-dashed ${styles.borderContainer}`}>
    <div className={classNames('flex flex-row items-center')}>
      <FontIcon iconName="Add" className={classNamesIcon.deepBlue} />
      <p className={styles.paragraph}>A crypto wallet & gateway to blockchain apps.</p>
    </div>
    <div className={`flex w-full ${styles.btn}`}>
      <Button onClick={showPanel} full>
        Create
      </Button>
    </div>
  </div>
)
