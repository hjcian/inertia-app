// @flow
import React, { Component, useState } from 'react'
import { Message } from 'semantic-ui-react'
import CSVReader from 'react-csv-reader'

import PortfolioPie from './Charts/PortfolioPie'
import OpenLink from './SubComponents/OpenLink'
import { parseCSV, isCSVFormatValid } from '../utils/firstrade'
import { dataStore } from '../utils/store'
import dump from '../utils/dump.json'

import styles from './Import.css'

const Import = ({}) => {
  const [isValidFormat, setFormatIsValid] = useState(null)  
  function handleParsedData(data) {
    if ( !isCSVFormatValid(data) ){
      setFormatIsValid(false)      
    }
    else {
      setFormatIsValid(true)
      const firstradeRecordContainer = parseCSV(data)
      dataStore.save(firstradeRecordContainer)
    }
  } 
  function _getData() {
    handleParsedData(dump)
  }
  const { data } = dataStore
  return (
    <div className={styles.importBody} data-tid='container'>
      <Message>
        <Message.Header>Import Data</Message.Header>
        <Message.Content>匯入歷史交易資料。目前支援的資料來源：</Message.Content>
        <Message.List>
          <Message.Item><OpenLink text='第一證券(Firstrade Securities Inc.)' href='https://www.firstrade.com'/></Message.Item>
        </Message.List>
      </Message>
      <CSVReader
        cssClass={styles.csvReaderInput}
        onFileLoaded={handleParsedData}
        inputId="ObiWan"
        inputStyle={{color: 'black'}}
      />
      <button onClick={_getData}>
        get data
      </button>
      {
        data &&
        <PortfolioPie assetArray={data.getSummary()}/>
      }
    </div>      
  )
}

export default Import