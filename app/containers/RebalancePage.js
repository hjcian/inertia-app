// @flow
import React, { Component } from 'react'

import Rebalance from '../components/Rebalance'
import routes from '../constants/routes'
import MainVisual from './MainVisual'


export default class RebalancePage extends Component {
  render() {
    return (
      <MainVisual mainWin={<Rebalance />} referer={routes.Rebalance} />
    )
  }
}
