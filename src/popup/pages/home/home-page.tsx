import React from 'react'
import classNames from 'classnames'
import { useBoolean } from '@uifabric/react-hooks'
import { WalletBalance, WalletCover, WalletMenu } from './components'
import { NetworkPanel } from './components/network/network-panel'
import { AddTokenPanel } from './components/add-token/add-token-panel'

const HomeContainer: React.FC<{
  cover: React.ReactNode
  menu?: React.ReactNode
  network: React.ReactNode
  token: React.ReactNode
}> = ({ children, cover, menu, network, token }) => (
  <div className={classNames('flex flex-col relative w-full h-full')}>
    <div className={classNames('absolute self-center mt-20 shadow-md w-11/12 h-56 z-10 bg-white')}>{cover}</div>
    <div className={classNames('flex flex-row align-top justify-between w-full h-48 bg-blue-1 p-4')}>{menu}</div>
    <div className={classNames('w-full h-full mt-32')}>{children}</div>
    <div className={classNames('w-full h-full')}>{network}</div>
    <div className={classNames('w-full h-full')}>{token}</div>
  </div>
)

export const HomePage = () => {
  const [isPanelOpenNetwork, { setTrue: showPanelNetwork, setFalse: dismissPanelNetwork }] = useBoolean(false)
  const [isPanelOpenToken, { setTrue: showPanelToken, setFalse: dismissPanelToken }] = useBoolean(false)
  return (
    <HomeContainer
      cover={<WalletCover />}
      menu={<WalletMenu showPanel={showPanelNetwork} />}
      token={<AddTokenPanel isPanelOpen={isPanelOpenToken} showPanel={showPanelToken} dismissPanel={dismissPanelToken} />}
      network={<NetworkPanel isPanelOpen={isPanelOpenNetwork} showPanel={showPanelNetwork} dismissPanel={dismissPanelNetwork} />}
    >
      <WalletBalance showPanel={showPanelToken} />
    </HomeContainer>
  )
}
