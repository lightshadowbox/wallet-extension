import React from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useSettingStore } from 'popup/stores/features/settings'

import { HomePage } from './pages/home/home-page'
import { WelcomePage } from './pages/welcome/welcome-page'

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
