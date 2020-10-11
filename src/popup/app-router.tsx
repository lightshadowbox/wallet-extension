import React from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { HomePage } from './pages/home'
import { WelcomePage } from './pages/Welcome/welcome-page'
import { CreatePage } from './pages/Create/create-page'

export const AppRouter = () => {
  return (
    <Router>
      <>
        <Switch>
          <Route path="/">
            <CreatePage />
          </Route>
          <Route path="/welcome">
            <WelcomePage />
          </Route>
        </Switch>
      </>
    </Router>
  )
}
