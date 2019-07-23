// @flow
import React, { Component } from 'react';
import routes from '../constants/routes'
import { Link } from 'react-router-dom'

import styles from './MainVisual.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faFileImport,
  faChartPie,
  faChartLine,
  faBalanceScale,
  faCaretLeft,
} from '@fortawesome/free-solid-svg-icons'


const sideNav = [
  {
    url: routes.Home,
    icon: faHome,
    text: "Home"
  },
  {
    url: routes.Import,
    icon: faFileImport,
    text: "Importing"
  },
  {
    url: routes.Portfolio,
    icon: faChartPie,
    text: "Portfolio"
  },
  {
    url: routes.Returns,
    icon: faChartLine,
    text: "Returns"
  },
  {
    url: routes.Rebalance,
    icon: faBalanceScale,
    text: "Rebalancing"
  },
]
export default class MainVisual extends Component {
  render() {
    const { mainWin, referer } = this.props
    const refererSideNav = sideNav.map((obj)=>{
      return {...obj, clicked: obj.url === referer ? true: false}
    })
    return (
      <div className={styles.entireWindow}>
        <div className={styles.sideNav}>
          {
            refererSideNav.map( ({url, icon, text, clicked}, idx) => {
              return (
                <Link 
                  className={clicked ? styles.sideNavItemClicked: styles.sideNavItem} 
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
        <div className={styles.mainWindow}>
          {mainWin}
        </div>
      </div>
    )
  }
}
