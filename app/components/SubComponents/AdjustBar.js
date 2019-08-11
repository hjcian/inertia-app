import React, { Fragment } from 'react'
import { Input, Checkbox, Button, Icon, Header, Label } from 'semantic-ui-react'
import styles from './AdjustBar.css'
import { formatMoney } from '../../utils/stringFormatter'

const RATIO_STEP = 5

const BuyOrSellFormatter = ({ number, checked }) => {
  const obj = number === 0
    ? {
      color: 'black',
      size: 'lg',
      text: ''
    } : (number > 0
      ? {
        color: 'teal',
        size: 'lg',
        text: 'Buy'
      }
      : {
        color: 'red',
        size: 'lg',
        text: 'Sell'
      })

  return (
    <Fragment>
      <Header as='h3' textAlign='right'
        color={checked ? obj.color : 'grey'}
      >
        <Header.Content>{obj.text ? <Label color={obj.color} horizontal pointing='right'>{obj.text}</Label> : ''}{Math.abs(number)}</Header.Content>
        <Header.Subheader>shares</Header.Subheader>
      </Header>
    </Fragment>
  )
}

const AdjustBar = ({
  symbol, quantity, price, amount, ratio, targetRatio, checked, isExceed100,
  quantityIncrement, adjustedQuantity, adjustedAmount,
  toggleChecker, adjustTargetRatio }) => {
  const handleButtonClick = (e, { symbol, value, name }) => {
    e.preventDefault()
    const mod = value % RATIO_STEP
    const coef = name === 'plus' ? 1 : -1
    const formula = name === 'plus' ? Math.ceil : Math.floor
    const newRatio = mod === 0 ? value + coef * RATIO_STEP : formula(value / RATIO_STEP) * RATIO_STEP
    adjustTargetRatio(symbol, newRatio > 100 ? 100 : (newRatio < 0 ? 0 : newRatio))
  }
  const handleInputChange = (e, { symbol }) => {
    e.preventDefault()
    const newRatio = e.target.value > 100 ? 100 : (e.target.value < 0 ? 0 : e.target.value)
    adjustTargetRatio(symbol, newRatio)
  }
  return (
    <div className={styles.adjustBar}>
      <Checkbox
        slider
        checked={checked}
        onChange={toggleChecker}
        symbol={symbol} />
      <div className={styles.adjustBarSymbol}>
        <Header as='h2' content={symbol}
          color={checked ? 'black' : 'grey'}
        />
      </div>
      <div className={styles.showNetValue}>
        <Header as='h3' textAlign='right'
          color={checked ? 'black' : 'grey'}
        >
          <Header.Content><Icon name='dollar sign' fitted size='small' />{formatMoney(amount, 1)}</Header.Content>
          <Header.Subheader>{formatMoney(quantity, 1)} x <Icon name='dollar sign' fitted size='small' />{price}</Header.Subheader>
        </Header>
      </div>
      <div className={styles.adjustBarRatio}>
        <Header as='h4' textAlign='right'
          color={checked ? 'black' : 'grey'}
        >
          <Header.Subheader>
            {Math.round(ratio * 100 * 10) / 10}<Icon name='percent' size='tiny' fitted />
          </Header.Subheader>
        </Header>
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
        <Input
          icon
          fluid
          transparent
          value={targetRatio}
          disabled={!checked}
          size='small'
          symbol={symbol}
          onChange={handleInputChange}
          error={isExceed100}
        >
          <input style={{ textAlign: 'right' }} />
          <Icon name='percent' size='tiny' />
        </Input>
      </div>
      <div className={styles.adjustBarQuantInc}>
        <BuyOrSellFormatter checked={checked} number={quantityIncrement} />
      </div>
      <div className={styles.showNetValue}>
        <Header as='h3' textAlign='right'
          color={checked ? 'black' : 'grey'}
        >
          <Header.Content><Icon name='dollar sign' fitted size='small' />{formatMoney(adjustedAmount, 1)}</Header.Content>
          <Header.Subheader>{formatMoney(adjustedQuantity, 1)} x <Icon name='dollar sign' fitted size='small' />{price}</Header.Subheader>
        </Header>
      </div>
    </div>
  )
}

export default AdjustBar
