// @flow
import React, { Component, useState } from 'react'
import CSVReader from 'react-csv-reader'

import { parseCSV, isCSVFormatValid } from '../utils/firstrade'

import styles from './Import.css'

import { dataStore } from '../utils/store'
import dump from '../utils/dump.json'

const Import = ({}) => {
  const [isValidFormat, setFormatIsValid] = useState(null)  
  function handleParsedData(data) {
    if ( !isCSVFormatValid(data) ){
      console.log("invalid format")
      setFormatIsValid(false)      
    }
    else {
      setFormatIsValid(true)
      console.log("valid format")
      const firstradeRecordContainer = parseCSV(data)
      dataStore.save(firstradeRecordContainer)
    }
  } 
  function _getData() {
    handleParsedData(dump)
  }

  return (
    <div className={styles.container} data-tid='container'>
      <h1>Import data</h1>
      <CSVReader
        cssClass={styles.csvReaderInput}
        label="Select CSV with secret Death Star statistics"
        onFileLoaded={handleParsedData}
        inputId="ObiWan"
        inputStyle={{color: 'red'}}
      />
      <button onClick={_getData}>
        get data
      </button>
    </div>      
  )
}

export default Import