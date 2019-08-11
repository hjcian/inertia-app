// @flow
import React, { Component } from 'react'
import routes from '../constants/routes'
import { Link } from 'react-router-dom'

import styles from './MainVisual.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faFileImport,
  faChartLine,
  faBalanceScale
} from '@fortawesome/free-solid-svg-icons'

const sideNav = [
  {
    url: routes.Home,
    icon: faHome,
    text: 'Home'
  },
  {
    url: routes.Import,
    icon: faFileImport,
    text: 'Import'
  },
  {
    url: routes.Returns,
    icon: faChartLine,
    text: 'Calculate'
  },
  {
    url: routes.Rebalance,
    icon: faBalanceScale,
    text: 'Rebalance'
  }
]
export default class MainVisual extends Component {
  render () {
    const { mainWin, referer } = this.props
    const refererSideNav = sideNav.map((obj) => {
      return { ...obj, clicked: obj.url === referer }
    })
    return (
      <div className={styles.entireWindow}>
        <div className={styles.sideNav}>
          {
            refererSideNav.map(({ url, icon, text, clicked }, idx) => {
              return (
                <Link
                  key={idx}
                  className={clicked ? styles.sideNavItemClicked : styles.sideNavItem}
                  to={url}>
                  <div className={styles.sideNavIcon}>
                    <FontAwesomeIcon fixedWidth icon={icon} color='#e7f5ff' size='lg' />
                  </div>
                  <div className={styles.sideNavText}>
                    {text}
                  </div>
                </Link>
              )
            })
          }
        </div>
        <div className={styles.ghostSideNav} />
        <div className={styles.mainWindow}>
          {mainWin}
        </div>
      </div>
    )
  }
}
