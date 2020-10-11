import classNames from 'classnames'
import React from 'react'
import { Header, Password, ConfirmPassword, BtnPri } from './components/index'
import styles from './create-page.module.css'

const CreateContainer: React.FC<{
  header: React.ReactNode
  password: React.ReactNode
  confirm: React.ReactNode
  btn: React.ReactNode
}> = ({ header, password, confirm, btn }) => (
  <div className={classNames(`flex flex-col relative items-center ${styles.createContainer}`)}>
    <div className={classNames('w-full h-full')}>{header}</div>
    <div className={classNames('w-full h-full')}>{password}</div>
    <div className={classNames('w-full h-full')}>{confirm}</div>
    <div className={classNames('w-full h-full')}>{btn}</div>
  </div>
)
export const CreatePage = () => (
  <CreateContainer header={<Header />} password={<Password />} confirm={<ConfirmPassword />} btn={<BtnPri />}>
    <div>Button password coming soon</div>
  </CreateContainer>
)
