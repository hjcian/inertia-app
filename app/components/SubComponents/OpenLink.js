import { shell } from 'electron'
import React, { Component } from 'react'

const OpenLink = ({href, text}) => {
    const handleClick = (e) => {
      e.preventDefault()            
      shell.openExternal(href)
    }
    return (
        <a onClick={handleClick}>{text}</a>
    )
}

export default OpenLink