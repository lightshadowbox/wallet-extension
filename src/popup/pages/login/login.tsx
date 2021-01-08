import classNames from 'classnames'
import React from 'react'
import { Button } from 'popup/components/button'
import { Password } from 'popup/pages/create/components/password/password'
import { useUnlockWallet } from 'queries/create-account.mutation'
import { Logo } from '../logo/logo'
import styles from './login-module.css'

const LoginContainer: React.FC<{
  logo: React.ReactNode
  password: React.ReactNode
  btn: React.ReactNode
  passwordInput: string
}> = ({ logo, password, btn, passwordInput }) => {
  const [error, setError] = React.useState('')
  const [unlockWallet] = useUnlockWallet(setError)

  const onHandleLogin = async () => {
    await unlockWallet(passwordInput)
  }
  React.useEffect(() => {
    if (error) {
      setError('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password])
  return (
    <div className={`flex flex-col relative items-center justify-center bg-white p-4 ${styles.login}`}>
      <div className={classNames('w-full h-full')}>{logo}</div>
      <div className={classNames('w-full h-full relative')}>
        {password}
        {error ? <div style={{ color: 'red', fontSize: '12px', position: 'absolute', bottom: '0', left: 0 }}>{error}</div> : null}
      </div>
      <div onClick={onHandleLogin} className={classNames('w-full h-full flex mt-8')}>
        {btn}
      </div>
    </div>
  )
}
export const LoginPage = () => {
  const [passwordWallet, setPasswordWallet] = React.useState('')
  return (
    <LoginContainer
      passwordInput={passwordWallet}
      logo={<Logo welcomeBack />}
      btn={<Button full>Login</Button>}
      password={<Password isHasLabel={false} setPasswordWallet={setPasswordWallet} />}
    >
      <div>Rectangle will coming soon </div>
    </LoginContainer>
  )
}
