import React, { Component, Fragment } from 'react'
import { Input, Message, Checkbox, Label, Button, Icon } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlusSquare,
  faMinusSquare,
  faAsterisk,
}

from '@fortawesome/free-solid-svg-icons'
import styles from './AdjustBar.css'

const RATIO_STEP = 5

const BuyOrSellFormatter = ({number}) => {
  const obj = number === 0 ? 
      {
        icon: faAsterisk,
        color: '#adb5bd',
        size: 'lg',
      } : (number > 0 ? 
      {
        icon: faPlusSquare,
        color: '#2b8a3e',
        size: 'lg',
      }: 
      {
        icon: faMinusSquare,
        color: '#c92a2a',
        size: 'lg',
      })
  return (
    <Fragment>
      <FontAwesomeIcon fixedWidth {...obj} />
      {Math.abs(number)}
    </Fragment>
  )
}


const AdjustBar = ( {
    symbol, quantity, price, amount, ratio, targetRatio, checked, isExceed100,
    quantityIncrement, adjustedQuantity, adjustedAmount, 
    toggleChecker, adjustTargetRatio} ) => {  

  const handleButtonClick = (e, {symbol, value, name}) => {
    e.preventDefault()
    const mod = value % RATIO_STEP
    const coef = name === 'plus' ? 1 : -1
    const formula = name === 'plus' ? Math.ceil : Math.floor
    const newRatio = mod === 0 ? value + coef * RATIO_STEP : formula(value / RATIO_STEP) * RATIO_STEP    
    adjustTargetRatio(symbol, newRatio > 100 ? 100 : (newRatio < 0 ? 0 : newRatio))
  }
  const handleInputChange = (e, {symbol}) => {
    e.preventDefault()
    const newRatio = e.target.value > 100 ? 100 : (e.target.value < 0 ? 0 : e.target.value)
    adjustTargetRatio(symbol, newRatio)
  }
  return (
    <div className={styles.adjustBar}>
        <Checkbox 
          toggle
          checked={checked}
          onChange={toggleChecker} 
          symbol={symbol}>
        </Checkbox>
        <div className={styles.adjustBarSymbol}>{symbol}</div>
        <div className={styles.showNetValue}>
          <div className={styles.showNetValueAmount}> ${amount} </div>
          <div className={styles.showNetValueFormula}> {quantity}x${price} </div>
        </div>
        <div className={styles.adjustBarRatio}>
          <div>{Math.round(ratio * 100 *10)/10}</div>
          <Icon name='percent' size='tiny' color='grey'/>
        </div>
        <div className={styles.adjustBarButtons}>
          <Button disabled={!checked} size='mini' icon='plus' name='plus'
            symbol={symbol}
            value={targetRatio}
            onClick={handleButtonClick} />
          <Button disabled={!checked} size='mini' icon='minus' name='minus'
            symbol={symbol} 
            value={targetRatio}
            onClick={handleButtonClick} />
        </div>
        <div className={styles.adjustBarInput}>
          <Input fluid icon transparent 
            value={targetRatio}
            disabled={!checked} 
            size='small' 
            symbol={symbol}
            onChange={handleInputChange}
            error={isExceed100}
            >
            <Icon name='percent'/>
            <input />
          </Input>
        </div>
        <div className={styles.adjustBarQuantInc}>
          <BuyOrSellFormatter number={quantityIncrement}/>
        </div>
        <div className={styles.showNetValue}>
          <div className={styles.showNetValueAmount}> ${adjustedAmount} </div>
          <div className={styles.showNetValueFormula}> {adjustedQuantity}x${price} </div>
        </div>
    </div>
  )
}

export default AdjustBar