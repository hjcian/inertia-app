import React, { Component } from 'react'
import { Message } from 'semantic-ui-react'

import { dataStore } from '../utils/store'
import PortfolioPie from './Charts/PortfolioPie'

const Portfolio = () => {
  const { data } = dataStore
  return (
    <div>
      <Message>
        <Message.Header>Portfolio Review</Message.Header>
        <Message.Content>投資組合概觀</Message.Content>
      </Message>
      {
        data &&
        <PortfolioPie assetArray={data.getSummary()}/>
      }
    </div>
  )  
}

export default Portfolio