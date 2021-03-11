import React from 'react'
import { MessageBarType, MessageBar } from '@fluentui/react'
import { useTheme } from 'popup/services'
import { FaButton } from 'popup/components'

export const WarningMessage = ({ title, content }) => (
  <MessageBar messageBarType={MessageBarType.warning}>
    <b>{title}</b>. {content}
  </MessageBar>
)
export const Guide = ({ onDismiss }) => {
  const theme = useTheme()
  console.log(onDismiss)
  return (
    <MessageBar onDismiss={onDismiss} dismissButtonAriaLabel="Close" messageBarType={MessageBarType.warning}>
      <b>Guide</b>{' '}
      <p>
        If you already have an account, click on <FaButton iconProps={{ iconName: 'MoreVertical' }} iconColor={theme.palette.black} />
        -&gt; Go to Account -&gt; Import to import your existing wallet.
      </p>
    </MessageBar>
  )
}
