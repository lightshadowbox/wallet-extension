import classNames from 'classnames'
import React from 'react'
import { ActionButton, IIconProps, Label, Persona, PersonaSize } from '@fluentui/react'
import Avatar from 'popup/assets/avatar.png'
import styled from 'styled-components'

export const WalletCover = () => {
  return (
    <div className={classNames('relative flex flex-col items-center w-full h-full')}>
      <PersonaOutline>
        <Persona imageUrl={Avatar} size={PersonaSize.size48} imageAlt="A" hidePersonaDetails />
      </PersonaOutline>
      <ActionButton menuIconProps={{ iconName: 'ChevronDown' }}>Acount 01</ActionButton>
    </div>
  )
}

const PersonaOutline = styled.div`
  border-radius: 50%;
  background: white;
  width: 56px;
  height: 56px;
  margin-top: -28px;
  padding: 4px;
`
