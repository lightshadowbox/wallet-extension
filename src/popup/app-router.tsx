import React from 'react'
import { useRequestTrade } from 'queries/create-account.mutation'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useSettingStore } from 'popup/stores/features/settings'
import { HomePage } from './pages/home/home-page'
import { WelcomePage } from './pages/Welcome/welcome-page'
import { LoginPage } from './pages/login/login'

export const AppRouter = () => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  const [message, setMessage] = React.useState({
    message: '',
    name: '',
  })
  const [requestTrade] = useRequestTrade(setMessage)
  const isLogout = localStorage.getItem('isLogout')
  const [isModalConnectOpen, setIsModalConnectOpen] = React.useState(false)
  const [isAcceptConnect, setIsAcceptConnect] = React.useState(null)
  const [isLoadingTrade, setIsLoadingTrade] = React.useState(false)
  const [accountTrade, setAccountTrade] = React.useState({
    accountName: '',
  })
  const onDismissPanelBottom = () => {
    const element = document.querySelector('.trading-connect-modal') as HTMLElement
    element.style.animation = 'none'
    element.style.animationDelay = 'none'
    element.style.animation = 'moveOutBottom 0.3s'
    setTimeout(() => {
      element.style.animation = 'moveInBottom 0.3s'
      setIsModalConnectOpen(false)
    }, 200)
  }
  const onResponseFailed = (request, sender, sendResponse) => {
    if (request.title === 'request_connect_wallet') {
      sendResponse({
        status: 'failed',
        title: 'response_connect_wallet',
        data: 'not_login_yet',
      })
    }
    if (request.title === 'request_swap_token') {
      sendResponse({
        status: 'failed',
        title: 'response_swap_token',
        data: '',
      })
    }
    chrome.runtime.onMessageExternal.removeListener(onResponseFailed)
  }
  const onResponseSuccess = async (request, sender, sendResponse) => {
    if (request.title === 'request_connect_wallet') {
      if (isAcceptConnect === true) {
        setIsModalConnectOpen(false)
        sendResponse({
          status: 'successfully',
          title: 'response_connect_wallet',
          data: accountTrade,
        })
        return setTimeout(() => {
          window.close()
        }, 300)
      }
      if (isAcceptConnect === null) {
        setIsModalConnectOpen(true)
        sendResponse({
          status: 'waiting',
          title: 'response_connect_wallet',
          data: '',
        })
      } else {
        setIsModalConnectOpen(false)
        sendResponse({
          status: 'failed',
          title: 'response_connect_wallet',
          data: 'refuse_accept',
        })
        return setTimeout(() => {
          window.close()
        }, 300)
      }
    }
    if (request.title === 'request_swap_token') {
      setIsLoadingTrade(true)
      const history = await requestTrade(request.data)
      if (history) {
        sendResponse({
          status: 'successfully',
          title: 'response_swap_token',
          data: history,
        })
      } else {
        sendResponse({
          status: 'failed',
          title: 'response_swap_token',
          data: 'Trade failed',
        })
      }
      setIsLoadingTrade(false)
    }
    chrome.runtime.onMessageExternal.removeListener(onResponseSuccess)
    // return window.close()
  }
  React.useEffect(() => {
    if (selectedAccount) {
      chrome.runtime.onMessageExternal.addListener(onResponseSuccess)
    } else {
      chrome.runtime.onMessageExternal.addListener(onResponseFailed)
    }
  }, [selectedAccount, isAcceptConnect])
  if (!selectedAccount && isLogout) {
    return (
      <Router>
        <>
          <Switch>
            <Route component={LoginPage} />
          </Switch>
        </>
      </Router>
    )
  }
  if (!selectedAccount) {
    return (
      <Router>
        <>
          <Switch>
            <Route component={WelcomePage} />
          </Switch>
        </>
      </Router>
    )
  }

  return (
    <Router>
      <>
        <Switch>
          <Route>
            <HomePage
              accountTrade={accountTrade}
              setAccountTrade={setAccountTrade}
              message={message}
              setMessage={setMessage}
              isModalConnectOpen={isModalConnectOpen}
              setIsModalConnectOpen={setIsModalConnectOpen}
              setIsAcceptConnect={setIsAcceptConnect}
              onDismissModal={onDismissPanelBottom}
              isLoadingTrade={isLoadingTrade}
            />
          </Route>
        </Switch>
      </>
    </Router>
  )
}
