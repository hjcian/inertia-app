import React, { Component } from 'react'
import { Input, Message, Checkbox, Label, Button, Icon } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDollarSign,
  faHandHoldingUsd,
  faCartArrowDown,
  faDonate,
  faPlus,
  faEquals,
}
from '@fortawesome/free-solid-svg-icons'

import { calcAssetIncrement, calcQuantity } from '../utils/formula'
import { formatMoney } from '../utils/stringFormatter'
import { dataStore } from '../utils/store'
import AdjustBar from './SubComponents/AdjustBar'
import styles from './Rebalance.css'
import { parse } from 'semver';
import { bold } from 'ansi-colors';

const initDataDict = () => {
  const { data } = dataStore
  if (data) {
    let dataDict = {}
    const symbolArray = data.getSymbols()
    data.currentPrices.forEach(({symbol, price})=> {
      dataDict[symbol] = {
        price,
        quantity: data.getQuantity(symbol),
        checked: true,
        targetRatio: null,
      }
    })
    return dataDict
  }
  return null
}

export default class Rebalance extends Component {
  state = {
    capitalInput: 3000,
    capitalInputError: true,
    dataArray: dataStore.data ? dataStore.data.getSymbols() : [],
    dataDict: initDataDict(),
  }
  _getAmountsAndTotal (dataArray) {
    let total = 0
    let amounts = []
    dataArray.forEach( (symbol) => {
      const { price, quantity, checked } = this.state.dataDict[symbol] || {}
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
  computeAndExtend () {
    const { dataArray, dataDict, capitalInput } = this.state
    if (dataDict) {
      const {total, amounts} = this._getAmountsAndTotal(dataArray)
      const editedData = dataArray.map( (symbol, idx) => {
        const { checked, targetRatio, price, quantity } = dataDict[symbol] || {}
        const amount = amounts[idx]
        const tempTargetRatio = checked ? (targetRatio === null ? Math.round(amount/total*100) : targetRatio) : (targetRatio === null ? '-' : targetRatio)
        const {quantityIncrement, adjustedQuantity, adjustedAmount} = this._adjustQuantityAndAmount(amount, total, quantity, price, tempTargetRatio, capitalInput)
        return { symbol, ...dataDict[symbol], 
          amount: amounts[idx], 
          ratio: checked ? amounts[idx]/total : 0,
          targetRatio: checked ? tempTargetRatio: 0,
          quantityIncrement: checked ? quantityIncrement: 0,
          adjustedQuantity: checked ? adjustedQuantity: 0,
          adjustedAmount: checked ? adjustedAmount: 0,
        }
      })
      return { editedData, total }
    } else {
      // data not ready
      return { editedData: [], total: 0 }
    }
  }
  
  render () {
    const { capitalInput, capitalInputError } = this.state
    const { editedData, total } = this.computeAndExtend()
    const totalAdjustedAmount = editedData
                .map(({adjustedAmount}) => parseFloat(adjustedAmount) )
                .reduce((pre, cur) => pre + cur, 0)
    const leftover = total + capitalInput - totalAdjustedAmount
    const sumTargetRatio = editedData
                .map(({targetRatio}) => parseFloat(targetRatio) )
                .reduce((pre, cur) => pre + cur, 0)
    console.log(JSON.stringify(editedData, null, 4))
    console.log(sumTargetRatio)
    initDataDict()
    return (
      <div className={styles.rebalanceBody}>
        <Message>
          <Message.Header>Rebalance Simulator</Message.Header>
          <Message.Content>
            Calculate how much quantities your should buy or sell based on your capital input.
          </Message.Content>
        </Message>        
        <div className={styles.amountOverview}>
          <div className={styles.currentAmountView}>
            <FontAwesomeIcon fixedWidth icon={faDollarSign} size='lg' />
            <div className={styles.moneyText}>{formatMoney(total)}</div>
          </div>
          <div className={styles.arithmeticSign}>
            <FontAwesomeIcon fixedWidth icon={faPlus} size='lg' />
          </div>
          <div className={styles.capitalInputView}>
            <FontAwesomeIcon fixedWidth icon={faHandHoldingUsd} size='lg' />
            <div className={styles.capitalInput}>
              <Input 
                value={capitalInput}
                error={capitalInputError}
                onChange={this.handleCapitalInputChange}
                placeholder='Capital Input' 
                size='mini' 
                transparent
                fluid
                />            
            </div>
          </div>
          <div className={styles.arithmeticSign}>
            <FontAwesomeIcon fixedWidth icon={faEquals} size='lg' />
          </div>
          <div className={styles.totalAdjustedAmountView}>
            <FontAwesomeIcon fixedWidth icon={faCartArrowDown} size='lg' />          
            <div className={styles.moneyText}>{formatMoney(totalAdjustedAmount)}</div>
          </div>
          <div className={styles.arithmeticSign}>
            <FontAwesomeIcon fixedWidth icon={faPlus} size='lg' />
          </div>
          <div className={styles.leftoverView}>
            <FontAwesomeIcon fixedWidth icon={faDonate} size='lg' />
            <div className={styles.moneyText}>{formatMoney(leftover)}</div>
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
              isExceed100={sumTargetRatio > 100 ? true: false}
              {...attrs} />)
            })}
        </div>
        {
          capitalInputError && 
          <div className={styles.inputErrorMsg}> 
            <Message 
            warning
            icon='warning sign'
            header='Capital Input Empty'
            size='mini'
            >
            </Message>
          </div>
        }
        {
          sumTargetRatio > 100 && 
          <div className={styles.inputErrorMsg}> 
            <Message 
            warning
            icon='warning sign'
            header='Summation of ratio is exceed 100%'
            content={`Your summation of ratio is ${sumTargetRatio}%, the computed results maybe incorrect.`}
            size='mini'
            >
            </Message>
          </div>
        }
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
      this.setState({ capitalInput: '', capitalInputError: true})
    }
  }
}

