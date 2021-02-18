import React from 'react'
import { MessageBarType, MessageBar } from '@fluentui/react'

export const WarningMessage = ({ title, content }) => (
  <MessageBar messageBarType={MessageBarType.warning}>
    <b>{title}</b>. {content}
  </MessageBar>
)
