/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react'

import classNames from 'classnames'

import { Customizer, IFocusTrapZoneProps, ILayerProps, LayerHost, mergeStyles, Panel } from '@fluentui/react'
import { useId } from '@uifabric/react-hooks'
import { Header, DetailCover, TokenHistoty } from './components/index'
import styles from './token-detail.module.css'
import './token-detail.css'

interface Props {
  isPanelOpen: boolean
  showPanel: () => void
  dismissPanel: () => void
  tokenId: string
}

const TokenDetailContainer: React.FC<{
  header: React.ReactNode
  detailCover: React.ReactNode
  tokenHistory: React.ReactNode
}> = ({ header, detailCover, tokenHistory }) => {
  return (
    <div className={classNames(`flex flex-col w-full justify-between relative ${styles.tokenDetailContainer}`)}>
      <div className={classNames('flex flex-col')}>
        <div className={classNames('w-full')}>{header}</div>
        <div className={classNames('w-full ')}>{detailCover}</div>
        <div className={classNames('w-full ')}>{tokenHistory}</div>
      </div>
    </div>
  )
}
export const TokenDetailPanel: React.FC<Props> = ({ isPanelOpen, showPanel, dismissPanel, tokenId }) => {
  const onDismissPanelRight = () => {
    const element = document.querySelector('.token-detail') as HTMLElement
    element.style.animation = 'none'
    element.style.animation = 'moveOutRight 0.3s'
    setTimeout(() => {
      element.style.animation = 'moveInRight 0.3s'
      dismissPanel()
    }, 160)
  }
  const layerHostId = useId('layerHost')
  const scopedSettings = useLayerSettings(true, layerHostId)
  return (
    isPanelOpen &&
    tokenId && (
      <div className={`absolute inset-0 token-detail ${styles.container}`}>
        <Customizer scopedSettings={scopedSettings}>
          <Panel isOpen focusTrapZoneProps={focusTrapZoneProps}>
            <TokenDetailContainer
              header={<Header title="ZClassic" icon="ChromeBack" dismissPanel={onDismissPanelRight} />}
              detailCover={<DetailCover />}
              tokenHistory={<TokenHistoty />}
            />
          </Panel>
        </Customizer>
        <LayerHost id={layerHostId} className={layerHostClass} />
      </div>
    )
  )
}
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
