import React from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { HomePage } from './pages/home/home-page'
import { CreatePage } from './pages/Create/create-page'
import { WelcomePage } from './pages/Welcome/welcome-page'
import { NetworkPage } from './pages/network/network-page'
import { AddTokenPage } from './pages/add-token/add-token-page'

export const AppRouter = () => {
  return (
    <Router>
      <>
        <Switch>
          <Route path="/home" component={HomePage} />
          <Route path="/create" component={CreatePage} />
          <Route path="/welcome" component={WelcomePage} />
          <Route path="/network" component={NetworkPage} />
          <Route path="/addtoken" component={AddTokenPage} />
        </Switch>
      </>
    </Router>
  )
}
