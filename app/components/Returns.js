import React, { Component, Fragment } from 'react'
import { Message, Header, Segment } from 'semantic-ui-react'

import { dataStore } from '../utils/store'

import PriceForm from './SubComponents/PriceForm'
import PriceFetcher from './SubComponents/PriceFetcher'
import ReturnBar from './Charts/ReturnBar'
import styles from './Returns.css'

function initSymbolPrices () {
  const { data } = dataStore
  if (data) {
    const symbols = data.getSymbols()
    const prevSymbolPrices = data.currentPrices
    const symbolPrices = prevSymbolPrices.length === 0 ? symbols.map(symbol => { return { symbol, price: '', date: '' } }) : prevSymbolPrices
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
    prevDate: new Date()
  }
  updateReturns = (prices, date) => {
    const { data } = dataStore
    if (data) {
      data.updateCurrentPrice(prices, date)
      this.setState({
        isFilterNull: true,
        singleReturns: data.getDetailReturns(),
        portfolioReturns: data.getAllocationReturns()
      })
    }
  }
  priceSyncher = (prices, prevDate) => {
    console.log(`prevDate: ${prevDate}`)
    this.setState({
      symbolPrices: prices,
      prevDate
    })
  }
  render () {
    const { data } = dataStore
    const { symbolPrices, prevDate, singleReturns, portfolioReturns, isFilterNull } = this.state
    return (
      <div className={styles.returnsBody}>
        <Message>
          <Message.Header>Annualized returns</Message.Header>
          <Message.Content>Calculate your annualized returns of portfolio.</Message.Content>
        </Message>
        <div className={styles.priceFetcher}>
          {
            data &&
            <Segment compact>
              <Header as='h4' size='tiny' color='grey'>
                <Header.Content>Auto Fetch</Header.Content>
                <Header.Subheader>Automatically fetching the latest close prices from finalcial data providers.</Header.Subheader>
              </Header>
              <PriceFetcher symbols={data.getSymbols()} priceSyncher={this.priceSyncher} />
            </Segment>
          }
        </div>
        <div className={styles.priceForm}>
          {
            symbolPrices &&
            <Fragment>
              <Header as='h4' size='tiny' color='grey'>
                <Header.Content>Latest close prices</Header.Content>
                <Header.Subheader>Fill the current prices and corresponding date by Auto Fetch or yourself.</Header.Subheader>
              </Header>
              <PriceForm prices={symbolPrices} prevDate={prevDate} updateReturns={this.updateReturns} />
            </Fragment>
          }
        </div>
        <div className={styles.returnBars}>
          {
            singleReturns && portfolioReturns &&
            <Fragment>
              <Segment className={styles.returnFigure} secondary >
                <Header as='h4' size='tiny' color='grey' textAlign='center'>
                  <Header.Content>Annualized Returns - Symbol(s) vs. Total</Header.Content>
                </Header>
                <ReturnBar data={singleReturns} isFilterNull={isFilterNull} />
              </Segment>
              <Segment className={styles.returnFigure} secondary >
                <Header as='h4' size='tiny' color='grey' textAlign='center'>
                  <Header.Content>Annualized Returns - Stock vs. Bond vs. Total</Header.Content>
                </Header>
                <ReturnBar data={portfolioReturns} isFilterNull={isFilterNull} />
              </Segment>
            </Fragment>
          }
        </div>
      </div>
    )
  }
}
