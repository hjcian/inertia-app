import React, { Component } from 'react'
import { Input, Message, Checkbox, Label, Button, Icon } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDollarSign,
  faFunnelDollar,
  faHandHoldingUsd,
  faDonate,
}
from '@fortawesome/free-solid-svg-icons'

import { calcAssetIncrement, calcQuantity } from '../utils/formula'
import { formatMoney } from '../utils/stringFormatter'
import { dataStore } from '../utils/store'
import AdjustBar from './SubComponents/AdjustBar'
import styles from './Rebalance.css'
import { parse } from 'semver';

export default class Rebalance extends Component {
  state = {
    capitalInput: 3000,
    capitalInputError: true,
    dataArray: [
      "VT",
      "BWX",
      "BND",
    ],
    dataDict: {
      "VT": {
        price: 50,
        quantity: 100,
        checked: true,
        targetRatio: null,
      },
      "BWX": {
        price: 20,
        quantity: 40,
        checked: true,
        targetRatio: null,
      },
      "BND": {
        price: 40,
        quantity: 30,
        checked: true,
        targetRatio: null,
      }
    }
  }
  _getAmountsAndTotal (dataArray) {
    let total = 0
    let amounts = []
    dataArray.forEach( (symbol) => {
      const { price, quantity, checked } = this.state.dataDict[symbol]
      const amount = price * quantity
      total += checked ? amount : 0
      amounts = [...amounts, amount]
    })
    return {total, amounts}
  }
  _adjustQuantityAndAmount (amount, total, quantity, price, tempTargetRatio, capitalInput) {
    if (isNaN(parseFloat(tempTargetRatio))){
      return {quantityIncrement:'-', adjustedQuantity: '-', adjustedAmount: '-'}
    } else {
      const assetInc = calcAssetIncrement(amount, total, tempTargetRatio/100, capitalInput)
      const quantityIncrement = calcQuantity(assetInc, price)
      const adjustedQuantity = quantity + quantityIncrement
      const adjustedAmount = adjustedQuantity * price
      return {quantityIncrement, adjustedQuantity, adjustedAmount}
    }
  }
  computeAndExtend (dataArray) {
    const {total, amounts} = this._getAmountsAndTotal(dataArray)
    const editedData = dataArray.map( (symbol, idx) => {
      const { checked, targetRatio, price, quantity } = this.state.dataDict[symbol]
      const { capitalInput } = this.state
      const amount = amounts[idx]
      const tempTargetRatio = checked ? (targetRatio === null ? Math.round(amount/total*100) : targetRatio) : (targetRatio === null ? '-' : targetRatio)
      const {quantityIncrement, adjustedQuantity, adjustedAmount} = this._adjustQuantityAndAmount(amount, total, quantity, price, tempTargetRatio, capitalInput)
      return { symbol, ...this.state.dataDict[symbol], 
        amount: amounts[idx], 
        ratio: checked ? amounts[idx]/total : 0,
        targetRatio: tempTargetRatio,
        quantityIncrement,
        adjustedQuantity,
        adjustedAmount
      }
    })
    return { editedData, total }
  }
  
  render () {
    const { dataArray, capitalInput, capitalInputError } = this.state
    const { editedData, total } = this.computeAndExtend(dataArray)
    const totalAdjustedAmount = editedData.map(({adjustedAmount}) => adjustedAmount).reduce((pre, cur) => pre + cur)
    const leftover = total + capitalInput - totalAdjustedAmount
    console.log(JSON.stringify(editedData, null, 4))
    return (
      <div className={styles.rebalanceBody}>
        <Message>
          <Message.Header>Rebalance Simulator</Message.Header>
          <Message.Content>為維持投資組合的比例，計算各部位應購入的金額或股數。</Message.Content>
        </Message>        
        <div className={styles.amountOverview}>
          <div className={styles.currentAmountView}>
            <FontAwesomeIcon  fixedWidth icon={faDollarSign} size='lg' />
            {formatMoney(total)}
          </div>
          <div className={styles.capitalInputView}>
            <FontAwesomeIcon  fixedWidth icon={faHandHoldingUsd} size='lg' />
            <Input 
              value={capitalInput}
              // error={capitalInputError}
              onChange={this.handleCapitalInputChange}
              placeholder='Capital Input' 
              size='mini'>
            </Input>
          </div>
          <div className={styles.leftoverView}>
            <FontAwesomeIcon  fixedWidth icon={faDonate} size='lg' />
            {formatMoney(leftover)}
          </div>
        </div>

        <div className={styles.adjustBarGroup}>
          {editedData.map( (attrs, idx) => {
            return (<AdjustBar 
              key={idx} 
              toggleChecker={this.toggleChecker} 
              adjustTargetRatio={this.adjustTargetRatio}
              capitalInput={capitalInput}
              totalNetValue={total}
              {...attrs} />)
            })}
        </div>
      </div>
    )
  }
  toggleChecker = (e, {symbol, checked}) => {
    e.preventDefault()
    this.setState((state, props) => {
      let dataDict = state.dataDict
      dataDict[symbol].checked = checked
      return { dataDict }
    })
  }
  adjustTargetRatio = (symbol, targetRatio) => {
    this.setState((state, props) => {
      let dataDict = state.dataDict
      dataDict[symbol].targetRatio = targetRatio
      return { dataDict }
    })
  }
  handleCapitalInputChange = (e) => {
    e.preventDefault()
    const parsed = parseFloat(e.target.value)
    if (parsed) {
      this.setState({ capitalInput: parsed, capitalInputError:false })
    } else {
      this.setState({ capitalInputError: true})
    }
  }
}

