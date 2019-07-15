// @flow
// import fs from 'fs'
// let data_json = JSON.stringify(data, null, 4)
// fs.writeFile('dump.json', data_json, 'utf8', ()=>{});

import React, { Component, Fragment } from 'react'
import CSVReader from 'react-csv-reader'
import { Link } from 'react-router-dom'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { PieChart, Pie, Legend } from 'recharts'

import routes from '../constants/routes'
import { relativeTimeRounding } from 'moment';

import dump from '../utils/dump.json'
import { parseCSV, computeTotalAmount, isCSVFormatValid } from '../utils/firstrade'

import styles from './Import.css'

function assetSorter(a, b) {
  if (a.assetType > b.assetType){
    return 1
  } else if (a.assetType == b.assetType){
    if (a.cost > b.cost) {
      return -1
    } else {
      return 1
    }
  }else {
    return -1
  }    
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x  = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy  + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">      
      {`${name} ${(percent * 100).toFixed(1)}% (${value.toFixed(0)})`}      
    </text>
  )
}

class RenderInvestPie extends Component {
  getTotalCost = assetArray => {
    return assetArray.map( asset => {
        const { symbol, cost } = asset    
        return { name: symbol, value: cost }
      }
    )
  }
  getStockBondRatio = assetArray => {
    let StockBondRatio = [0, 0, 0] // 0: bond , 1: unknown, 2: stock
    assetArray.forEach( asset => {
      if (asset.assetType === 'stock') {
        StockBondRatio[2] += asset.cost
      } else if (asset.assetType === 'bond') {
        StockBondRatio[0] += asset.cost
      } else {
        StockBondRatio[1] += asset.cost
      }
    })
    return [
      { name: 'bond', value: StockBondRatio[0]}, 
      { name: 'unknown', value: StockBondRatio[1]}, 
      { name: 'stock', value: StockBondRatio[2]} 
    ].filter( data => data.value > 0)
  }
  render () {
    const { assetArray } = this.props
    const sortedAssetArray = assetArray.sort(assetSorter)
    const totalCosts = this.getTotalCost(sortedAssetArray)
    const stockBondRatio = this.getStockBondRatio(sortedAssetArray)
    return (
      <Fragment>
        <PieChart width={800} height={400} >
          <Pie data={totalCosts} 
          dataKey="value" nameKey="name" 
          cx="50%" cy="50%" 
          innerRadius='60%' outerRadius='80%' 
          fill="#868e96"
          labelLine={false}
          label={renderCustomizedLabel}
          paddingAngle={3}
          />
          <Pie data={stockBondRatio} 
            dataKey="value" nameKey="name" 
            cx="50%" cy="50%" 
            innerRadius='30%' outerRadius='50%' 
            fill="#868e96"
            labelLine={false}
            label={renderCustomizedLabel}
            paddingAngle={5}
          />
        </PieChart>
      </Fragment>
    )
  }
}

type Props = {

}

export default class Import extends Component<Props> {
  props: Props;
  state = {
    data: null,
    assetArray: null,
    isValidFormat: null,    
    totalAmount: null,
    firstradeRecordContainer: null,
  }
  handleForce = data => {
    const isValid = isCSVFormatValid(data)
    if ( !isValid ){
      this.setState({isValidFormat: false})
    }
    else {
      const totalAmount = computeTotalAmount(data)
      const { assetArray, firstradeRecordContainer } = parseCSV(data)
      const { importData } = this.props
      importData(firstradeRecordContainer)
      this.setState({
        data,
        isValidFormat: true,
        assetArray,
        totalAmount,
        firstradeRecordContainer,
      })
    }
  } 
  _getData = () => {
    this.setState({
      data:null,
      isValidFormat: false,
      assetArray:null,
      totalAmount:null,
    }, ()=>{
      this.handleForce(dump)
    })    
  }
  render () {
    const { assetArray } = this.state
    return (
      <div className={styles.container} data-tid='container'>
        {/* <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.HOME}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div> */}
        <h2>Import data</h2>
        {/* <Link to={routes.HOME}>Back to home</Link> */}
        <CSVReader
          cssClass={styles.csvReaderInput}
          label="Select CSV with secret Death Star statistics"
          onFileLoaded={this.handleForce}
          // onError={this.handleDarkSideForce}
          inputId="ObiWan"
          inputStyle={{color: 'red'}}
        />
        <button onClick={this._getData}>
          get data
        </button>
        {
          assetArray && <RenderInvestPie assetArray={assetArray}/>
        }
      </div>      
    )
  }
}
