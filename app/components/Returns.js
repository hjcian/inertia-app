// @flow
import React, { Component, Fragment, useState } from 'react'
import { Button, Message } from 'semantic-ui-react'

import { dataStore } from '../utils/store'

import PriceForm from './SubComponents/PriceForm'
import PriceFetcher from './SubComponents/PriceFetcher'
import ReturnBar from './Charts/ReturnBar'
import styles from './Returns.css'
import { renderers } from 'callsite-record';

function initSymbolPrices () {
  const { data } = dataStore
  if (data) {
    const symbols = data.getSymbols()
    const prevSymbolPrices = data.currentPrices
    const symbolPrices = prevSymbolPrices.length === 0 ? symbols.map( symbol => { return { symbol, price: '', date: ''} }) : prevSymbolPrices
    return symbolPrices
  }
  return null
}

export default class Returns extends Component {
  state = {
    isFilterNull: null,
    singleReturns: null,
    portfolioReturns: null,
    symbolPrices: initSymbolPrices(),
    prevDate: new Date(),
  }  
  updateReturns = (prices, date) => {
    const { data } = dataStore
    if (data) {
      data.updateCurrentPrice(prices, date)
      this.setState({
        isFilterNull: true,
        singleReturns: data.getDetailReturns(),
        portfolioReturns: data.getAllocationReturns(),
      })      
    }
  }
  priceSyncher = (prices, prevDate) => {
    console.log(`prevDate: ${prevDate}`)
    this.setState({
      symbolPrices: prices,
      prevDate,
    })    
  }
  render() {    
    const { data } = dataStore
    const { symbolPrices, prevDate, singleReturns, portfolioReturns, isFilterNull } = this.state
    console.log(symbolPrices)
    return (
      <div className={styles.returnsBody}>
        <Message>
          <Message.Header>Annualized returns</Message.Header>
          <Message.Content>基於歷史交易資料並取得目前報價，計算投資組合的年化投報率。</Message.Content>
        </Message>
        <div className={styles.priceFetcher}>
          {
            data &&
            <PriceFetcher symbols={data.getSymbols()} priceSyncher={this.priceSyncher} />
          }
        </div>
        <div className={styles.priceForm}>
          { 
            symbolPrices &&
            <PriceForm prices={symbolPrices} prevDate={prevDate} updateReturns={this.updateReturns}/>
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
}
