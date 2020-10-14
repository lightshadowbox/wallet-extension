import classNames from 'classnames'
import React from 'react'
import { Button } from '../../components/button/index'
import { Header, Password, ConfirmPassword } from './components/index'
import styles from './create-page.module.css'

const CreateContainer: React.FC<{
  header: React.ReactNode
  password: React.ReactNode
  confirm: React.ReactNode
  btn: React.ReactNode
}> = ({ header, password, confirm, btn }) => (
  <div className={classNames(`flex flex-col w-full justify-between relative ${styles.createContainer}`)}>
    <div className={classNames('flex flex-col')}>
      <div className={classNames('w-full')}>{header}</div>
      <div className={classNames('w-full')}>{password}</div>
      <div className={classNames('w-full')}>{confirm}</div>
    </div>
    <div className={classNames('w-full flex')}>{btn}</div>
  </div>
)
export const CreatePage = () => (
  <CreateContainer
    header={<Header />}
    password={<Password />}
    confirm={<ConfirmPassword />}
    btn={<Button full>Next</Button>}>
    <div>Button password coming soon</div>
  </CreateContainer>
)
