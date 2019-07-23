// @flow
import React, { Component } from 'react'

import Returns from '../components/Returns'
import routes from '../constants/routes'
import MainVisual from './MainVisual'

export default class ReturnsPage extends Component {
  render() {
    return (
      <MainVisual mainWin={<Returns />} referer={routes.Returns} />
    )
  }
}
