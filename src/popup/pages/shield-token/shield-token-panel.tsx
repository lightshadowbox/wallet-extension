import classNames from 'classnames'
import React from 'react'
import { LayerHost, ILayerProps, Panel, IFocusTrapZoneProps, mergeStyles, Customizer } from '@fluentui/react'
import { useId, useBoolean } from '@uifabric/react-hooks'
import { ReceivePanel } from 'popup/pages/receive/receive'
import { Header, SearchInput, ListGhostingExample } from './components/index'
import styles from './shield-token-panel.module.css'
import './shield-token-panel.css'

interface Props {
  isPanelOpen: boolean
  showPanel: () => void
  dismissPanel: () => void
}
const ShieldTokenContainer: React.FC<{
  header: React.ReactNode
  searchInput: React.ReactNode
  list: React.ReactNode
  receive: React.ReactNode
}> = ({ header, searchInput, list, receive }) => (
  <div className={classNames('flex flex-col relative justify-center items-center p-md bg-white')}>
    <div className={classNames('w-full h-full')}>{receive}</div>
    <div className={classNames('w-full h-full')}>{header}</div>
    <div className={classNames('w-full h-full')}>{searchInput}</div>
    <div className={classNames('w-full h-full')}>{list}</div>
  </div>
)
export const ShieldTokenPanel: React.FC<Props> = ({ isPanelOpen, showPanel, dismissPanel }) => {
  const layerHostId = useId('layerHost')
  const [valueInput, setValueInput] = React.useState('')
  const [tokenId, setTokenId] = React.useState('')
  const scopedSettings = useLayerSettings(true, layerHostId)
  const [showCustom, setShowCustom] = React.useState(false)
  const [isPanelOpenReceive, { setTrue: showPanelReceive, setFalse: dismissPanelReceive }] = useBoolean(false)
  const onDismissPanelRight = (panel) => {
    const element = document.querySelector(`.shield-token .${panel} .ms-Panel`) as HTMLElement
    element.style.animation = 'none'
    element.style.animation = 'moveOutRight 0.3s'
    setTimeout(() => {
      element.style.animation = 'moveInRight 0.3s'
      if (panel === 'receive') {
        dismissPanelReceive()
      }
    }, 160)
  }
  return (
    isPanelOpen && (
      <div className={`absolute inset-0 shield-token ${styles.container}`}>
        <Customizer scopedSettings={scopedSettings}>
          <Panel isOpen focusTrapZoneProps={focusTrapZoneProps}>
            <ShieldTokenContainer
              header={<Header title="Shield" icon="ChromeClose" dismissPanel={dismissPanel} setValueInput={setValueInput} />}
              searchInput={<SearchInput setShowCustom={setShowCustom} placeholder="Choose token..." setValueInput={setValueInput} />}
              list={<ListGhostingExample setTokenId={setTokenId} showPanelReceive={showPanelReceive} showCustom={showCustom} valueInput={valueInput} />}
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
            >
              <div>Body will coming soon </div>
            </ShieldTokenContainer>
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
  overflow: 'hidden',
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
