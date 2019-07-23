// @flow
import React, { Component } from 'react'

import Portfolio from '../components/Portfolio'
import routes from '../constants/routes'
import MainVisual from './MainVisual'

export default class PortfolioPage extends Component {
  render() {
    return (
      <MainVisual mainWin={<Portfolio />} referer={routes.Portfolio} />
    )
  }
}
