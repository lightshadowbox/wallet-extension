/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Icon, Label, List, Persona, PersonaSize, Stack, Spinner, SpinnerSize } from '@fluentui/react'
import classNames from 'classnames'
import React from 'react'
import './wallet-balance.css'
import { SecondaryButton } from 'popup/components/button'

import { useSettingStore } from 'popup/stores/features/settings'
import { useGetTokenForAccount } from 'queries/token.queries'

interface Props {
  showPanel: () => void
}

export const WalletBalance: React.FC<Props> = ({ showPanel }) => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  const { data: tokenListData } = useGetTokenForAccount(selectedAccount)

  const cellRender = React.useCallback(
    (_, index: number): JSX.Element => {
      const i = tokenListData[index]
      console.log(i)
      return (
        <div className={classNames('flex p-4 hover:bg-gray-6')}>
          <div className={classNames('flex items-center w-12')}>
            <Persona showUnknownPersonaCoin={!i?.tokenId} imageUrl={i?.icon} size={PersonaSize.size32} hidePersonaDetails />
          </div>
          <div className={classNames('flex items-center flex-grow')}>
            <Label>{i.name}</Label>
          </div>
          <div className={classNames('flex items-center justify-end')}>
            <Label className={classNames('text-gray-2 text-xs font-normal')}>1.25 USD</Label>
          </div>
        </div>
      )
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
      <div className="lsb-WalletBalance--list">
        {tokenListData ? (
          <List items={tokenListData || []} onRenderCell={cellRender} />
        ) : (
          <div className={classNames('w-full h-full flex flex-col align-middle justify-center')}>
            <Stack>
              <Spinner size={SpinnerSize.large} />
            </Stack>
          </div>
        )}
      </div>
    </div>
  )
}
