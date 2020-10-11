import { Icon, Label, List, Persona, PersonaPresence, PersonaSize } from '@fluentui/react'
import classNames from 'classnames'
import React from 'react'
import PrvIcon from 'popup/assets/prv@2x.png'
import './wallet-balance.css'
import { SecondaryButton } from 'popup/components/button'

interface IExample {
  icon: string
  tokenName: string
  balance: number
  unitPrice: number
  available?: boolean
}

const ITEMS: IExample[] = [
  {
    icon: PrvIcon,
    tokenName: 'Privacy',
    balance: 1.001,
    unitPrice: 1.25,
    available: true,
  },
  {
    icon: PrvIcon,
    tokenName: 'Essential',
    balance: 7.011,
    unitPrice: 1.25,
  },
  {
    icon: PrvIcon,
    tokenName: 'Bitcoin',
    balance: 2.342,
    unitPrice: 1.25,
  },
  {
    icon: PrvIcon,
    tokenName: 'Ethereum',
    balance: 1.12312,
    unitPrice: 1.25,
  },
  {
    icon: PrvIcon,
    tokenName: 'Ethereum',
    balance: 1.12312,
    unitPrice: 1.25,
  },
]

const BalanceItem = (item: IExample): JSX.Element => {
  const { icon, tokenName, balance, unitPrice, available } = item
  return (
    <div className={classNames('flex p-4 hover:bg-gray-6')}>
      <div className={classNames('flex items-center w-12')}>
        <Persona
          presence={available && PersonaPresence.online}
          imageUrl={icon}
          size={PersonaSize.size32}
          hidePersonaDetails
        />
      </div>
      <div className={classNames('flex items-center flex-grow')}>
        <Label>{`${balance.toFixed(2)} ${tokenName}`}</Label>
      </div>
      <div className={classNames('flex items-center justify-end')}>
        <Label className={classNames('text-gray-2 text-xs font-normal')}>{`${(balance * unitPrice).toFixed(
          2,
        )} USD`}</Label>
      </div>
    </div>
  )
}

export const WalletBalance = () => {
  return (
    <div className="lsb-WalletBalance--container">
      <SecondaryButton full backgroundColor="transparent">
        <div className={classNames('w-full flex items-center')}>
          <div className={classNames('flex items-center w-12 pl-2')}>
            <Icon iconName="Add" />
          </div>
          <div className={classNames('flex flex-grow text-sm')}>Add token</div>
        </div>
      </SecondaryButton>
      <div className="lsb-WalletBalance--list">
        <List items={ITEMS} onRenderCell={BalanceItem} />
      </div>
    </div>
  )
}
