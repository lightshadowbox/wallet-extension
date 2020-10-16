import classNames from 'classnames'
import React from 'react'
import { Toggle, LayerHost, ILayerProps, Panel, IFocusTrapZoneProps, mergeStyles, Customizer } from '@fluentui/react'
import { useId } from '@uifabric/react-hooks'
import { Header, SearchInput, ListNetwork } from './components/index'
import './network-panel.css'
import styles from './network-panel.module.css'

interface Props {
  isPanelOpen: boolean
  showPanel: () => void
  dismissPanel: () => void
}
export const NetworkContainer: React.FC<{
  header: React.ReactNode
  searchInput: React.ReactNode
  list: React.ReactNode
}> = ({ header, searchInput, list }) => (
  <div className={classNames('flex flex-col relative justify-center items-center p-md bg-white')}>
    <div className={classNames('w-full h-full')}>{header}</div>
    <div className={classNames('w-full h-full')}>{searchInput}</div>
    <div className={classNames('w-full h-full')}>{list}</div>
  </div>
)
export const NetworkPanel: React.FC<Props> = ({ isPanelOpen, showPanel, dismissPanel }) => {
  const layerHostId = useId('layerHost')

  const scopedSettings = useLayerSettings(true, layerHostId)
  return (
    isPanelOpen && (
      <div className={`absolute inset-0 network ${styles.container}`}>
        <Customizer scopedSettings={scopedSettings}>
          <Panel isOpen focusTrapZoneProps={focusTrapZoneProps}>
            <NetworkContainer
              header={<Header title="Choose Network" icon="ChromeClose" dismissPanel={dismissPanel} />}
              searchInput={<SearchInput placeholder="Choose network..." />}
              list={<ListNetwork />}
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
  maxHeight: 600,
  height: '100%',
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
