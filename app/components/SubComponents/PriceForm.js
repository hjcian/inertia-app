import React, { Component, Fragment, useState } from 'react'
import { Form, Input, Label, Button, Icon } from 'semantic-ui-react'

import { fetchLatestClosePrice, providerList} from '../../utils/fetcher'
import styles from './PriceForm.css'

export default class PriceForm extends Component {
  state = {     
    symbolPrices: this.props.prices,
  }

  handleSingleChange = (e, { name, value }) => {
    e.preventDefault()
    let symbolPrices = this.state.symbolPrices // dummy variable
    symbolPrices = symbolPrices.map( (obj) => {
      if (obj.symbol === name) { obj.price = parseFloat(value) }
      return obj
    })    
    this.setState({ symbolPrices })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const { symbolPrices } = this.state
    const { updateReturns } = this.props
    updateReturns(symbolPrices)
  }
  render() {
    const { symbolPrices } = this.state
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group >
          {
            symbolPrices.map( ({ symbol, price }) => {
              return (
                <Form.Field key={symbol} >
                <Label content={symbol} />
                <Input
                  placeholder={symbol}
                  name={symbol}
                  value={price || ''} 
                  onChange={this.handleSingleChange} 
                  type="number" step='0.01' min='1' max='9999'
                  />
              </Form.Field>
              )
            })
          }
        </Form.Group>
        <Form.Button type='submit' content='Calculate' />        
      </Form>
    )
  }
  componentDidUpdate(prevProps) {
    if(this.props.prices !== prevProps.prices) {
      this.updatePrices()
    }
  }
  updatePrices() {
    const { prices } = this.props
    this.setState({symbolPrices: prices})
  }
}


