import classNames from 'classnames'
import React from 'react'
import { LayerHost, ILayerProps, Panel, IFocusTrapZoneProps, mergeStyles, Customizer } from '@fluentui/react'
import { useId } from '@uifabric/react-hooks'
import { Header, AccountList, BtnAdd } from './components/index'
import styles from './add-account-panel.module.css'
import './add-account-panel.css'

interface Props {
  isPanelOpen: boolean
  showPanel: () => void
  dismissPanel: () => void
}
const AddAccountContainer: React.FC<{
  header: React.ReactNode
  button: React.ReactNode
  account: React.ReactNode
}> = ({ header, button, account }) => (
  <div className={classNames('flex flex-col relative justify-center items-center bg-white')}>
    <div className={classNames('w-full h-full')}>{header}</div>
    <div className={classNames('w-full h-full')}>{button}</div>
    <div className={classNames('w-full h-full')}>{account}</div>
  </div>
)

export const AddAccountPanel: React.FC<Props> = ({ isPanelOpen, showPanel, dismissPanel }) => {
  const layerHostId = useId('layerHost')

  const scopedSettings = useLayerSettings(true, layerHostId)
  return (
    isPanelOpen && (
      <div className={`absolute inset-0 account ${styles.container}`}>
        <Customizer scopedSettings={scopedSettings}>
          <Panel isOpen focusTrapZoneProps={focusTrapZoneProps}>
            <AddAccountContainer
              header={<Header title="Add Account" icon="ChromeClose" dismissPanel={dismissPanel} />}
              button={<BtnAdd />}
              account={<AccountList />}
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
