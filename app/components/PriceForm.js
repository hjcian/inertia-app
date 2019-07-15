import React, { Component } from 'react'
import { Form, Input } from 'semantic-ui-react'
import { parse } from 'path-to-regexp';


export default class PriceForm extends Component {
  state = {     
    symbols: this.props.symbols.reduce((o, value) => ({ ...o, [value]: '' }), {}),
  }

  handleChange = (e, { name, value }) => {
    e.preventDefault()
    let symbols = this.state.symbols // dummy variable
    symbols[name] = value
    this.setState({ symbols })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { symbols } = this.state    
    const { importCurrentPrices } = this.props
    const today = new Date()
    importCurrentPrices(symbols, today)
  }

  render() {
    const { symbols, name, email, submittedName, submittedEmail } = this.state
    return (      
      <Form 
        onSubmit={this.handleSubmit}
      >
        <Form.Group inline={true}>
          {
            Object.keys(symbols).map((symbol, idx) => {
            return (
              <Form.Field key={symbol} inline={true}>
                <label>{symbol}</label>
                <Input
                  placeholder={symbol}
                  name={symbol}
                  value={this.state.symbols[symbol]} 
                  onChange={this.handleChange} 
                  type="number" step='0.01' min='1' max='9999'
                />
              </Form.Field>
              )
            })
          }
          <Form.Button content='Submit' />
        </Form.Group>
      </Form>
    )
  }
}


