// @flow
import React, { Component, Fragment, useState } from 'react'
import { Button } from 'semantic-ui-react'

import { dataStore } from '../utils/store'

import PriceForm from './SubComponents/PriceForm'
import PriceFetcher from './SubComponents/PriceFetcher'
import ReturnBar from './Charts/ReturnBar'
import styles from './Returns.css'

const Returns = () => {
  const [isFilterNull, setIsFilterNull] = useState(null)
  const { data } = dataStore
  function setCurrentPrices(priceObject, date) {
    console.log('check priceObject:')
    console.log(priceObject)
    if (data) {
      data.updateCurrentPrice(priceObject, date)
      setIsFilterNull(true)
    }
  }

  return (
    <div className={styles.returnsBody}>
      <div className={styles.priceFetcher}>
        {
          data &&
          <PriceFetcher symbols={data.getSymbols()} />
        }
      </div>
      <div className={styles.priceForm}>
        { 
          data &&
          <PriceForm symbols={data.getSymbols()} importCurrentPrices={setCurrentPrices}/>
        }
      </div>
      <div className={styles.returnBars}>
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

export default Returns