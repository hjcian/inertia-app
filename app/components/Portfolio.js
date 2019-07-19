// @flow
import React, { Component } from 'react'

import { dataStore } from '../utils/store'
import PortfolioPie from './Charts/PortfolioPie'

const Portfolio = () => {
  const { data } = dataStore
  return (
    <div>
      <h1>
        Portfolio
      </h1>
      {
        data &&
        <PortfolioPie assetArray={data.getSummary()}/>
      }
    </div>
  )  
}

export default Portfolio