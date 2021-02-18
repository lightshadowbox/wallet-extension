/* eslint-disable react/no-this-in-sfc */
import React from 'react'
import classNames from 'classnames'
import { useBoolean } from '@uifabric/react-hooks'
import { TokenDetailPanel } from 'popup/pages/token-detail/token-detail'
import { Loading, Message } from 'popup/components'
import { SeedPhrase } from 'popup/pages/seed-phrase/seed-phrase'
import { ImportAccountPanel } from 'popup/pages/import-account/Connect-panel'
import { useAddToken } from 'queries/create-account.mutation'
import { useSettingStore, settingSlices } from 'popup/stores/features/settings'
import { store } from 'popup/stores'
import { ModalConnectTrade } from './components/trade-connect-modal/trade-connect-modal'
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
  modalConnect: React.ReactNode
  isModalConnectOpen: boolean
  message: React.ReactNode
  messageText: string
  loading: React.ReactNode
  isLoadingTrade: boolean
  seedPhrase: React.ReactNode
  isSeedPhraseOpen: boolean
}> = ({
  children,
  cover,
  menu,
  network,
  token,
  account,
  receive,
  send,
  backup,
  tokenDetail,
  shield,
  importAccount,
  modalConnect,
  isModalConnectOpen,
  message,
  messageText,
  loading,
  isLoadingTrade,
  seedPhrase,
  isSeedPhraseOpen,
}) => (
  <div className={classNames('flex flex-col relative w-full h-full overflow-hidden')}>
    {isSeedPhraseOpen ? <div className="w-full absolute inset-0">{seedPhrase}</div> : null}
    <div className={classNames('absolute self-center mt-20 shadow-md w-11/12 h-56 z-10 bg-white')}>{cover}</div>
    <div className={classNames(`flex flex-row align-top justify-between w-full h-48 p-4 ${styles.bgContainer}`)}>{menu}</div>
    {isLoadingTrade ? <div className="w-full h-full absolute">{loading}</div> : null}
    {messageText !== '' ? <div className="absolute inset-0">{message}</div> : null}
    <div className={classNames('w-full h-full mt-32')}>{children}</div>
    <div className={classNames('w-full h-full')}>{importAccount}</div>
    <div className={classNames('w-full h-full')}>{network}</div>
    <div className={classNames('w-full h-full')}>{token}</div>
    <div className={classNames('w-full h-full')}>{account}</div>
    {isModalConnectOpen ? <div className="w-full h-full absolute inset-0">{modalConnect}</div> : null}
    <div className={classNames('w-full h-full')}>{shield}</div>
    <div className={classNames('w-full h-full')}>{receive}</div>
    <div className={classNames('w-full h-full')}>{send}</div>
    <div className={classNames('w-full h-full')}>{backup}</div>
    <div className={classNames('w-full h-full')}>{tokenDetail}</div>
  </div>
)

export const HomePage: React.FC<{
  isModalConnectOpen: boolean
  setIsModalConnectOpen: (value) => void
  setIsAcceptConnect: (value) => void
  message: any
  setMessage: (value) => void
  onDismissModal: () => void
  setAccountTrade: (value) => void
  isLoadingTrade: boolean
}> = ({ isModalConnectOpen, setIsModalConnectOpen, setIsAcceptConnect, message, setMessage, onDismissModal, setAccountTrade, isLoadingTrade }) => {
  const [addToken] = useAddToken()
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
  const [isSeedPhraseOpen, setIsSeedPhraseOpen] = React.useState(false)
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
  const dismissPanelBottomImport = () => {
    const element = document.querySelector('.connect .ms-Panel') as HTMLElement
    element.style.animation = 'none'
    element.style.animation = 'moveOutBottomImport 0.3s'
    setTimeout(() => {
      element.style.animation = 'moveInBottomImport 0.3s'
      dismissPanelImport()
    }, 200)
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
      }
    }, 200)
  }
  const logOutWallet = () => {
    localStorage.setItem('isLogout', 'true')
    store.dispatch(settingSlices.actions.removeWallet())
  }
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  const isLogout = localStorage.getItem('isLogout')
  const onDismissSeedPhrase = (panel) => {
    const element = document.querySelector('.seed-phrase') as HTMLElement
    element.style.animation = 'none'
    element.style.animationDelay = 'none'
    element.style.animation = 'moveOutBottom 0.3s'
    setTimeout(() => {
      setIsSeedPhraseOpen(false)
    }, 180)
  }
  React.useEffect(() => {
    const dateExpiration = JSON.parse(localStorage.getItem('de'))
    const date = new Date()
    if (dateExpiration) {
      if (dateExpiration <= date.getTime()) {
        if (!isLogout && selectedAccount) {
          logOutWallet()
          localStorage.setItem('de', JSON.stringify(date.getTime() + 86400000))
        }
      }
    } else {
      logOutWallet()
      localStorage.setItem('de', JSON.stringify(date.getTime() + 86400000))
    }
    if (!JSON.parse(localStorage.getItem('isDownloadBackup'))) {
      setIsSeedPhraseOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  React.useEffect(() => {
    if (message.message !== '') {
      setTimeout(() => {
        setMessage({
          message: '',
          name: '',
        })
      }, 3000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message.message])

  React.useEffect(() => {
    const temp = [
      'b832e5d3b1f01a4f0623f7fe91d6673461e1f5d37d91fe78c5c2e6183ff39696',
      'ffd8d42dc40a8d166ea4848baf8b5f6e912ad79875f4373070b59392b1756c8f',
      '716fd1009e2a1669caacc36891e707bfdf02590f96ebd897548e8963c95ebac0',
      '1ff2da446abfebea3ba30385e2ca99b0f0bbeda5c6371f4c23c939672b429a42',
      '762aebadc4a5430759ceb6b38130cdfd240e87fac72d5034724ef76ba595672d',
    ]
    temp.map((tokenId) => {
      return addToken(tokenId)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccount])
  return (
    <HomeContainer
      isSeedPhraseOpen={isSeedPhraseOpen}
      seedPhrase={<SeedPhrase dismissPanel={onDismissSeedPhrase} />}
      isLoadingTrade={isLoadingTrade}
      loading={<Loading />}
      messageText={message.message}
      isModalConnectOpen={isModalConnectOpen}
      message={<Message message={message.message} name={message.name} />}
      modalConnect={
        <ModalConnectTrade
          isModalOpen={isModalConnectOpen}
          showModal={() => setIsModalConnectOpen(true)}
          hideModal={() => setIsModalConnectOpen(false)}
          setAccountTrade={setAccountTrade}
          onConnect={() => {
            setIsAcceptConnect(true)
            onDismissModal()
          }}
          onDismissConnect={() => {
            setIsAcceptConnect(false)
            onDismissModal()
          }}
        />
      }
      importAccount={<ImportAccountPanel isPanelOpen={isPanelOpenImport} showPanel={showPanelImport} dismissPanel={dismissPanelBottomImport} />}
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
