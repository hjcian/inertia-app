// @flow
import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import styles from './Counter.css'
import routes from '../constants/routes'

import { dataStore } from '../utils/store'


export default class Temp extends Component<Props> {
  props: Props;
  
  render() {
    const { data, isStored } = dataStore
    return (
      <div>
        <Link to={routes.HOME}>
          <i className="fa fa-arrow-left fa-3x" />
        </Link>
        <div>
          <h1>
            Temp Page
          </h1>
          <Button onClick={()=>{
            console.log('click')
            dataStore.refresh()
          }}>
            Refresh
          </Button>
        </div>
      </div>
    )
  }
}