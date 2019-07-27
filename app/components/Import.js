// @flow
import React, { Component, useState, useCallback } from 'react'
import { Message } from 'semantic-ui-react'
import CSVReader from 'react-csv-reader'
import {useDropzone} from 'react-dropzone'


import PortfolioPie from './Charts/PortfolioPie'
import OpenLink from './SubComponents/OpenLink'
import { parseCSV, isCSVFormatValid } from '../utils/firstrade'
import { dataStore } from '../utils/store'
import dump from '../utils/dump.json'

import styles from './Import.css'

const Dropzone = () => {
  
  const [isFileImported, setIsFileImported] = useState(null)
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    acceptedFiles.forEach( val => {
      console.log(val.name)
      console.log(val.path)
      setIsFileImported(true)
    })
  }, [])
  const { getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  console.log("out", isFileImported)

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isFileImported ?
        <p>Re-import file agian</p>:
        <p>Drop the file here ...</p>
      }
    </div>
  )
}


const Import = ({}) => {
  const [isValidFormat, setFormatIsValid] = useState(null)
  const [errMessage, setErrMessage] = useState(null)
  function handleParsedData(data) {
    if ( !isCSVFormatValid(data) ){
      setFormatIsValid(false)
      setErrMessage("Not a supported format, please check online document for more details.")
    }
    else {
      setFormatIsValid(true)
      const firstradeRecordContainer = parseCSV(data)
      dataStore.save(firstradeRecordContainer)
    }
  } 
  function handleError(error) {
    console.log(error)
  }
  function onDrop(files) {
    files.forEach(file => {
      console.log(file.name, file)
    })
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
      <Dropzone/>
      {/* <CSVReader
        cssClass={styles.csvReader}
        cssInputClass={styles.csvReaderInput}
        onFileLoaded={handleParsedData}
        onError={handleError}
        inputId="ObiWan"
        inputStyle={{color: 'black'}}
      /> */}
      { 
        // isValidFormat === false && 
        1 && 
        <div className={styles.inputErrorMsg}> 
          <Message 
            warning
            icon='warning sign'
            header='Format not sopprted'
            content={errMessage}
            size='mini'
          />
        </div>
      }
      {
        data &&
        <PortfolioPie           
          assetArray={data.getSummary()}
          />
      }
    </div>      
  )
}

export default Import