// @flow
import React, { Component, Fragment, useState }  from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, LabelList } from 'recharts'
import { PieChart, Pie, Legend, Cell, Sector } from 'recharts'

import { formatMoney } from '../../utils/stringFormatter'
import styles from './PortfolioPie.css'

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

const Cyan = [
  '#e7f5ff',
  '#c5f6fa',
  '#99e9f2,',
  '#66d9e8',
  '#3bc9db',
  '#22b8cf',
  '#15aabf',
  // '#1098ad',
  // '#0c8599',
  // '#0b7285',
].reverse()

const Blue = [
  '#e3fafc',
  '#d0ebff',
  '#a5d8ff',
  '#74c0fc',
  '#4dabf7',
  '#339af0',
  '#228be6',
  // '#1c7ed6',
  // '#1971c2',
  // '#1864ab',
].reverse()

const renderActiveShape = (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value } = props
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius+15}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  )
}

const CustomTooltip = ({ payload, active, assetMeta}) => {
  if (active) {
    const { name } = payload[0]
    const { quantity, invest, reinAmount, cost } = assetMeta[name]
    return (
      <div className={styles.tooltipMsg}>
        <h3>{name}</h3>
        <p>
          Quantity: {formatMoney(quantity)} <br/>
          Your invest: {formatMoney(invest)} <br/>
          Rein. amount: {formatMoney(reinAmount)} <br/>
          Total cost: {formatMoney(cost)} <br/>
        </p>
      </div>
    )
  }
  return null;
}

function SummaryTooltip ({ payload, active}) {  
  if (active) {
    const { name, value } = payload[0]
    return (
      <div className={styles.tooltipMsg}>
        <h3>{name}</h3>
        <p>
          Total cost: {formatMoney(value)} <br/>
        </p>
      </div>
    )
  }
  return null;
}

const PortfolioPie = ({assetArray}) => {
  // assetArray format: 
  // [
  //   {
  //       "symbol": "VT",
  //       "assetType": "stock",
  //       "quantity": 145.77039,
  //       "invest": 10244.68,
  //       "reinAmount": 128.14999999999998,
  //       "cost": 10372.83
  //   },
  // ]
  const [activeIndexA, setActiveIndexA] = useState(null)
  const [activeIndexB, setActiveIndexB] = useState(null)
  const getTotalCost = (assetArray) => {
    return assetArray.map((props) => {
        const { symbol, cost } = props
        return { name: symbol, value: cost, props }
      })
  }
  const getStockBondRatio = (assetArray) => {
    let StockBondRatio = [0, 0, 0] // 0: bond , 1: unknown, 2: stock
    assetArray.forEach( ({assetType, cost}) => {
      if (assetType === 'stock') {
        StockBondRatio[2] += cost
      } else if (assetType === 'bond') {
        StockBondRatio[0] += cost
      } else {
        StockBondRatio[1] += cost
      }
    })
    return [
      { name: 'BOND', value: StockBondRatio[0]}, 
      { name: 'UNKNOWN', value: StockBondRatio[1]}, 
      { name: 'STOCK', value: StockBondRatio[2]} 
    ].filter( data => data.value > 0)
  }
  const assetMeta = {}
  assetArray.forEach((props) => {
    assetMeta[props.symbol] = props
  })
  const sortedAssetArray = assetArray.sort(assetSorter)
  const totalCosts = getTotalCost(sortedAssetArray)
  const stockBondRatio = getStockBondRatio(sortedAssetArray)
  const colors = totalCosts.length > 10 ? Cyan : Blue.concat(Cyan)
  return (
    <div className={styles.pieCharts}>
      <PieChart width={400} height={300} >
        <Tooltip content={<CustomTooltip assetMeta={assetMeta}/>}/>
        <Legend />
        <Pie data={totalCosts} 
          dataKey="value" nameKey="name" 
          cx="50%" cy="50%" 
          activeIndex={activeIndexA}
          activeShape={renderActiveShape} 
          onMouseEnter={(data, index)=>{ setActiveIndexA(index) }}
          onMouseLeave={(data, index)=>{ setActiveIndexA(null) }}
          > 
          {
            totalCosts.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index%colors.length]}/>
            ))
          }
        </Pie>
      </PieChart>
      <PieChart width={400} height={300} >
        <Tooltip content={<SummaryTooltip />}/>
        <Legend />
        <Pie data={stockBondRatio} 
          dataKey="value" nameKey="name" 
          cx="50%" cy="50%" 
          activeIndex={activeIndexB}
          activeShape={renderActiveShape} 
          onMouseEnter={(data, index)=>{ setActiveIndexB(index) }}
          onMouseLeave={(data, index)=>{ setActiveIndexB(null) }}
          > 
          {
            stockBondRatio.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index%colors.length]}/>
            ))
          }
        </Pie>
      </PieChart>
    </div>
  )
}

export default PortfolioPie