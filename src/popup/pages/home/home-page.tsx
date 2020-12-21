/* eslint-disable react/no-this-in-sfc */
import React from 'react'
import classNames from 'classnames'
import { useBoolean } from '@uifabric/react-hooks'
import { TokenDetailPanel } from 'popup/pages/token-detail/token-detail'
import { ImportAccountPanel } from 'popup/pages/connect/Connect-panel'
import { WalletBalance, WalletCover, WalletMenu, NetworkPanel, AddTokenPanel, AddAccountPanel, BackupAccountPanel } from './components/index'
import { ShieldTokenPanel } from '../shield-token/shield-token-panel'
import { ReceivePanel } from '../receive/receive'
import { SendPanel } from '../send/send'
import styles from './home-page.module.css'

const HomeContainer: React.FC<{
  cover: React.ReactNode
  menu?: React.ReactNode
  network: React.ReactNode
  token: React.ReactNode
  account: React.ReactNode
  receive: React.ReactNode
  send: React.ReactNode
  backup: React.ReactNode
  tokenDetail: React.ReactNode
  shield: React.ReactNode
  importAccount: React.ReactNode
}> = ({ children, cover, menu, network, token, account, receive, send, backup, tokenDetail, shield, importAccount }) => (
  <div className={classNames('flex flex-col relative w-full h-full overflow-hidden')}>
    <div className={classNames('absolute self-center mt-20 shadow-md w-11/12 h-56 z-10 bg-white')}>{cover}</div>
    <div className={classNames(`flex flex-row align-top justify-between w-full h-48 p-4 ${styles.bgContainer}`)}>{menu}</div>
    <div className={classNames('w-full h-full mt-32')}>{children}</div>
    <div className={classNames('w-full h-full')}>{network}</div>
    <div className={classNames('w-full h-full')}>{token}</div>
    <div className={classNames('w-full h-full')}>{account}</div>
    <div className={classNames('w-full h-full')}>{importAccount}</div>
    <div className={classNames('w-full h-full')}>{shield}</div>
    <div className={classNames('w-full h-full')}>{receive}</div>
    <div className={classNames('w-full h-full')}>{send}</div>
    <div className={classNames('w-full h-full')}>{backup}</div>
    <div className={classNames('w-full h-full')}>{tokenDetail}</div>
  </div>
)

export const HomePage = () => {
  const [preTokenId, setTokenPreId] = React.useState('')
  const [isPanelOpenNetwork, { setTrue: showPanelNetwork, setFalse: dismissPanelNetwork }] = useBoolean(false)
  const [isPanelOpenToken, { setTrue: showPanelToken, setFalse: dismissPanelToken }] = useBoolean(false)
  const [isPanelOpenShieldToken, { setTrue: showPanelShieldToken, setFalse: dismissPanelShieldToken }] = useBoolean(false)
  const [isPanelOpenAcc, { setTrue: showPanelAcc, setFalse: dismissPanelAcc }] = useBoolean(false)
  const [isPanelOpenReceive, { setTrue: showPanelReceive, setFalse: dismissPanelReceive }] = useBoolean(false)
  const [isPanelOpenSend, { setTrue: showPanelSend, setFalse: dismissPanelSend }] = useBoolean(false)
  const [isPanelOpenBackup, { setTrue: showPanelBackup, setFalse: dismissPanelBackup }] = useBoolean(false)
  const [isPanelOpenTokenDetail, { setTrue: showPanelTokenDetail, setFalse: dismissPanelTokenDetail }] = useBoolean(false)
  const [tokenId, setTokenId] = React.useState(null)
  const [isPanelOpenImport, { setTrue: showPanelImport, setFalse: dismissPanelImport }] = useBoolean(false)
  const [accountName, setAccountName] = React.useState(null)
  const onShowPanelSend = (event = null, tokenId = null, accountName = null) => {
    showPanelSend()
    setTokenId(tokenId)
    setAccountName(accountName)
  }
  const onShowPanelTokenDetail = (tokenId) => {
    showPanelTokenDetail()
    setTokenPreId(tokenId)
  }
  const onDismissPanelRight = (panel) => {
    const element = document.querySelector(`.${panel} .ms-Panel`) as HTMLElement
    element.style.animation = 'none'
    element.style.animation = 'moveOutRight 0.3s'
    setTimeout(() => {
      element.style.animation = 'moveInRight 0.3s'
      if (panel === 'send') {
        setTokenId(null)
        dismissPanelSend()
      } else if (panel === 'receive') {
        dismissPanelReceive()
      }
    }, 290)
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
      } else if (panel === 'shield-token') {
        dismissPanelShieldToken()
      } else if (panel === 'connect') {
        dismissPanelImport()
      }
    }, 200)
  }
  return (
    <HomeContainer
      importAccount={<ImportAccountPanel isPanelOpen={isPanelOpenImport} showPanel={showPanelImport} dismissPanel={() => dismissPanelBottom('connect')} />}
      tokenDetail={
        <TokenDetailPanel
          showPanelReceive={showPanelReceive}
          showPanelSend={onShowPanelSend}
          tokenId={preTokenId}
          isPanelOpen={isPanelOpenTokenDetail}
          showPanel={showPanelTokenDetail}
          dismissPanel={dismissPanelTokenDetail}
        />
      }
      shield={
        <ShieldTokenPanel isPanelOpen={isPanelOpenShieldToken} showPanel={showPanelShieldToken} dismissPanel={() => dismissPanelBottom('shield-token')} />
      }
      receive={
        <ReceivePanel
          defaultActive="in-network"
          tokenId={null}
          isPanelOpen={isPanelOpenReceive}
          showPanel={showPanelReceive}
          showPanelShieldToken={showPanelShieldToken}
          dismissPanel={() => onDismissPanelRight('receive')}
        />
      }
      send={
        <SendPanel
          tokenId={tokenId}
          accountName={accountName}
          isPanelOpen={isPanelOpenSend}
          showPanel={onShowPanelSend}
          dismissPanel={() => onDismissPanelRight('send')}
        />
      }
      cover={<WalletCover showPanel={showPanelAcc} showPanelReceive={showPanelReceive} showPanelSend={onShowPanelSend} />}
      menu={<WalletMenu showPanel={showPanelNetwork} showPanelAcc={showPanelAcc} showPanelBackup={showPanelBackup} />}
      token={<AddTokenPanel isPanelOpen={isPanelOpenToken} showPanel={showPanelToken} dismissPanel={() => dismissPanelBottom('add-token')} />}
      network={<NetworkPanel isPanelOpen={isPanelOpenNetwork} showPanel={showPanelNetwork} dismissPanel={() => dismissPanelBottom('network')} />}
      account={<AddAccountPanel isPanelOpen={isPanelOpenAcc} showPanel={showPanelImport} dismissPanel={() => dismissPanelBottom('account')} />}
      backup={<BackupAccountPanel isPanelOpen={isPanelOpenBackup} showPanel={showPanelBackup} dismissPanel={() => dismissPanelBottom('backupAccount')} />}
    >
      <WalletBalance showPanelTokenDetail={onShowPanelTokenDetail} showPanel={showPanelToken} />
    </HomeContainer>
  )
}
