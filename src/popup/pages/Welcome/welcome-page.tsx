import classNames from 'classnames'
import { useHistory } from 'react-router-dom'
import React, { useState } from 'react'
import { useBoolean } from '@uifabric/react-hooks'
import { ImportAccountPanel } from 'popup/pages/import-account/Connect-panel'
import styles from './welcome-page.module.css'
import { Logo } from '../logo/logo'
import { RecCreate } from '../rec-create/rec-create'
import { RecImport } from '../rec-import/rec-import'
import { CreatePanel } from '../create/create-panel'
import { Terms } from '../create/components/terms/terms'

const WelcomeContainer: React.FC<{
  logo: React.ReactNode
  recCreate: React.ReactNode
  recImport: React.ReactNode
  create: React.ReactNode
  importAccount: React.ReactNode
  terms: React.ReactNode
}> = ({ logo, recCreate, recImport, create, importAccount, terms }) => (
  <div className={`flex flex-col relative justify-center items-center bg-white ${styles.welcomeContainer}`}>
    <div className={classNames('w-full h-full')}>{logo}</div>
    <div className={classNames('w-full h-full')}>{recCreate}</div>
    <div className={classNames('w-full h-full')}>{recImport}</div>
    <div className={classNames('w-full h-full')}>{create}</div>
    <div className={classNames('w-full h-full')}>{importAccount}</div>
    <div className={classNames('w-full h-full text-center')}>{terms}</div>
  </div>
)
export const WelcomePage = () => {
  const history = useHistory()
  const [onNext, setOnNext] = useState<() => void>(() => {})
  const [isPanelOpenCreate, { setTrue: showPanelCreate, setFalse: dismissPanelCreate }] = useBoolean(false)
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

  const onNextCreate = () => {
    showPanelCreate()
    setOnNext(() => history.push.bind(null, '/'))
  }

  const onNextImport = () => {
    showPanelCreate()
    setOnNext(() => history.push.bind(null, '/'))
  }

  return (
    <WelcomeContainer
      logo={<Logo welcomeBack={false} />}
      recCreate={<RecCreate showPanel={onNextCreate} />}
      recImport={<RecImport showPanel={onNextImport} />}
      importAccount={<ImportAccountPanel isPanelOpen={isPanelOpenImport} showPanel={showPanelImport} dismissPanel={onDismissImport} />}
      create={<CreatePanel isPanelOpen={isPanelOpenCreate} showPanel={showPanelCreate} dismissPanel={dismissPanelCreate} onNext={onNext} />}
      terms={<Terms />}
    >
      <div>Rectangle will coming soon </div>
    </WelcomeContainer>
  )
}
