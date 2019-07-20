// @flow
import React, { Component, Fragment } from 'react'
import { Message } from 'semantic-ui-react'

import styles from './Home.css'

import Import from './Import'

import { dataStore } from '../utils/store'

type Props = {};

export default class Home extends Component<Props> {
  props: Props;
  state = {
    data: null,
    isFilterNull: null
  }
  importData = (data) => {
    this.setState({ data })
  }
  importCurrentPrices = (priceObject, date) => {
    this.state.data.updateCurrentPrice(priceObject, date)
    this.setState({isFilterNull: true})
  }

  render() {
    const { data: containData, isStored } = dataStore
    const { data, isFilterNull } = this.state
    if (data) {
      data._display()
      dataStore.save(data)
    }
    return (
      <div className={styles.container} data-tid="container">
        <h1>
          Home
        </h1>
      </div>
    )
  }  
}
