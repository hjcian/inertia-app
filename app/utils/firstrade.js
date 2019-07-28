import { remote } from 'electron'
import { Finance } from 'financejs'
const finance = new Finance()

import { stockSet, bondSet } from '../constants/symbols'

export const SymbolIdx = 0
export const QuantityIdx = 1
export const PriceIdx = 2
export const ActionIdx = 3
export const DescriptionIdx = 4
export const TradeDateIdx = 5
export const AmountIdx = 8

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
    this.assetType = getAssetType(this.Symbol)
    this.currentPrice = null
    this.currentDate = null
  }
  add(recordObj) {
    this.Quantity = [...this.Quantity, parseFloat(recordObj['Quantity'])]
    this.Price = [...this.Price, parseFloat(recordObj['Price'])]
    this.Action = [...this.Action, recordObj['Action'].trim().toLowerCase()]
    this.Description = [...this.Description, recordObj['Description']]
    let date = new Date(recordObj['TradeDate'])
    this.TradeDate = [...this.TradeDate, date]
    this.Amount = [...this.Amount, parseFloat(recordObj['Amount'])]
  }
  getQuantity() {
    const totalQuantity = this.Quantity.reduce((a, b) => a + b)
    return totalQuantity
  }
  getInvestHistory() {
    const totalQuantity = this.getQuantity()
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
  getSummary() {
    let summary = {
      symbol: this.Symbol,
      assetType: this.assetType,
      quantity: 0,
      invest: 0,
      reinAmount: 0,
      cost: 0,
    }
    this.Action.forEach((action, idx)=>{
      const quantity = this.Quantity[idx]
      summary.quantity += quantity
      const description = this.Description[idx]
      if (action === 'buy'){
        const invest = this.Price[idx] * quantity
        summary.invest += invest
        summary.cost += invest
      } else if (action === 'other' && quantity > 0 && description.includes(' REIN ')) {
        const amount = Math.abs(this.Amount[idx])
        summary.reinAmount += amount
        summary.cost += amount
      }
    })
    return summary
  }
}

export class FirstradeRecordContainer {
  constructor() {
    this.container = {}
    this.currentPrices = []
  }
  getQuantity(symbol){
    let normSymbol = symbol.trim().toUpperCase()
    if (this.container.hasOwnProperty(normSymbol)) {
      return this.container[normSymbol].getQuantity()
    } else {
      return -1
    }
  }
  updateCurrentPrice(prices, date) {
    this.currentPrices = prices
    prices.forEach( ({symbol, price}) => {
      this.container[symbol].updateCurrentPrice(price, new Date(date))
    })  
  }
  getSymbols() {
    return Object.keys(this.container)
  }
  add(symbol, recordObj) {
    let normSymbol = symbol.trim().toUpperCase()
    if (!this.container.hasOwnProperty(normSymbol)) {    
      this.container[normSymbol] = new FirstradeRecord(normSymbol)
    }
    this.container[normSymbol].add(recordObj)
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
  getSummary() {
    const assetArray = Object.keys(this.container).map( symbol => this.container[symbol].getSummary() )
    return assetArray
  }
  async _display () {
  }
}

export const isCSVFormatValid = (data) => {
  if (
    !data[0].hasOwnProperty("Symbol") ||
    !data[0].hasOwnProperty("Quantity") ||
    !data[0].hasOwnProperty("Price") ||
    !data[0].hasOwnProperty("Action") ||
    !data[0].hasOwnProperty("TradeDate") ||
    !data[0].hasOwnProperty("Amount")
    ) {
    return false
  } else {
    return true
  }
}

export const parseCSV = (data) => {
  let profile = {}
  let firstradeRecordContainer = new FirstradeRecordContainer()
  data.forEach( val => {
    const symbol = val['Symbol'].trim().toUpperCase()
    if (symbol && symbol.length){
      firstradeRecordContainer.add(symbol, val)
    }    
  })
  return firstradeRecordContainer
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