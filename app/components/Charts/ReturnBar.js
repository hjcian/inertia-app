import React, { Component } from 'react'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Cell } from 'recharts'
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
          <YAxis unit='%' />
          <Tooltip />
          <Bar dataKey="return">
            {
              filteredData.map((entry, index) => {
                const color = entry.return >= 0 ? '#0b7285' : '#ff8787'
                return (                
                  <Cell key={`cell-${index}`} fill={color}/>
                )
              })
            }
          </Bar>
        </BarChart>
    )
}

export default ReturnBar