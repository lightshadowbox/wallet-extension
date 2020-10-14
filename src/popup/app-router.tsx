import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import { useIsAlreadyHaveWallet } from '../queries/use-is-already-have-wallet'
import { AddTokenPage } from './pages/add-token/add-token-page'
import { CreatePage } from './pages/Create/create-page'
import { HomePage } from './pages/home/home-page'
import { NetworkPage } from './pages/network/network-page'
import { WelcomePage } from './pages/Welcome/welcome-page'

export const AppRouter = () => {
  const createdWallet = useIsAlreadyHaveWallet()

  if (!createdWallet) {
    return (
      <Router>
        <>
          <Switch>
            <Route path="/create" component={CreatePage} />
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
          <Route path="/welcome" component={WelcomePage} />
          <Route path="/network" component={NetworkPage} />
          <Route path="/addtoken" component={AddTokenPage} />
          <Route component={HomePage} />
        </Switch>
      </>
    </Router>
  )
}
