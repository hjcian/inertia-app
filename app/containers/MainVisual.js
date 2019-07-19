// @flow
import React, { Component } from 'react';
import routes from '../constants/routes'
import { Link } from 'react-router-dom'

import styles from './WindowTemplate.css'

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
    return (
      <div className={styles.entireWindow}>
        <div className={styles.sideNav}>
        <div className={styles.sideNavItems}>
            <Link to={routes.HOME}>
              <FontAwesomeIcon  fixedWidth icon={faHome} color='#e7f5ff' size='2x' />
            </Link>
          </div>
          <div className={styles.sideNavItems}>
            <Link to={routes.IMPORT}>
              <FontAwesomeIcon  fixedWidth icon={faFileImport} color='#e7f5ff' size='2x' />
            </Link>
          </div>
          <div className={styles.sideNavItems}>
            <Link to={routes.Portfolio}>
              <FontAwesomeIcon fixedWidth icon={faChartPie} color='#e7f5ff' size='2x' />
            </Link>
          </div>
          <div className={styles.sideNavItems}>
            <Link to={routes.Returns}>
              <FontAwesomeIcon fixedWidth icon={faChartLine} color='#e7f5ff' size='2x' />
            </Link>
          </div>
          <div className={styles.sideNavItems}>
            <Link to={routes.Rebalance}>
              <FontAwesomeIcon fixedWidth icon={faBalanceScale} color='#e7f5ff' size='2x' />
            </Link>
          </div>
        </div>
        <div className={styles.mainWindow}>
          {mainWin}
        </div>
      </div>
    )
  }
}
