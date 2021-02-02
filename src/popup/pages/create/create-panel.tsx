/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import './create-panel.css'

import React, { useState } from 'react'

import classNames from 'classnames'
import { useTheme } from 'popup/services'
import { FaButton, Button } from 'popup/components/button'
import { Customizer, IFocusTrapZoneProps, ILayerProps, LayerHost, mergeStyles, Panel, MessageBar, MessageBarType } from '@fluentui/react'
import { useId } from '@uifabric/react-hooks'

import { useCreateWallet } from 'queries/create-account.mutation'
import { useHistory } from 'react-router-dom'
import { ConfirmPassword, Header, Password, WalletName } from './components'
import styles from './create-panel.module.css'

interface Props {
  isPanelOpen: boolean
  showPanel: () => void
  dismissPanel: () => void
  onNext?: () => void
}
const Guide = (p: any) => {
  const theme = useTheme()
  return (
    <MessageBar onDismiss={p.resetChoice} dismissButtonAriaLabel="Close" messageBarType={MessageBarType.warning}>
      <b>Guide</b>{' '}
      <p>
        If you already have an account, click on <FaButton iconProps={{ iconName: 'MoreVertical' }} iconColor={theme.palette.black} />
        -&gt; Go to Account -&gt; Import to import your existing wallet.
      </p>
    </MessageBar>
  )
}
const CreateContainer: React.FC<{
  header: React.ReactNode
  password: React.ReactNode
  confirmRender: (errMsg: string) => React.ReactNode
  btn: React.ReactNode
  name: React.ReactNode
  nameWallet: string
  passwordWallet: string
  confirmPassword: string
  showPanel?: () => void
  onNext?: () => void
}> = ({ header, password, confirmRender, btn, name, nameWallet, passwordWallet, confirmPassword, onNext }) => {
  const [createWallet, status] = useCreateWallet()
  const [isError, setIsError] = React.useState(false)
  const history = useHistory()
  const onCreateBtnClick = async () => {
    if (nameWallet && passwordWallet) {
      if (passwordWallet.length >= 6) {
        if (passwordWallet === confirmPassword) {
          createWallet({ name: nameWallet, password: passwordWallet })
          localStorage.removeItem('import-account')
        } else {
          setIsError(true)
        }
      } else {
        setIsError(true)
      }
    } else {
      setIsError(true)
    }
  }
  const onHandleKeydown = (e) => {
    if (e.key === 'Enter') {
      onCreateBtnClick()
    }
  }
  React.useEffect(() => {
    if (status.isSuccess) {
      try {
        onNext()
      } catch (e) {
        console.warn('fallback to default navigation')
        history.push('/')
      }
    }
  }, [status.isSuccess, history, onNext])

  return (
    <div onKeyDown={onHandleKeydown} className={classNames(`flex flex-col w-full justify-between relative ${styles.createContainer}`)}>
      <div className={classNames('flex flex-col')}>
        <div className={classNames('w-full')}>{header}</div>
        <div className={classNames(`w-full ${styles.item}`)}>{name}</div>
        <div className={classNames(`w-full ${styles.item}`)}>{password}</div>
        <div className={classNames(`w-full ${styles.item}`)}>{confirmRender(isError ? 'Enter valid all inputs!' : '')}</div>
      </div>
      <div onClick={onCreateBtnClick} className={classNames(`w-full flex flex-col ${styles.itemBtn}`)}>
        {localStorage.getItem('import-account') ? (
          <div className="mb-4">
            <Guide />
          </div>
        ) : null}
        {btn}
      </div>
    </div>
  )
}
export const CreatePanel: React.FC<Props> = ({ isPanelOpen, showPanel, dismissPanel, onNext }) => {
  const layerHostId = useId('layerHost')
  const scopedSettings = useLayerSettings(true, layerHostId)
  const [nameWallet, setNameWallet] = useState('')
  const [passwordWallet, setPasswordWallet] = useState('')
  const [confirmPassword, setConfirmPass] = useState('')
  const renderConfirmPassword = React.useCallback((errMsg: string) => {
    return <ConfirmPassword setConfirmPass={setConfirmPass} errMsg={errMsg} />
  }, [])
  return (
    isPanelOpen && (
      <div className={`absolute inset-0 create ${styles.container}`}>
        <Customizer scopedSettings={scopedSettings}>
          <Panel isOpen focusTrapZoneProps={focusTrapZoneProps}>
            <CreateContainer
              nameWallet={nameWallet}
              passwordWallet={passwordWallet}
              header={<Header dismissPanel={dismissPanel} />}
              password={<Password isHasLabel setPasswordWallet={setPasswordWallet} />}
              confirmRender={renderConfirmPassword}
              confirmPassword={confirmPassword}
              btn={<Button full>Next</Button>}
              name={<WalletName setName={setNameWallet} />}
              onNext={onNext}
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
