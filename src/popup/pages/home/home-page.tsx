/* eslint-disable react/no-this-in-sfc */
import React from 'react'
import classNames from 'classnames'
import { useBoolean } from '@uifabric/react-hooks'
import { WalletBalance, WalletCover, WalletMenu, NetworkPanel, AddTokenPanel, AddAccountPanel, BackupAccountPanel } from './components'
import { ReceivePanel } from '../receive/receive'
import { SendPanel } from '../send/send'

const HomeContainer: React.FC<{
  cover: React.ReactNode
  menu?: React.ReactNode
  network: React.ReactNode
  token: React.ReactNode
  account: React.ReactNode
  receive: React.ReactNode
  send: React.ReactNode
  backup: React.ReactNode
}> = ({ children, cover, menu, network, token, account, receive, send, backup }) => (
  <div className={classNames('flex flex-col relative w-full h-full overflow-hidden')}>
    <div className={classNames('absolute self-center mt-20 shadow-md w-11/12 h-56 z-10 bg-white')}>{cover}</div>
    <div className={classNames('flex flex-row align-top justify-between w-full h-48 bg-blue-1 p-4')}>{menu}</div>
    <div className={classNames('w-full h-full mt-32')}>{children}</div>
    <div className={classNames('w-full h-full')}>{network}</div>
    <div className={classNames('w-full h-full')}>{token}</div>
    <div className={classNames('w-full h-full')}>{account}</div>
    <div className={classNames('w-full h-full')}>{receive}</div>
    <div className={classNames('w-full h-full')}>{send}</div>
    <div className={classNames('w-full h-full')}>{backup}</div>
  </div>
)

export const HomePage = () => {
  const [isPanelOpenNetwork, { setTrue: showPanelNetwork, setFalse: dismissPanelNetwork }] = useBoolean(false)
  const [isPanelOpenToken, { setTrue: showPanelToken, setFalse: dismissPanelToken }] = useBoolean(false)
  const [isPanelOpenAcc, { setTrue: showPanelAcc, setFalse: dismissPanelAcc }] = useBoolean(false)
  const [isPanelOpenReceive, { setTrue: showPanelReceive, setFalse: dismissPanelReceive }] = useBoolean(false)
  const [isPanelOpenSend, { setTrue: showPanelSend, setFalse: dismissPanelSend }] = useBoolean(false)
  const [isPanelOpenBackup, { setTrue: showPanelBackup, setFalse: dismissPanelBackup }] = useBoolean(false)
  const onDismissPanelRight = (panel) => {
    const element = document.querySelector(`.${panel} .ms-Panel`) as HTMLElement
    element.style.animation = 'none'
    element.style.animation = 'moveOutRight 0.3s'
    setTimeout(() => {
      element.style.animation = 'moveInRight 0.3s'
      if (panel === 'send') {
        dismissPanelSend()
      } else if (panel === 'receive') {
        dismissPanelReceive()
      }
    }, 160)
  }
  const dismissPanelBottom = (panel) => {
    const element = document.querySelector(`.${panel} .ms-Panel`) as HTMLElement
    element.style.animation = 'none'
    element.style.animationDelay = 'none'
    element.style.animation = 'moveOutBottom 0.3s'
    setTimeout(() => {
      element.style.animation = 'moveInBottom 0.3s'
      if (panel === 'add-token') {
        dismissPanelToken()
      } else if (panel === 'account') {
        dismissPanelAcc()
      } else if (panel === 'network') {
        dismissPanelNetwork()
      } else if (panel === 'backupAccount') {
        dismissPanelBackup()
      }
    }, 200)
  }
  return (
    <HomeContainer
      receive={<ReceivePanel isPanelOpen={isPanelOpenReceive} showPanel={showPanelReceive} dismissPanel={() => onDismissPanelRight('receive')} />}
      send={<SendPanel isPanelOpen={isPanelOpenSend} showPanel={showPanelSend} dismissPanel={() => onDismissPanelRight('send')} />}
      cover={<WalletCover showPanel={showPanelAcc} showPanelReceive={showPanelReceive} showPanelSend={showPanelSend} />}
      menu={<WalletMenu showPanel={showPanelNetwork} showPanelAcc={showPanelAcc} showPanelBackup={showPanelBackup} />}
      token={<AddTokenPanel isPanelOpen={isPanelOpenToken} showPanel={showPanelToken} dismissPanel={() => dismissPanelBottom('add-token')} />}
      network={<NetworkPanel isPanelOpen={isPanelOpenNetwork} showPanel={showPanelNetwork} dismissPanel={() => dismissPanelBottom('network')} />}
      account={<AddAccountPanel isPanelOpen={isPanelOpenAcc} showPanel={showPanelAcc} dismissPanel={() => dismissPanelBottom('account')} />}
      backup={<BackupAccountPanel isPanelOpen={isPanelOpenBackup} showPanel={showPanelBackup} dismissPanel={() => dismissPanelBottom('backupAccount')} />}
    >
      <WalletBalance showPanel={showPanelToken} />
    </HomeContainer>
  )
}
