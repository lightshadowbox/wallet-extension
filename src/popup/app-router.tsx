import React from 'react'
import { useRequestTrade } from 'queries/create-account.mutation'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useSettingStore } from 'popup/stores/features/settings'
import { useGetPairsData, USDT, PRV } from 'services/trading/fee/pairsData'
import { estimateFeeTrade } from 'services/trading/fee/fee'
import { HomePage } from './pages/home/home-page'
import { WelcomePage } from './pages/Welcome/welcome-page'
import { LoginPage } from './pages/login/login'

export const AppRouter = () => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  const [requestTrade, status] = useRequestTrade()
  const isLogout = localStorage.getItem('isLogout')
  const { data, isSuccess } = useGetPairsData()
  const onResponseFailed = (request, sender, sendResponse) => {
    if (request.title === 'request_connect_wallet') {
      sendResponse({
        status: 'failed',
        title: 'reponse_connect_wallet',
        data: '',
      })
    } else if (request.title === 'request_swap_token') {
      console.log('rq data', request.data)
      sendResponse({
        status: 'failed',
        title: 'response_swap_token',
        data: '',
      })
    }
    // return window.close()
  }
  const onResponseSuccess = async (request, sender, sendResponse) => {
    if (request.title === 'request_connect_wallet') {
      sendResponse({
        status: 'successfully',
        title: 'reponse_connect_wallet',
        data: '',
      })
      return window.close()
    }
    if (request.title === 'request_swap_token') {
      const history = await requestTrade(request.data)
      console.log(history, request.data)
      if (history) {
        return sendResponse({
          status: 'successfully',
          title: 'response_swap_token',
          data: history,
        })
      }
      return sendResponse({
        status: 'failed',
        title: 'response_swap_token',
        data: 'Trade failed',
      })
    }
    // return window.close()
  }
  React.useEffect(() => {
    if (selectedAccount) {
      chrome.runtime.onMessageExternal.removeListener(onResponseFailed)
      chrome.runtime.onMessageExternal.addListener(onResponseSuccess)
    } else {
      chrome.runtime.onMessageExternal.removeListener(onResponseSuccess)
      chrome.runtime.onMessageExternal.addListener(onResponseFailed)
    }
  }, [selectedAccount])
  React.useEffect(() => {
    if (isSuccess) {
      const fee = estimateFeeTrade({
        pairs: data.pairs,
        inputToken: USDT,
        outputToken: PRV,
      })
      console.log('fee', fee)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])
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
          <Route component={HomePage} />
        </Switch>
      </>
    </Router>
  )
}
