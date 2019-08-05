import React, { Component } from 'react'
import { Input, Button, Header } from 'semantic-ui-react'
import ModernDatepicker from 'react-modern-datepicker'

import styles from './PriceForm.css'

Date.prototype.yyyymmdd = function () {
  var mm = this.getMonth() + 1 // getMonth() is zero-based
  var dd = this.getDate()
  return [this.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
  ].join('-')
}

export default class PriceForm extends Component {
  state = {
    symbolPrices: this.props.prices,
    dateStr: this.props.prevDate.yyyymmdd()
  }
  handleSingleChange = (e, { name, value }) => {
    e.preventDefault()
    let symbolPrices = this.state.symbolPrices // dummy variable
    symbolPrices = symbolPrices.map((obj) => {
      if (obj.symbol === name) { obj.price = parseFloat(value) }
      return obj
    })
    this.setState({ symbolPrices })
  }
  handleCalc = (e) => {
    e.preventDefault()
    const { symbolPrices, dateStr } = this.state
    const { updateReturns } = this.props
    updateReturns(symbolPrices, dateStr)
  }
  handleDatePicker = (dateStr) => {
    this.setState({ dateStr })
  }
  render () {
    const { symbolPrices, dateStr } = this.state
    return (
      <div className={styles.priceForm}>
        <div className={styles.symbolBox}>
          {
            symbolPrices.map(({ symbol, price }, idx) => {
              return (
                <div key={idx} className={styles.symbolSlot}>
                  <div className={styles.symbolText}>
                    {symbol}
                  </div>
                  <div className={styles.symbolInput}>
                    <Input
                      placeholder={symbol}
                      name={symbol}
                      value={price || ''}
                      onChange={this.handleSingleChange}
                      type='number' step='0.01' min='1' max='9999'
                      size='mini'
                    />
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className={styles.datePicker}>
          <Header as='h4' size='tiny' color='grey' textAlign='center'>
            Corresponding date
          </Header>
          <div className={styles.pickerContainer}>
            <ModernDatepicker
              date={dateStr}
              format={'YYYY-MM-DD'}
              onChange={this.handleDatePicker}
            />
          </div>
        </div>
        <div className={styles.formButton}>
          <Button type='submit' content='Calculate' onClick={this.handleCalc} />
        </div>
      </div>
    )
  }
  componentDidUpdate (prevProps) {
    if (this.props.prices !== prevProps.prices) {
      this._updatePrices()
    }
    if (this.props.prevDate !== prevProps.prevDate) {
      this._updatePrevDate()
    }
  }
  _updatePrices () {
    const { prices } = this.props
    this.setState({ symbolPrices: prices })
  }
  _updatePrevDate () {
    const { prevDate } = this.props
    this.setState({ dateStr: prevDate })
  }
}
