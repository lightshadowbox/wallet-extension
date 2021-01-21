import React from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useSettingStore } from 'popup/stores/features/settings'
import { useGetPairsData, USDT, PRV } from 'services/trading/fee/pairsData'
import { estimateFeeTrade } from 'services/trading/fee/fee'
import { HomePage } from './pages/home/home-page'
import { WelcomePage } from './pages/Welcome/welcome-page'
import { ImportPage } from './pages/import/import-page'
import { LoginPage } from './pages/login/login'

export const AppRouter = () => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  const isLogout = localStorage.getItem('isLogout')
  const { data, isSuccess } = useGetPairsData()
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
          <Route exact path="/import" component={ImportPage} />
          <Route component={HomePage} />
        </Switch>
      </>
    </Router>
  )
}
