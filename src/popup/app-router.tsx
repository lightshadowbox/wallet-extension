import React from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { HomePage } from './pages/home/home-page'
import { CreatePage } from './pages/Create/create-page'
import { WelcomePage } from './pages/Welcome/welcome-page'
import { NetworkPage } from './pages/network/network-page'

export const AppRouter = () => {
  return (
    <Router>
      <>
        <Switch>
          <Route path="/">
            <HomePage />
          </Route>
          <Route path="/create" component={CreatePage} />
          <Route path="/welcome" component={WelcomePage} />
          <Route path="/network" component={NetworkPage} />
        </Switch>
      </>
    </Router>
  )
}
