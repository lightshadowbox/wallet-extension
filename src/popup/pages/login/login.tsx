import classNames from 'classnames'
import React from 'react'
import { MessageBar, MessageBarType } from '@fluentui/react'
import { Button } from 'popup/components'
import { Password } from 'popup/pages/create/components/password/password'
import { useUnlockWallet } from 'queries/create-account.mutation'
import { Logo } from '../logo/logo'
import styles from './login-module.css'

const WarningForgotPassword = (p: any) => (
  <MessageBar messageBarType={MessageBarType.warning} isMultiline={false} onDismiss={p.resetChoice} dismissButtonAriaLabel="Close">
    Check your downloaded txt file for the passcode.
  </MessageBar>
)
const LoginContainer: React.FC<{
  logo: React.ReactNode
  password: React.ReactNode
  btn: React.ReactNode
  passwordInput: string
}> = ({ logo, password, btn, passwordInput }) => {
  const [error, setError] = React.useState('')
  const [unlockWallet] = useUnlockWallet(setError)
  const [isForgotPassword, setIsForgotPassword] = React.useState(false)
  const onHandleForgotPassword = () => {
    setIsForgotPassword(true)
  }
  const onHandleLogin = async () => {
    await unlockWallet(passwordInput)
  }
  const onHandleKeydown = (e) => {
    if (e.key === 'Enter') {
      onHandleLogin()
    }
  }
  React.useEffect(() => {
    if (error) {
      setError('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password])
  return (
    <div onKeyDown={onHandleKeydown} className={`flex flex-col relative items-center justify-center login-container bg-white p-4 ${styles.login}`}>
      <div className={classNames('w-full h-full')}>{logo}</div>
      <div className={classNames('w-full h-full relative')}>
        {password}
        {error ? <div style={{ color: 'red', fontSize: '12px', position: 'absolute', bottom: '0', left: 0 }}>{error}</div> : null}
      </div>

      <div className={classNames('w-full flex flex-row justify-end text-xs')}>
        <i onClick={onHandleForgotPassword} className="m-0 cursor-pointer">
          Forgot your password?
        </i>
      </div>
      <div onClick={onHandleLogin} className={classNames('w-full h-full flex mt-4')}>
        {btn}
      </div>
      <div className={classNames('w-full mt-4')}>{isForgotPassword ? <WarningForgotPassword /> : null}</div>
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
