// @flow
import React, { Component, useState, useCallback } from 'react'
import { Message, Icon } from 'semantic-ui-react'
import csv from 'csv-parser'
import fs from 'fs'
import {useDropzone} from 'react-dropzone'

import PortfolioPie from './Charts/PortfolioPie'
import OpenLink from './SubComponents/OpenLink'
import { parseCSV, isCSVFormatValid } from '../utils/firstrade'
import { dataStore, fileStore } from '../utils/store'
import dump from '../utils/dump.json'

import styles from './Import.css'
import { type } from 'os';

const Dropzone = ({isDataReady, setIsDataReady}) => {
  const [isFormatValid, setIsFormatValid] = useState(isDataReady)
  const [errorMsg, setErrorMsg] = useState('')
  const onDrop = useCallback(acceptedFiles => {
    const buffer = []
    console.log(`number of file: ${acceptedFiles.length}`)
    try {
      acceptedFiles.forEach( val => {
        const { name, path } = val
        fs.createReadStream(val.path)
          .pipe(csv())
          .on('data', (data) => buffer.push(data))
          .on('end', () => {
            if (!isCSVFormatValid(buffer)) {
              setErrorMsg(`Invalid CSV format, try another file agian.`)
              setIsFormatValid(false)
            } else {
              const dataContainer = parseCSV(buffer)
              dataStore.save(dataContainer)
              setIsFormatValid(true)
              setIsDataReady(true)
              fileStore.save(path, name, data)              
            }
          })      
        })      
    } catch (error) {
      setErrorMsg(`Unexpected error, try another file agian. (console: ${error})`)
      setIsFormatValid(false)
    }
    }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  return (
    <div className={
      isFormatValid === null ? 
      styles.dropZone : 
      ( isFormatValid === true ? styles.dropZoneOk : styles.dropZoneError )} 
        {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive === true ? 
          <p className={styles.dropZoneText}>
              <Icon color='grey' name='hand spock outline'/> Drop the file to import...
          </p> 
        : (
          isFormatValid === null ?
          <p className={styles.dropZoneText}>
            <Icon color='grey' name='upload'/> Drop file or click here to import
          </p> : (isFormatValid === true ? 
            <p className={styles.dropZoneOkText}>
              <Icon color='grey' name='check circle outline'/> Click here to re-import
            </p> :
            <p className={styles.dropZoneErrorText}>
              <Icon color='red' name='ban'/> {errorMsg}
            </p>
          )
        )
      }
    </div>
  )
}

export default class Import extends Component {
  state = {
    isDataReady: fileStore.isReady
  }  
  setIsDataReady = (state) => {
    this.setState({isDataReady: state})
  }
  render () {
    const { isDataReady } = this.state
    const { data } = dataStore
    return (
      <div className={styles.importBody} data-tid='container'>
        <Message>
          <Message.Header>Import Data</Message.Header>
          <Message.Content>Import your historical transaction with CSV format.</Message.Content>
        </Message>
        <Dropzone isDataReady={isDataReady} setIsDataReady={this.setIsDataReady} />
        {
          data &&
          <PortfolioPie           
            assetArray={data.getSummary()}
            />
        }
      </div>      
    )
  }
}
