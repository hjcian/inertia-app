// @flow
import React, { Component } from 'react'
import { Input, Message, Checkbox, Label } from 'semantic-ui-react'

import { dataStore } from '../utils/store'

import styles from './Counter.css'

export default class Rebalance extends Component<Props> {
  props: Props;
  
  render() {
    return (
      <div>
        <Message>
          <Message.Header>Rebalance Simulator</Message.Header>
          <Message.Content>為維持投資組合的比例，計算各部位應購入的金額或股數。</Message.Content>
        </Message>
        <div className='adjustBar'>
          <Checkbox toggle/>
          {' VT '}
          {' 80% '}
          <Input type='range'></Input>
          {' 12 '}
          {' 12345 '}
          

        </div>
      </div>
    )
  }
}