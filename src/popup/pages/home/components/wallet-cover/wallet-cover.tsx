import classNames from 'classnames'
import React from 'react'
import { ActionButton, Icon, Label, Persona, PersonaSize, Stack } from '@fluentui/react'
import Avatar from 'popup/assets/avatar.png'
import styled from 'styled-components'
import { useTheme } from 'popup/services'
import { Button, SecondaryButton } from 'popup/components/button'

export const WalletCover = () => {
  const theme = useTheme()
  return (
    <div className={classNames('relative flex flex-col items-center justify-between w-full h-full pl-4 pr-4 pb-4')}>
      <PersonaOutline>
        <Persona imageUrl={Avatar} size={PersonaSize.size48} imageAlt="A" hidePersonaDetails />
      </PersonaOutline>
      <TextButton color={theme.palette.themeDarker} hoverColor={theme.palette.themeDark}>
        <span className={classNames('mr-2')}>Acount 01 </span>
        <Icon iconName="ChevronDown" />
      </TextButton>
      <TextButton hoverColor={theme.palette.themeDark}>
        <span className={classNames('text-gray-3 font-medium mr-2')}>SDFGASDFPEWRWQSA34B</span>
        <Icon iconName="Copy" />
      </TextButton>
      <Label className={classNames('text-5xl p-0')}>
        101.25
        <span className={classNames('ml-1 text-2xl text-gray-2')}>USD</span>
      </Label>
      <Stack className={classNames('w-full mt-5 justify-between')} horizontal horizontalAlign="center">
        <Button iconProps={{ iconName: 'QRCode' }} text="Receive" />
        <SecondaryButton iconProps={{ iconName: 'Send' }} text="Send" />
      </Stack>
    </div>
  )
}

const PersonaOutline = styled.div`
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
