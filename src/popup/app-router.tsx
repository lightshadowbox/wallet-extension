import React from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { HomePage } from './pages/home/home-page'

export const AppRouter = () => {
  return (
    <Router>
      <>
        <Switch>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </>
    </Router>
  )
}
