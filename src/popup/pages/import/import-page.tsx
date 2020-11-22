import React from 'react'
import classnames from 'classnames'
import { useHistory } from 'react-router-dom'
import { ImportAccountPanel } from '../connect/Connect-panel'

export const ImportPage = () => {
  const history = useHistory()
  const onDismissPanel = () => {
    history.push('/')
  }
  return (
    <div className={classnames('flex flex-col relative w-full h-full overflow-hidden')}>
      <ImportAccountPanel isPanelOpen={true} showPanel={null} dismissPanel={onDismissPanel} />
    </div>
  )
}
