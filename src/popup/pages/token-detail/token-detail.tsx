/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react'

import classNames from 'classnames'

import { Customizer, IFocusTrapZoneProps, ILayerProps, LayerHost, mergeStyles, Panel } from '@fluentui/react'
import { useId, useBoolean } from '@uifabric/react-hooks'
import { getTokenFromTokenIds } from 'queries/token.queries'
import { ReceivePanel } from 'popup/pages/receive/receive'
import { useSettingStore } from 'popup/stores/features/settings'
import { Header } from 'popup/components/header/header'
import { getKyberTokens } from 'services/trading/kyber'
import { withCalculateOutput } from 'services/trading'
import { DetailCover, TokenHistory } from './components'
import styles from './token-detail.module.css'
import './token-detail.css'

interface Props {
  isPanelOpen: boolean
  showPanel: () => void
  dismissPanel: () => void
  tokenId: string
  showPanelReceive: () => void
  showPanelSend: () => void
}

const TokenDetailContainer: React.FC<{
  header: React.ReactNode
  detailCover: React.ReactNode
  tokenHistory: React.ReactNode
  receive: React.ReactNode
}> = ({ header, detailCover, tokenHistory, receive }) => {
  return (
    <div className={classNames(`flex flex-col w-full justify-between relative ${styles.tokenDetailContainer}`)}>
      <div className={classNames('flex flex-col')}>
        <div className={classNames('w-full')}>{header}</div>
        <div className={classNames('w-full ')}>{detailCover}</div>
        <div className={classNames('w-full')}>{tokenHistory}</div>
        <div className={classNames('test w-full h-full')}>{receive}</div>
      </div>
    </div>
  )
}
const TokenDetailPanel: React.FC<Props> = ({ isPanelOpen, showPanel, dismissPanel, tokenId, showPanelSend }) => {
  const [isPanelOpenReceive, { setTrue: showPanelReceive, setFalse: dismissPanelReceive }] = useBoolean(false)
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  const tokenInfos = getTokenFromTokenIds([tokenId])
  const layerHostId = useId('layerHost')
  const scopedSettings = useLayerSettings(true, layerHostId)
  const test = async () => {
    console.log(`test: ${JSON.stringify(await getKyberTokens())}`)
  }
  React.useEffect(() => {
    test()
  }, [tokenId])
  /**
   * Event Handlers
   */
  const onDismissPanelDetail = () => {
    const element = document.querySelector('.token-detail') as HTMLElement
    element.style.animation = 'none'
    element.style.animation = 'moveOutRightReceive 0.3s'
    setTimeout(() => {
      element.style.animation = 'moveInRight 0.3s'
      dismissPanel()
    }, 290)
  }
  const onDismissPanelRight = (panel) => {
    const element = document.querySelector('.receive') as HTMLElement
    console.log(element)

    element.style.animation = 'moveOutRightReceive 0.3s'
    element.style.animationFillMode = 'forwards'
    setTimeout(() => {
      element.style.animation = 'moveInRight 0.3s'
      if (panel === 'receive') {
        dismissPanelReceive()
      }
    }, 290)
  }

  return (
    isPanelOpen &&
    tokenId && (
      <div className={`absolute inset-0 token-detail ${styles.container}`}>
        <Customizer scopedSettings={scopedSettings}>
          <Panel isOpen focusTrapZoneProps={focusTrapZoneProps}>
            <TokenDetailContainer
              receive={
                <ReceivePanel
                  defaultActive="out-network"
                  showPanelShieldToken={showPanelReceive}
                  tokenId={tokenId}
                  isPanelOpen={isPanelOpenReceive}
                  showPanel={showPanelReceive}
                  dismissPanel={() => onDismissPanelRight('receive')}
                />
              }
              header={<Header title={tokenInfos[tokenId].Name} icon="ChromeBack" dismissPanel={onDismissPanelDetail} />}
              detailCover={<DetailCover tokenId={tokenId} showPanelReceive={showPanelReceive} showPanelSend={showPanelSend} />}
              tokenHistory={<TokenHistory tokenId={tokenId} accountName={selectedAccount} />}
            />
          </Panel>
        </Customizer>
        <LayerHost id={layerHostId} className={layerHostClass} />
      </div>
    )
  )
}
export default withCalculateOutput(TokenDetailPanel)
const layerHostClass = mergeStyles({
  position: 'relative',
  height: 600,
  width: 360,
  overflow: 'scroll',
})

const focusTrapZoneProps: IFocusTrapZoneProps = {
  isClickableOutsideFocusTrap: true,
  forceFocusInsideTrap: false,
}

function useLayerSettings(trapPanel: boolean, layerHostId: string): { Layer?: ILayerProps } {
  return React.useMemo(() => {
    if (trapPanel) {
      const layerProps: ILayerProps = { hostId: layerHostId }
      return { Layer: layerProps }
    }
    return {}
  }, [trapPanel, layerHostId])
}
