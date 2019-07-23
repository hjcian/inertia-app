// @flow
import React, { Component } from 'react'

import Home from '../components/Home'
import routes from '../constants/routes'
import MainVisual from './MainVisual'

export default class HomePage extends Component {
  render() {
    return (
      <MainVisual mainWin={<Home />} referer={routes.Home}/>
    )
  }
}
