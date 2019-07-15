import React, { Component, Fragment } from 'react'
import { Form, Input, Label, Button } from 'semantic-ui-react'
import Select from 'react-select'

import { fetchLatestClosePrice, providerList} from '../utils/fetcher'
import styles from './PriceForm.css'



class HistPriceGetter extends Component {
  state = {
    selectedOption: providerList[0],
    apikey: null
  }
  handleAPIKeyEmit = async e => {
    e.preventDefault()
    const { symbols } = this.props
    const { apikey: token, selectedOption } = this.state
    const { value: backend } = selectedOption
    console.log(symbols)
    console.log(`apikey: ${this.state.apikey}`)
    console.log(`selectedOption: ${this.state.selectedOption.value}`)
    const promises = symbols.map( symbol => fetchLatestClosePrice(symbol, token, backend) )
    const results = await Promise.all(promises)
    console.log(results)
  }
  handleAPIKeyChange = (e, {value}) => {
    e.preventDefault()    
    this.setState({
      apikey: value
    })
  }
  render() {
    const { selectedOption, apikey } = this.state
    return (
      <div className={styles.priceGetter}>
        <div className={styles.priceGetter.top}>
          <Form onSubmit={this.handleAPIKeyEmit}>
            <Input value={apikey} placeholder='apikey paste here' onChange={this.handleAPIKeyChange}/>
            <Form.Button type='submit' content='Emit' />
          </Form>
        </div>
        <div className={styles.priceGetter.bottom}>
          <Select
            isSearchable
            placeholder='Select a provider...'
            onChange={ selectedOption => { this.setState({ selectedOption }) } }
            options={providerList}
            defaultValue={providerList[0]}
          />
        </div>
      </div>
    );
  }
}

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
      <div className={styles.form}>
        <HistPriceGetter symbols={Object.keys(symbols)}/>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group inline={true}>
            {
              Object.keys(symbols).map((symbol, idx) => {
                return (
                  <Form.Field key={symbol} inline={true}>
                  <Label content={symbol} />
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
            <Form.Button type='submit' content='Submit' />
          </Form.Group>
        </Form>
      </div>
    )
  }
}


