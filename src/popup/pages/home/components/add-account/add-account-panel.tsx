import classNames from 'classnames'
import React from 'react'
import { LayerHost, ILayerProps, Panel, IFocusTrapZoneProps, mergeStyles, Customizer } from '@fluentui/react'
import { useId, useBoolean } from '@uifabric/react-hooks'
import { ImportAccountPanel } from 'popup/pages/connect/Connect-panel'
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
  importAccount: React.ReactNode
}> = ({ header, button, account, importAccount }) => (
  <div className={classNames('flex flex-col w-full h-full relative bg-white')}>
    <div className={classNames('w-full')}>{header}</div>
    <div className={classNames('w-full')}>{button}</div>
    <div className={classNames('w-full h-full')}>{account}</div>
    <div className={classNames('w-full h-full')}>{importAccount}</div>
  </div>
)

export const AddAccountPanel: React.FC<Props> = ({ isPanelOpen, showPanel, dismissPanel }) => {
  const layerHostId = useId('layerHost')
  const [isPanelOpenImport, { setTrue: showPanelImport, setFalse: dismissPanelImport }] = useBoolean(false)
  const onDismissImport = () => {
    const element = document.querySelector('.connect .ms-Panel') as HTMLElement
    element.style.animation = 'none'
    element.style.animation = 'moveOutBottomImport 0.3s'
    setTimeout(() => {
      element.style.animation = 'moveInBottomImport 0.3s'
      dismissPanelImport()
    }, 180)
  }

  const scopedSettings = useLayerSettings(true, layerHostId)
  return (
    isPanelOpen && (
      <div className={`absolute add-account inset-0 account ${styles.container}`}>
        <Customizer scopedSettings={scopedSettings}>
          <Panel isOpen focusTrapZoneProps={focusTrapZoneProps}>
            <AddAccountContainer
              header={<Header title="Account" icon="ChromeClose" dismissPanel={dismissPanel} />}
              button={<BtnAdd onImportClick={showPanelImport} />}
              account={<AccountList />}
              importAccount={<ImportAccountPanel isPanelOpen={isPanelOpenImport} showPanel={showPanelImport} dismissPanel={onDismissImport} />}
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
