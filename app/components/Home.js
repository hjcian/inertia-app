// @flow
import os from 'os'
import React, { Component } from 'react'
import { Message, Icon } from 'semantic-ui-react'

import OpenLink from './SubComponents/OpenLink'
import styles from './Home.css'
import version from '../constants/version.json'

const PlatformIcon = ({ platform }) => {
  const mapper = {
    'darwin': 'apple',
    'win32': 'windows',
    'linux': 'linux',
    'freebsd': 'freebsd'
  }
  const iconName = mapper[platform] || 'tv'
  return (
    <Icon name={iconName} />
  )
}

const Home = () => {
  const mainFeaturtes = [
    'IMPORT transaction data from Firstrade',
    'CALCULATE returns',
    'help you to REBALANCE your portfolio'
  ]

  return (
    <div className={styles.container} data-tid='container'>
      <h1>About inertIA</h1>
      <Message>
        <Message.Header>Main features</Message.Header>
        <Message.List items={mainFeaturtes} />
      </Message>
      <Message>
        <Message.Header>More details</Message.Header>
        <Message.List>
          <Message.Item><OpenLink href='https://hjcian.github.io/inertia-app-doc/' text='inertIA online document' /></Message.Item>
          <Message.Item><OpenLink href='https://github.com/hjcian/inertia-app' text='inertIA app source code' /></Message.Item>
        </Message.List>
      </Message>

      <Message>
        <Message.Header>Version info</Message.Header>
        <Message.Content>
          <Icon name='dollar' /> inertIA: {version.version}<br />
          <Icon name='js' /> Electron: {process.versions['electron']}<br />
          <Icon name='chrome' /> Chrome: {process.versions['chrome']}<br />
          <Icon name='node js' /> Node: {process.versions['node']}<br />
          <Icon name='google' /> V8: {process.versions['v8']}<br />
          <PlatformIcon platform={os.platform()} /> OS: {`${os.type()} ${os.release()}`}<br />
        </Message.Content>
      </Message>
    </div>
  )
}

export default Home
