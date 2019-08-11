import React, { Component } from 'react'
import { Input, Button, Select } from 'semantic-ui-react'

import { fetchLatestClosePrice, providerList } from '../../utils/fetcher'

export default class PriceFetcher extends Component {
    state = {
      provider: providerList[0].value,
      apikey: '',
      isLoading: false
    }
    handleAPIKeyEmit = async (e) => {
      e.preventDefault()
      const { symbols, priceSyncher } = this.props
      const { apikey, provider } = this.state
      let prevDate = null
      this.setState({ isLoading: true }, async () => {
        const promises = symbols.map(symbol => fetchLatestClosePrice(symbol, apikey, provider))
        const results = await Promise.all(promises)
        const ret = symbols.map((symbol, idx) => {
          const { closePrice: price, date } = results[idx]
          prevDate = date
          return { symbol, price }
        })
        priceSyncher(ret, prevDate)
        this.setState({ isLoading: false })
      })
    }
    handleAPIKeyChange = (e, { value }) => {
      e.preventDefault()
      this.setState({ apikey: value })
    }
    handleSelectorChange = (e, { value }) => {
      e.preventDefault()
      this.setState({ provider: value })
    }
    render () {
      const { apikey, provider, isLoading } = this.state
      return (
        <Input
          disabled={isLoading}
          size='mini'
          type='text'
          value={apikey}
          placeholder='paste apikey here...'
          onChange={this.handleAPIKeyChange}
          action
        >
          <input />
          <Select
            search scrolling
            options={providerList}
            defaultValue={provider}
            disabled={isLoading}
            onChange={this.handleSelectorChange}
          />
          <Button
            size='mini'
            type='submit'
            loading={isLoading}
            content='Submit'
            onClick={this.handleAPIKeyEmit} />
        </Input>
      )
    }
}
