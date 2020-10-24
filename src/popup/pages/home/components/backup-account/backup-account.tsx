import classNames from 'classnames'
import React from 'react'
import { LayerHost, ILayerProps, Panel, IFocusTrapZoneProps, mergeStyles, Customizer } from '@fluentui/react'
import { useId } from '@uifabric/react-hooks'
import { Button } from 'popup/components/button'
import { downloadAccountBackup } from 'services/wallet'
import { useGetAccount } from 'queries/account.queries'
import styles from './backup-account.module.css'
import './backup-account.css'
import { Header, ListData, SelectAccount } from './components/index'

interface Props {
  isPanelOpen: boolean
  showPanel: () => void
  dismissPanel: () => void
}
const BackupAccountContainer: React.FC<{
  header: React.ReactNode
  selectAccount: React.ReactNode
  list: React.ReactNode
  btn: React.ReactNode
}> = ({ header, selectAccount, list, btn }) => (
  <div className={classNames('flex flex-col relative h-full justify-center items-center p-md bg-white')}>
    <div className={classNames('w-full')}>{header}</div>
    <div className={classNames('w-full pl-4 pr-4')}>{selectAccount}</div>
    <div className={classNames('w-full')}>{list}</div>
    <div className={classNames('w-full h-full flex flex-col pl-4 pr-4 justify-end items-center pb-4')}>{btn}</div>
  </div>
)
export const BackupAccountPanel: React.FC<Props> = ({ isPanelOpen, showPanel, dismissPanel }) => {
  const layerHostId = useId('layerHost')
  const scopedSettings = useLayerSettings(true, layerHostId)
  const { data: account, isSuccess } = useGetAccount()
  const onDownloadClick = React.useCallback(() => {
    if (isSuccess) {
      downloadAccountBackup(account.name)
      setTimeout(() => {
        dismissPanel()
      }, 500)
    }
  }, [isSuccess])
  return (
    isPanelOpen && (
      <div className={`absolute inset-0 backupAccount ${styles.container}`}>
        <Customizer scopedSettings={scopedSettings}>
          <Panel isOpen focusTrapZoneProps={focusTrapZoneProps}>
            <BackupAccountContainer
              btn={
                <Button onClick={onDownloadClick} iconProps={{ iconName: 'Download' }}>
                  Download as zip
                </Button>
              }
              header={<Header title="Backup" icon="ChromeClose" dismissPanel={dismissPanel} />}
              selectAccount={<SelectAccount />}
              list={<ListData />}
            >
              <div>Body will coming soon </div>
            </BackupAccountContainer>
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
