// @flow
import React, { Component } from 'react'

import Import from '../components/Import'
import routes from '../constants/routes'
import MainVisual from './MainVisual'


export default class ImportPage extends Component {
  render() {
    return (
      <MainVisual mainWin={<Import />} referer={routes.Import}/>
    )
  }
}