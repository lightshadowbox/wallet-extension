/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Icon, Label, List, Persona, PersonaSize, Stack, Spinner, SpinnerSize } from '@fluentui/react'
import classNames from 'classnames'
import React from 'react'
import { SpinnerWallet } from 'popup/components/spinner/spinner-wallet'
import './wallet-balance.css'
import { SecondaryButton } from 'popup/components/button'

import { useSettingStore } from 'popup/stores/features/settings'
import { useGetTokenBalance, useGetTokenForAccount } from 'queries/token.queries'

interface Props {
  showPanel: () => void
}

export const BalanceListCell: React.FC<{
  item: {
    tokenId: string
    name: string
    icon: string
    type: number
    isFollowing: boolean
  }
}> = ({ item }) => {
  const balance = useGetTokenBalance(item.tokenId)
  return (
    <div className={classNames('flex p-4 hover:bg-gray-6')}>
      <div className={classNames('flex items-center w-12')}>
        <Persona showUnknownPersonaCoin={!item?.tokenId} imageUrl={item?.icon} size={PersonaSize.size32} hidePersonaDetails />
      </div>
      <div className={classNames('flex items-center flex-grow')}>
        <Label>{item.name}</Label>
      </div>
      <div className={classNames('flex items-center justify-end')}>
        <Label className={classNames('text-gray-2 text-xs font-normal')}>{balance?.data !== null ? balance.data : <Spinner size={SpinnerSize.xSmall} />}</Label>
      </div>
    </div>
  )
}

export const WalletBalance: React.FC<Props> = ({ showPanel }) => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  const { data: tokenListData } = useGetTokenForAccount(selectedAccount)

  const cellRender = React.useCallback(
    (_, index: number): JSX.Element => {
      const i = tokenListData[index]
      return <BalanceListCell item={i} />
    },
    [tokenListData?.length],
  )

  return (
    <div className="lsb-WalletBalance--container">
      <SecondaryButton full backgroundColor="transparent">
        <div onClick={showPanel} className={classNames('w-full flex items-center')}>
          <div className={classNames('flex items-center w-12 pl-2')}>
            <Icon iconName="Add" />
          </div>
          <div className={classNames('flex flex-grow text-sm')}>Add token</div>
        </div>
      </SecondaryButton>
      <div className="lsb-WalletBalance--list">{tokenListData ? <List items={tokenListData || []} onRenderCell={cellRender} /> : <SpinnerWallet />}</div>
    </div>
  )
}
