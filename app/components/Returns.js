// @flow
import React, { Component, Fragment, useState } from 'react'
import { Button, Message } from 'semantic-ui-react'

import { dataStore } from '../utils/store'

import PriceForm from './SubComponents/PriceForm'
import PriceFetcher from './SubComponents/PriceFetcher'
import ReturnBar from './Charts/ReturnBar'
import styles from './Returns.css'

const Returns = () => {
  const [isFilterNull, setIsFilterNull] = useState(null)
  const [singleReturns, setSingleReturns] = useState(null)
  const [portfolioReturns, setPortfolioReturns] = useState(null)
  const [symbolPrices, setSymbolPrices] = useState(null) // [{symbol, price, date}, ...]
  const { data } = dataStore
  if (data && !symbolPrices) {
    const symbols = data.getSymbols()
    const prevSymbolPrices = data.currentPrices
    const symbolPrices = prevSymbolPrices.length === 0 ? symbols.map( symbol => { return { symbol, price: '', date: ''} }) : prevSymbolPrices
    setSymbolPrices(symbolPrices)
  }
  function updateReturns(prices) {
    if (data) {
      data.updateCurrentPrice(prices)
      setIsFilterNull(true)
      setSingleReturns(data.getDetailReturns())
      setPortfolioReturns(data.getAllocationReturns())
    }
  }
  function priceSyncher(prices) {
    setSymbolPrices(prices)
  }
  return (
    <div className={styles.returnsBody}>
      <Message>
        <Message.Header>Annualized returns</Message.Header>
        <Message.Content>基於歷史交易資料並取得目前報價，計算投資組合的年化投報率。</Message.Content>
      </Message>
      <div className={styles.priceFetcher}>
        {
          data &&
          <PriceFetcher symbols={data.getSymbols()} priceSyncher={priceSyncher} />
        }
      </div>
      <div className={styles.priceForm}>
        { 
          symbolPrices &&
          <PriceForm prices={symbolPrices} updateReturns={updateReturns}/>
        }
      </div>
      <div className={styles.returnBars}>
        {
          singleReturns && portfolioReturns && 
          <Fragment>
            <ReturnBar data={singleReturns} isFilterNull={isFilterNull}/>
            <ReturnBar data={portfolioReturns} isFilterNull={isFilterNull}/>
          </Fragment>
        }
      </div>
    </div>
  )
}

export default Returns