import React from 'react'
import { Switch, Route } from 'react-router'
import routes from './constants/routes'
import App from './containers/App'
import HomePage from './containers/HomePage'
import ImportPage from './containers/ImportPage'
import PortfolioPage from './containers/PortfolioPage'
import ReturnsPage from './containers/ReturnsPage'
import RebalancePage from './containers/RebalancePage'

export default () => (
  <App>
    <Switch>
      <Route path={routes.Import} component={ImportPage} />
      <Route path={routes.Portfolio} component={PortfolioPage} />
      <Route path={routes.Returns} component={ReturnsPage} />
      <Route path={routes.Rebalance} component={RebalancePage} />
      <Route path={routes.Home} component={HomePage} />
    </Switch>
  </App>
)
