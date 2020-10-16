import classNames from 'classnames'
import React from 'react'
import { LayerHost, ILayerProps, Panel, IFocusTrapZoneProps, mergeStyles, Customizer } from '@fluentui/react'
import { useId } from '@uifabric/react-hooks'
import { Header, SearchInput, ListGhostingExample } from './components/index'
import styles from './add-token-panel.module.css'
import './add-token-panel.css'

interface Props {
  isPanelOpen: boolean
  showPanel: () => void
  dismissPanel: () => void
}
const AddTokenContainer: React.FC<{
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
export const AddTokenPanel: React.FC<Props> = ({ isPanelOpen, showPanel, dismissPanel }) => {
  const layerHostId = useId('layerHost')

  const scopedSettings = useLayerSettings(true, layerHostId)
  return (
    isPanelOpen && (
      <div className={`absolute inset-0 network ${styles.container}`}>
        <Customizer scopedSettings={scopedSettings}>
          <Panel isOpen focusTrapZoneProps={focusTrapZoneProps}>
            <AddTokenContainer
              header={<Header title="Add Token" icon="ChromeClose" dismissPanel={dismissPanel} />}
              searchInput={<SearchInput placeholder="Choose token..." />}
              list={<ListGhostingExample />}
            >
              <div>Body will coming soon </div>
            </AddTokenContainer>
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
