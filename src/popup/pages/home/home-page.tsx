/* eslint-disable react/no-this-in-sfc */
import React from 'react'
import classNames from 'classnames'
import { useBoolean } from '@uifabric/react-hooks'
import { WalletBalance, WalletCover, WalletMenu } from './components'
import { NetworkPanel } from './components/network/network-panel'
import { AddTokenPanel } from './components/add-token/add-token-panel'
import { AddAccountPanel } from './components/add-account/add-account-panel'

const HomeContainer: React.FC<{
  cover: React.ReactNode
  menu?: React.ReactNode
  network: React.ReactNode
  token: React.ReactNode
  account: React.ReactNode
}> = ({ children, cover, menu, network, token, account }) => (
  <div className={classNames('flex flex-col relative w-full h-full')}>
    <div className={classNames('absolute self-center mt-20 shadow-md w-11/12 h-56 z-10 bg-white')}>{cover}</div>
    <div className={classNames('flex flex-row align-top justify-between w-full h-48 bg-blue-1 p-4')}>{menu}</div>
    <div className={classNames('w-full h-full mt-32')}>{children}</div>
    <div className={classNames('w-full h-full')}>{network}</div>
    <div className={classNames('w-full h-full')}>{token}</div>
    <div className={classNames('w-full h-full')}>{account}</div>
  </div>
)

export const HomePage = () => {
  const [isPanelOpenNetwork, { setTrue: showPanelNetwork, setFalse: dismissPanelNetwork }] = useBoolean(false)
  const [isPanelOpenToken, { setTrue: showPanelToken, setFalse: dismissPanelToken }] = useBoolean(false)
  const [isPanelOpenAcc, { setTrue: showPanelAcc, setFalse: dismissPanelAcc }] = useBoolean(false)
  const dismissPanelTo = () => {
    const element = document.querySelector('.add-token .ms-Panel') as HTMLElement
    element.style.animation = 'none'
    element.style.animation = 'moveOutBottom 0.3s'
    setTimeout(() => {
      element.style.animation = 'moveInBottom 0.3s'
      dismissPanelToken()
    }, 200)
  }
  const dismissPanelAccount = () => {
    const element = document.querySelector('.account .ms-Panel') as HTMLElement
    element.style.animation = 'none'
    element.style.animation = 'moveOutBottom 0.3s'
    setTimeout(() => {
      element.style.animation = 'moveInBottom 0.3s'
      dismissPanelAcc()
    }, 200)
  }
  const dismissPanelNet = () => {
    const element = document.querySelector('.network .ms-Panel') as HTMLElement
    element.style.animation = 'none'
    element.style.animation = 'moveOutBottom 0.3s'
    setTimeout(() => {
      element.style.animation = 'moveInBottom 0.3s'
      dismissPanelNetwork()
    }, 200)
  }
  return (
    <HomeContainer
      cover={<WalletCover showPanel={showPanelAcc} />}
      menu={<WalletMenu showPanel={showPanelNetwork} />}
      token={<AddTokenPanel isPanelOpen={isPanelOpenToken} showPanel={showPanelToken} dismissPanel={dismissPanelTo} />}
      network={<NetworkPanel isPanelOpen={isPanelOpenNetwork} showPanel={showPanelNetwork} dismissPanel={dismissPanelNet} />}
      account={<AddAccountPanel isPanelOpen={isPanelOpenAcc} showPanel={showPanelAcc} dismissPanel={dismissPanelAccount} />}
    >
      <WalletBalance showPanel={showPanelToken} />
    </HomeContainer>
  )
}
