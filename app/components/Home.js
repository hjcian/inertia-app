// @flow
import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import routes from '../constants/routes'
import styles from './Home.css'


import Import from './Import'
import PriceForm from './PriceForm'
import ReturnBar from './ReturnBar'

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
    console.log(isStored)
    console.log(containData)
    
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
        <div className={styles.upper}>
          <Import importData={this.importData}/>
        </div>
        <div className={styles.buttom}>
          {
            data &&
            <PriceForm symbols={data.getSymbols()} importCurrentPrices={this.importCurrentPrices}/>
          }
          {
            data && 
            <Fragment>
              <ReturnBar data={data.getDetailReturns()} isFilterNull={isFilterNull}/>
              <ReturnBar data={data.getAllocationReturns()} isFilterNull={isFilterNull}/>
            </Fragment>
          }
        </div>
      </div>
    )
  }  
}
