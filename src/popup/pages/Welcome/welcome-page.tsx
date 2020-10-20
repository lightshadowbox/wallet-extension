import classNames from 'classnames'
import React from 'react'
import { useBoolean } from '@uifabric/react-hooks'
import styles from './welcome-page.module.css'
import { Logo } from '../logo/logo'
import { RecCreate } from '../rec-create/rec-create'
import { RecImport } from '../rec-import/rec-import'
import { CreatePanel } from '../create/create-panel'

const WelcomeContainer: React.FC<{ logo: React.ReactNode; recCreate: React.ReactNode; recImport: React.ReactNode; create: React.ReactNode }> = ({
  logo,
  recCreate,
  recImport,
  create,
}) => (
  <div className={`flex flex-col relative justify-center items-center bg-white ${styles.welcomeContainer}`}>
    <div className={classNames('w-full h-full')}>{logo}</div>
    <div className={classNames('w-full h-full')}>{recCreate}</div>
    <div className={classNames('w-full h-full')}>{recImport}</div>
    <div className={classNames('w-full h-full')}>{create}</div>
  </div>
)
export const WelcomePage = () => {
  const [isPanelOpen, { setTrue: showPanel, setFalse: dismissPanel }] = useBoolean(false)
  return (
    <WelcomeContainer
      logo={<Logo />}
      recCreate={<RecCreate showPanel={showPanel} />}
      recImport={<RecImport />}
      create={<CreatePanel isPanelOpen={isPanelOpen} showPanel={showPanel} dismissPanel={dismissPanel} />}
    >
      <div>Rectangle will coming soon </div>
    </WelcomeContainer>
  )
}
