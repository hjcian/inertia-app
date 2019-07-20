import React, { Component } from 'react'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts'
import { transpileModule } from 'typescript';

const ReturnBar = ({data, isFilterNull}) => {    
    // const data = [
    //     {
    //       "name": "STOCK",
    //       "return": 0.08
    //     },    
    // ]
    const filteredData = isFilterNull !== true ? data : data.filter( obj => obj.return !== null ? true : false)    
    return (
        <BarChart 
        width={filteredData.length * 100} 
        height={250} 
        data={filteredData}>
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