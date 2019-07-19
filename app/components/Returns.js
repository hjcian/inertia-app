// @flow
import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import styles from './Counter.css'
import routes from '../constants/routes'

import { dataStore } from '../utils/store'


export default class Returns extends Component<Props> {
  props: Props;
  
  render() {
    return (
      <div>
        <h1>
          Returns
        </h1>        
      </div>
    )
  }
}