import React from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
<<<<<<< HEAD
=======
import { useSettingStore } from 'popup/stores/features/settings'
>>>>>>> 82563d3b1573101e03212d789e948d7fee8e98ec

import { HomePage } from './pages/home/home-page'
import { WelcomePage } from './pages/Welcome/welcome-page'
// import { AddAccountPanel } from './pages/home/components/add-account/add-account-panel'

export const AppRouter = () => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)

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
