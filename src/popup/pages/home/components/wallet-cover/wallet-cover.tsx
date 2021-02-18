import classNames from 'classnames'
import React from 'react'
import { ActionButton, Icon, Label, Persona, PersonaSize, Stack, TooltipHost } from '@fluentui/react'
import Avatar from 'popup/assets/avatar.png'
import styled from 'styled-components'
import { useTheme } from 'popup/services'
import { Button, SecondaryButton, SpinnerWallet } from 'popup/components'

import { useGetAccount } from 'queries/account.queries'

import { useId, useConst } from '@uifabric/react-hooks'
import { useGetTokenBalance } from 'queries/token.queries'
import styles from './wallet-cover.module.css'

interface Props {
  showPanel: () => void
  showPanelReceive: () => void
  showPanelSend: () => void
}

export const WalletCover: React.FC<Props> = ({ showPanel, showPanelReceive, showPanelSend }) => {
  const [contentTooltip, setContentTooltip] = React.useState('Copy')
  const theme = useTheme()
  const account = useGetAccount()
  const { data: balance } = useGetTokenBalance()
  const tooltipId = useId('tooltip')
  const buttonId = useId('targetButton')
  const calloutProps = useConst({
    gapSpace: 0,
    // If the tooltip should point to an absolutely-positioned element,
    // you must manually specify the callout target.
    target: `#${buttonId}`,
  })
  const onClickCopy = () => {
    const text = account.data.paymentAddress
    setContentTooltip('Copied')
    setTimeout(() => {
      const elem = document.createElement('textarea')
      document.body.appendChild(elem)
      elem.value = text
      elem.select()
      document.execCommand('copy')
      document.body.removeChild(elem)
      setContentTooltip('Copy')
    }, 1500)
  }

  if (account.isSuccess) {
    return (
      <div className={classNames('relative flex flex-col items-center justify-between w-full h-full pl-4 pr-4 pb-4')}>
        <PersonaOutline onClick={showPanel}>
          <Persona imageUrl={Avatar} size={PersonaSize.size48} imageAlt="A" hidePersonaDetails />
        </PersonaOutline>
        <TextButton onClick={showPanel} color={theme.palette.themeDarker} hoverColor={theme.palette.themeDark}>
          <span className={classNames('mr-2')}>{account.data.name}</span>
          <Icon iconName="ChevronDown" />
        </TextButton>

        <TooltipHost content={contentTooltip} id={tooltipId} calloutProps={calloutProps}>
          <TextButton id={buttonId} aria-describedby={tooltipId} onClick={onClickCopy} hoverColor={theme.palette.themeDark}>
            <span className={classNames(`text-gray-3 font-medium paymentAddress ${styles.accountName}`)}>{account.data.paymentAddress}</span>
            <span className={classNames('text-gray-3 font-medium mr-2')}>...</span>
            <Icon iconName="Copy" />
          </TextButton>
        </TooltipHost>

        <Label className={classNames('text-5xl p-0')}>
          {balance || 0}
          <span className={classNames('ml-1 text-2xl text-gray-2')}>PRV</span>
        </Label>
        <Stack className={classNames('w-full mt-5 justify-between')} horizontal horizontalAlign="center">
          <Button onClick={showPanelReceive} iconProps={{ iconName: 'QRCode' }} text="Receive" />
          <SecondaryButton onClick={showPanelSend} iconProps={{ iconName: 'Send' }} text="Send" />
        </Stack>
      </div>
    )
  }
  return <SpinnerWallet />
}

const PersonaOutline = styled.div`
  cursor: pointer;
  border-radius: 50%;
  background: white;
  width: 56px;
  height: 56px;
  margin-top: -28px;
  margin-bottom: -4px;
  padding: 4px;
`

const TextButton = styled(ActionButton)<{ color?: string; hoverColor?: string }>`
  height: 28px;

  .ms-Button-flexContainer {
    font-size: 1rem;
    color: ${(props) => props.color};
    font-weight: 600;
  }

  &:hover {
    .ms-Button-flexContainer {
      color: ${(props) => props.hoverColor};
    }
  }
`
