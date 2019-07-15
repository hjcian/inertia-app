import { remote } from 'electron'
import { Finance } from 'financejs'
const finance = new Finance()
// import { XIRR } from './finance'

import { stockSet, bondSet } from '../constants/symbols'
import { parse } from 'postcss';
import { fetchLatestClosePrice } from './fetcher'

export const SymbolIdx = 0
export const QuantityIdx = 1
export const PriceIdx = 2
export const ActionIdx = 3
export const DescriptionIdx = 4
export const TradeDateIdx = 5
export const AmountIdx = 8

// const validActions = {
//   action: [
//     'other',
//     'buy',
//     'interest',
//     'dividend'
//   ],
//   recordtype: [
//     'financial',
//     'trade'
//   ]
// }
// [
// "Symbol", 0  "            ",
// "Quantity", 1  "0.00",
// "Price", 2  "",
// "Action", 3  "Other",
// "Description", 4  "Wire Funds Received            ABA-026009593 BK AMER NYC      180327422566                                                                                                                                              ",
// "TradeDate", 5  "2018-03-27",
// "SettledDate", 6  "2018-03-27",
// "Interest", 7  "0.00",
// "Amount", 8  "3972.00",
// "Commission", 9  "0.00",
// "Fee", 10  "0.00",
// "CUSIP", 11  "         ",
// "RecordType" 12  "Financial"
// ]
const getAssetType = (symbol) => {
  return stockSet.has(symbol) ? 'stock' : bondSet.has(symbol) ? 'bond' : 'unknown'
}

class FirstradeRecord {
  constructor(symbol){
    this.Symbol = symbol.trim().toUpperCase()
    this.Quantity = []
    this.Price = []
    this.Action = []
    this.Description = []
    this.TradeDate = []
    this.Amount = []
    this.currentPrice = null
    this.currentDate = null
  }
  add(recordArray) {
    this.Quantity = [...this.Quantity, parseFloat(recordArray[QuantityIdx])]
    this.Price = [...this.Price, parseFloat(recordArray[PriceIdx])]
    this.Action = [...this.Action, recordArray[ActionIdx].trim().toLowerCase()]
    this.Description = [...this.Description, recordArray[DescriptionIdx]]
    let date = new Date(recordArray[TradeDateIdx])
    this.TradeDate = [...this.TradeDate, date]
    this.Amount = [...this.Amount, parseFloat(recordArray[AmountIdx])]
  }
  getInvestHistory() {
    const totalQuantity = this.Quantity.reduce((a, b) => a + b)
    let amounts = []
    let dates = []
    for (let i = 0; i < this.Quantity.length; ++i) {
      if (this.Action[i] === 'buy' || this.Action[i] === 'other'){
        amounts = [...amounts, this.Amount[i]]
        dates = [...dates, this.TradeDate[i]]
      }
    }
    return { amounts, dates, totalQuantity }
  }
  updateCurrentPrice(priceStr, date) {    
    const price = parseFloat(priceStr)
    if (price) {
      this.currentPrice = price
      this.currentDate = date
    } else {
      this.currentPrice = null
      this.currentDate = null
    }    
  }
  getCashFlow() {
    let cashAmounts = []
    let cashDates = []
    if (this.currentPrice !== null && this.currentDate !== null) {
      const { amounts, dates, totalQuantity } = this.getInvestHistory()
      cashAmounts = [...amounts, totalQuantity * this.currentPrice]
      cashDates = [...dates, this.currentDate]
    }
    return { cashAmounts, cashDates }
  }
  calcAnnualReturn() {
    try {
      const { cashAmounts, cashDates } = this.getCashFlow()      
      const xirr = finance.XIRR(cashAmounts, cashDates, 0)
      return xirr
    } catch (error) {
      return null
    }
  }
}

export class FirstradeRecordContainer {
  constructor() {
    this.container = {}
  }
  updateCurrentPrice(prices, date) {
    Object.keys(prices).forEach( symbol => {
      let curPrice = prices[symbol]      
      this.container[symbol].updateCurrentPrice(curPrice, date)
    })
    Object.keys(prices).forEach( symbol => {
      let curPrice = prices[symbol]
    })      
  }
  getSymbols() {
    return Object.keys(this.container)
  }
  add(symbol, recordArray) {
    let normSymbol = symbol.trim().toUpperCase()
    if (!this.container.hasOwnProperty(normSymbol)) {    
      this.container[normSymbol] = new FirstradeRecord(normSymbol)
    }
    this.container[normSymbol].add(recordArray)
  }
  getDetailReturns() {
    let totalCashAmounts = []
    let totalCashDates = []
    let data = Object.keys(this.container).map( (symbol) => {
      const symbolObj = this.container[symbol]
      const { cashAmounts, cashDates } = symbolObj.getCashFlow()
      totalCashAmounts = [...totalCashAmounts, ...cashAmounts]
      totalCashDates = [...totalCashDates, ...cashDates]
      const xirr = symbolObj.calcAnnualReturn()      
      return { name: symbol, return: xirr }      
    })
    const totalXIRR = totalCashAmounts.length ? finance.XIRR(totalCashAmounts, totalCashDates, 0) : null
    data.push({
      name: 'TOTAL',
      return: totalXIRR
    })
    return data
  }
  _getAssetSwitcher (assetType) {
    if (assetType === 'stock') {
      return value => stockSet.has(value)
    } else if (assetType === 'bond') {
      return value => bondSet.has(value)
    } else {
      return value => (!stockSet.has(value) && !bondSet.has(value)) ? true : false
    }
  }
  getAssetReturns(assetType='stock') {
    const isThisAsset = this._getAssetSwitcher(assetType)
    let retCashAmounts = []
    let retCashDates = []
    Object.keys(this.container).forEach( (symbol) => {
      if (isThisAsset(symbol)) {
        const symbolObj = this.container[symbol]
        const { cashAmounts, cashDates } = symbolObj.getCashFlow()
        retCashAmounts = [...retCashAmounts, ...cashAmounts]
        retCashDates = [...retCashDates, ...cashDates]
      }      
    })
    const retXIRR = retCashAmounts.length ? finance.XIRR(retCashAmounts, retCashDates, 0): null
    return { retCashAmounts, retCashDates, retXIRR }
  }
  getAllocationReturns() {
    const { 
      retCashAmounts: stockAmounts, 
      retCashDates: stockDates,
      retXIRR: stockReturns,
    } = this.getAssetReturns('stock')
    const { 
      retCashAmounts: bondAmounts, 
      retCashDates: bondDates,
      retXIRR: bondReturns,
     } = this.getAssetReturns('bond')
    const { 
      retCashAmounts: uncateAmounts, 
      retCashDates: uncateDates,
      retXIRR: uncateReturns,
    } = this.getAssetReturns('uncate')
    const totalAmouns = [...stockAmounts, ...bondAmounts, ...uncateAmounts]
    const totalDates = [...stockDates, ...bondDates, ...uncateDates]
    const totalXIRR = totalAmouns.length ? finance.XIRR(totalAmouns, totalDates, 0): null
    return [
      { name: 'STOCK', return: stockReturns, },
      { name: 'BOND', return: bondReturns, },
      { name: 'UNCAT', return: uncateReturns, },
      { name: 'TOTAL', return: totalXIRR, },
    ]
  }
  async _display () {
    const results  = await fetchLatestClosePrice("VT")
    console.log(JSON.stringify(results, null, 4))
  }
}

export const isCSVFormatValid = (data) => {
  if (
    data[0].indexOf('Symbol') !== SymbolIdx ||
    data[0].indexOf('Quantity') !== QuantityIdx ||
    data[0].indexOf('Price') !== PriceIdx ||
    data[0].indexOf('Action') !== ActionIdx ||
    data[0].indexOf('TradeDate') !== TradeDateIdx ||
    data[0].indexOf('Amount') !== AmountIdx
  ) {
    return false
  } else {
    return true
  }
}

export const parseCSV = (data) => {
  let profile = {}
  let firstradeRecordContainer = new FirstradeRecordContainer()
  data.forEach( (element, idx) => {
    if (idx > 0 && element.length > 1 ) {
      const action = element[ActionIdx].toLowerCase()
      const quantity = parseFloat(element[QuantityIdx])
      const description = element[DescriptionIdx]
      const symbol = element[SymbolIdx].trim().toUpperCase()
      if (symbol.length){
        firstradeRecordContainer.add(symbol, element)
      }
      if (action === 'buy'){
        const price = parseFloat(element[PriceIdx])
        const invest = price * quantity
        if (!profile.hasOwnProperty(symbol)) {            
          profile[symbol] = {
            invest,
            quantity,
            reinAmount: 0,
            cost: invest,
            assetType: stockSet.has(symbol) ? 'stock' : bondSet.has(symbol) ? 'bond' : 'unknown'
          }          
        } else {
          profile[symbol].invest += invest
          profile[symbol].quantity += quantity
          profile[symbol].cost += invest
        }
      } else if (action === 'other' && quantity > 0 && description.includes(' REIN ')) {
        const reinAmount = Math.abs(parseFloat(element[AmountIdx]))
        profile[symbol].reinAmount += reinAmount
        profile[symbol].cost += reinAmount
      }
    }
  })
  const assetArray = Object.keys(profile).map( symbol => {
    return {
      symbol,
      ...profile[symbol]
    }
  })
  return { assetArray, firstradeRecordContainer }
}


export const computeTotalAmount = (data) => {
  let totalAmount = 0
  data.forEach((element, idx) => {        
      if (idx > 0 && element.length > 1) {            
        totalAmount += parseFloat(element[AmountIdx])          
      }
    })
  return totalAmount
}