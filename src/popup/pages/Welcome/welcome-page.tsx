import classNames from 'classnames'
import React from 'react'
import { Logo, RecCreate, RecImport } from './components/index'
import styles from './welcome-page.module.css'

const WelcomeContainer: React.FC<{ logo: React.ReactNode; recCreate: React.ReactNode; recImport: React.ReactNode }> = ({
  logo,
  recCreate,
  recImport,
}) => (
  <div
    className={classNames(
      `flex flex-col relative justify-center items-center p-md bg-white ${styles.welcomeContainer}`,
    )}
  >
    <div className={classNames('w-wl h-hl')}>{logo}</div>
    <div className={classNames('w-wl h-hl')}>{recCreate}</div>
    <div className={classNames('w-wl h-hl')}>{recImport}</div>
  </div>
)
export const WelcomePage = () => {
  return (
    <WelcomeContainer logo={<Logo />} recCreate={<RecCreate />} recImport={<RecImport />}>
      <div>Rectangle will coming soon </div>
    </WelcomeContainer>
  )
}
