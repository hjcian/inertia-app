import React from 'react'
import { Switch, Route } from 'react-router'
import routes from './constants/routes'
import App from './containers/App'
import HomePage from './containers/HomePage'
import CounterPage from './containers/CounterPage'
import ImportPage from './containers/ImportPage'
import TempPage from './containers/TempPage'

export default () => (
  <App>
    <Switch>
      <Route path={routes.a} component={TempPage} />
      <Route path={routes.b} component={TempPage} />
      <Route path={routes.c} component={TempPage} />
      <Route path={routes.IMPORT} component={ImportPage} />
      <Route path={routes.COUNTER} component={CounterPage} />
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
)
