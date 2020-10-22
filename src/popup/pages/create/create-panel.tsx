/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import './create-panel.css'

import React, { useState } from 'react'

import classNames from 'classnames'

import { Customizer, IFocusTrapZoneProps, ILayerProps, LayerHost, mergeStyles, Panel } from '@fluentui/react'
import { useId } from '@uifabric/react-hooks'

import { Button } from 'popup/components/button'
import { useCreateWallet } from 'queries/create-account.mutation'
import { useHistory } from 'react-router-dom'
import { ConfirmPassword, Header, Password, WalletName } from './components'
import styles from './create-panel.module.css'

interface Props {
  isPanelOpen: boolean
  showPanel: () => void
  dismissPanel: () => void
}

const CreateContainer: React.FC<{
  header: React.ReactNode
  password: React.ReactNode
  confirm: React.ReactNode
  btn: React.ReactNode
  name: React.ReactNode
  nameWallet: string
  passwordWallet: string
  confirmPassword: string
}> = ({ header, password, confirm, btn, name, nameWallet, passwordWallet, confirmPassword }) => {
  const [createWallet, status] = useCreateWallet()
  const [isError, setIsError] = React.useState(false)
  const history = useHistory()
  const onCreateBtnClick = React.useCallback(() => {
    if (passwordWallet === confirmPassword) {
      createWallet({ name: nameWallet, password: passwordWallet })
    } else {
      setIsError(true)
    }
  }, [passwordWallet, confirmPassword])

  React.useEffect(() => {
    if (status.isSuccess) {
      history.push('/')
    }
  }, [status.isSuccess])

  return (
    <div className={classNames(`flex flex-col w-full justify-between relative ${styles.createContainer}`)}>
      <div className={classNames('flex flex-col')}>
        <div className={classNames('w-full')}>{header}</div>
        <div className={classNames(`w-full ${styles.item}`)}>{name}</div>
        <div className={classNames(`w-full ${styles.item}`)}>{password}</div>
        <div className={classNames(`w-full ${styles.item}`)}>{confirm}</div>
      </div>
      <div onClick={onCreateBtnClick} className={classNames(`w-full flex ${styles.itemBtn}`)}>
        {btn}
      </div>
    </div>
  )
}
export const CreatePanel: React.FC<Props> = ({ isPanelOpen, showPanel, dismissPanel }) => {
  const layerHostId = useId('layerHost')
  const scopedSettings = useLayerSettings(true, layerHostId)
  const [nameWallet, setNameWallet] = useState('')
  const [passwordWallet, setPasswordWallet] = useState('')
  const [confirmPassword, setConfirmPass] = useState('')
  return (
    isPanelOpen && (
      <div className={`absolute inset-0 create ${styles.container}`}>
        <Customizer scopedSettings={scopedSettings}>
          <Panel isOpen focusTrapZoneProps={focusTrapZoneProps}>
            <CreateContainer
              nameWallet={nameWallet}
              passwordWallet={passwordWallet}
              confirmPassword={confirmPassword}
              header={<Header dismissPanel={dismissPanel} />}
              password={<Password setPasswordWallet={setPasswordWallet} />}
              confirm={<ConfirmPassword setConfirmPass={setConfirmPass} />}
              btn={<Button full>Next</Button>}
              name={<WalletName setName={setNameWallet} />}
            >
              <div>Button password coming soon</div>
            </CreateContainer>
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
