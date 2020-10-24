/* eslint-disable import/order */
import classNames from 'classnames'
import React from 'react'
import { useId } from '@uifabric/react-hooks'
import { LayerHost, ILayerProps, Panel, IFocusTrapZoneProps, mergeStyles, Customizer } from '@fluentui/react'
import { Header, QRCam, Account } from './components/index'
import './Connect-panel.css'
import styles from './Connect-panel.module.css'
import { useSettingStore } from 'popup/stores/features/settings'

interface Props {
  isPanelOpen: boolean
  showPanel: () => void
  dismissPanel: () => void
}

const ConnectContainer: React.FC<{
  header: React.ReactNode
  qrCam: React.ReactNode
  account: React.ReactNode
}> = ({ header, qrCam, account }) => (
  <div className={classNames('flex flex-col relative h-full bg-white')}>
    <div className={classNames('w-full')}>{header}</div>
    <div className={classNames('w-full mt-2 mb-4')}>{qrCam}</div>
    <div className={classNames('w-full h-full p-4')}>{account}</div>
  </div>
)
export const ImportAccountPanel: React.FC<Props> = ({ isPanelOpen, showPanel, dismissPanel }) => {
  const layerHostId = useId('layerHost')
  const [privateKey, setPrivateKey] = React.useState('')
  const [accountName, setAccountName] = React.useState('')
  const scopedSettings = useLayerSettings(true, layerHostId)
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  return (
    isPanelOpen &&
    selectedAccount && (
      <div className={`connect ${styles.container}`}>
        <Customizer scopedSettings={scopedSettings}>
          <Panel isOpen focusTrapZoneProps={focusTrapZoneProps}>
            <ConnectContainer
              header={<Header title="Add Account" icon="ChromeClose" dismissPanel={dismissPanel} />}
              qrCam={<QRCam onHaveValue={(value) => setPrivateKey(value)} />}
              account={
                <Account
                  privateKey={privateKey}
                  accountName={accountName}
                  setPrivateKey={setPrivateKey}
                  setAccountName={setAccountName}
                  closePopup={dismissPanel}
                />
              }
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
