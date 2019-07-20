// @flow
import React, { Component, Fragment } from 'react'
import { Message } from 'semantic-ui-react'

import OpenLink from './SubComponents/OpenLink'

import styles from './Home.css'

const Home = () => {
    const mainFeaturtes = [
    '匯入歷史交易資料',
    '計算年化投資報酬率',
    '遠端取得前日收盤價',
    '再平衡計算'
  ]  
  return (
    <div className={styles.container} data-tid="container">
      <Message>
        <Message.Header>About InertIA</Message.Header>
        <p> 這是一個提供給指數化投資人使用的小工具。主要功能包含： </p>
        <Message.List items={mainFeaturtes} />
      </Message>
      <Message color='brown'>
        <Message.Header>External Resources</Message.Header>
          <Message.List>
            <Message.Item><OpenLink href='https://iexcloud.io/' text='IEX Cloud | Financial Data Infrastructure' /></Message.Item>
          </Message.List>
      </Message>
    </div>
  )
}

export default Home