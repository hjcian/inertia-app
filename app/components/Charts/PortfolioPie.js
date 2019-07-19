// @flow
import React, { Component, Fragment } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { PieChart, Pie, Legend } from 'recharts'

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
      <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">      
        {`${name} ${(percent * 100).toFixed(1)}% (${value.toFixed(1)})`}      
      </text>
    )
  }
  export default class PortfolioPie extends Component {
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
    //   {
    //       "symbol": "BND",
    //       "assetType": "bond",
    //       "quantity": 16.326539999999998,
    //       "invest": 1279.7988,
    //       "reinAmount": 26.040000000000003,
    //       "cost": 1305.8388
    //   }
    // ]
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
  }