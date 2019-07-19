import React, { Component, Fragment, useState } from 'react'
import { Form, Input, Label, Button } from 'semantic-ui-react'

import { fetchLatestClosePrice, providerList} from '../../utils/fetcher'

const PriceFetcher = ({symbols}) => {  
    const [ provider, setProvider ] = useState(providerList[0].value)
    const [ apikey, setApikey ] = useState('')
    async function handleAPIKeyEmit(e) {
      e.preventDefault()
      const promises = symbols.map( symbol => fetchLatestClosePrice(symbol, apikey, provider) )
      const results = await Promise.all(promises)
      console.log('get the server results: ')
      console.log(JSON.stringify(results, null, 4))
    }
    function handleAPIKeyChange(e, {value}){
      e.preventDefault()
      setApikey(value)    
    }
    function handleChange(e, { value }) {
      e.preventDefault()
      console.log(`change: ${value}`)
      setProvider(value)    
    }
    return (
      <Form onSubmit={handleAPIKeyEmit}>
        <Form.Group>
          <Form.Select            
            search
            scrolling
            placeholder='Select a provider...'
            onChange={handleChange}
            options={providerList}
            defaultValue={provider}
            />
          <Form.Input value={apikey} placeholder='apikey paste here' onChange={handleAPIKeyChange}/>
          <Form.Button type='submit' content='Submit' />
        </Form.Group>
      </Form>
    )
  }
  
  export default PriceFetcher