import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import { useIsAlreadyHaveWallet } from '../queries/use-is-already-have-wallet'
import { HomePage } from './pages/home/home-page'
import { WelcomePage } from './pages/Welcome/welcome-page'

export const AppRouter = () => {
  const createdWallet = useIsAlreadyHaveWallet()

  if (!createdWallet) {
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
