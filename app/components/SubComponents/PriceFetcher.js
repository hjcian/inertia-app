import React, { Component, Fragment, useState } from 'react'
import { Form, Input, Label, Button } from 'semantic-ui-react'

import { fetchLatestClosePrice, providerList} from '../../utils/fetcher'

export default class PriceFetcher extends Component {
    state = {
      provider: providerList[0].value,
      apikey: '',
      isLoading: false,
    }
    handleAPIKeyEmit = async (e) => {
      e.preventDefault()
      const { symbols, priceSyncher } = this.props
      const { apikey, provider } = this.state
      this.setState({isLoading: true}, async ()=> {        
        const promises = symbols.map( symbol => fetchLatestClosePrice(symbol, apikey, provider) )
        const results = await Promise.all(promises)
        const ret = symbols.map( (symbol, idx) => { 
          const { closePrice: price, date } = results[idx]
          return { symbol, price, date } 
        } )
        priceSyncher(ret)
        this.setState({isLoading: false})
      })
    }
    handleAPIKeyChange = (e, {value}) => {
      e.preventDefault()
      this.setState({apikey: value})
    }
    handleSelectorChange = (e, {value}) => {
      e.preventDefault()
      this.setState({provider: value})
    }
    render () {
        const { apikey, provider, isLoading } = this.state
        return (
          <Form onSubmit={this.handleAPIKeyEmit}>
          <Form.Group>
            <Form.Select            
              search
              scrolling              
              disabled={isLoading}
              placeholder='Select a provider...'
              options={providerList}
              defaultValue={provider}
              onChange={this.handleSelectorChange}              
              />
            <Form.Input 
              disabled={isLoading}
              value={apikey}               
              placeholder='apikey paste here' 
              onChange={this.handleAPIKeyChange}/>
            <Form.Button 
              loading={isLoading}
              type='submit' 
              content='Submit' />
          </Form.Group>
        </Form>
      )
    }
  }