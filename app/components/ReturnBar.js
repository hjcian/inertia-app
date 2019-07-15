import React, { Component } from 'react'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts'
import { transpileModule } from 'typescript';

const ReturnBar = ({data, isFilterNull}) => {    
    // const data = [
    //     {
    //       "name": "STOCK",
    //       "return": 0.08
    //     },
    //     {
    //       "name": "BOND",
    //       "return": 0.03
    //     },
    //     {
    //       "name": "TOTAL",
    //       "return": 0.07
    //     }
    // ]
    console.log(`isFilterNull: ${isFilterNull}`)
    // console.log(JSON.stringify(data, null, 4))
    const filteredData = isFilterNull !== true ? data : data.filter( obj => obj.return !== null ? true : false)    
    return (
        <BarChart width={filteredData.length * 75} height={200} data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="return" fill="#8884d8" />        
        </BarChart>
    )
}

export default ReturnBar