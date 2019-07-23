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
} from '@fortawesome/free-solid-svg-icons'

type Props = {};

export default class MainVisual extends Component<Props> {
  props: Props;

  render() {
    const { mainWin } = this.props
    const sideNav = [
      {
        url: routes.HOME,
        icon: faHome,
        text: "Home"
      },
      {
        url: routes.IMPORT,
        icon: faFileImport,
        text: "Import Data"
      },
      {
        url: routes.Portfolio,
        icon: faChartPie,
        text: "Portfolio Overview"
      },
      {
        url: routes.Returns,
        icon: faChartLine,
        text: "Calculate Returns"
      },
      {
        url: routes.Rebalance,
        icon: faBalanceScale,
        text: "Rebalancing"
      },
    ]

    return (
      <div className={styles.entireWindow}>
        <div className={styles.sideNav}>
          {
            sideNav.map( ({url, icon, text}) => {
              return (
                <div className={styles.sideNavItems}>
                  <Link to={url}>
                    <FontAwesomeIcon  fixedWidth icon={icon} color='#e7f5ff' size='lg' />
                    {text}
                  </Link>
                </div>
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
