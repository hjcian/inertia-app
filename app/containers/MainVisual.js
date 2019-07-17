// @flow
import React, { Component } from 'react';
import routes from '../constants/routes'
import { Link } from 'react-router-dom'

import styles from './WindowTemplate.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileImport,
  faChartPie,
  faChartBar,
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
            <Link to={routes.a}>
              <FontAwesomeIcon  fixedWidth icon={faFileImport} color='#e7f5ff' size='2x' />
            </Link>
          </div>
          <div className={styles.sideNavItems}>
            <Link to={routes.a}>
              <FontAwesomeIcon fixedWidth icon={faChartPie} color='#e7f5ff' size='2x' />
            </Link>
          </div>
          <div className={styles.sideNavItems}>
            <Link to={routes.a}>
              <FontAwesomeIcon fixedWidth icon={faChartBar} color='#e7f5ff' size='2x' />
            </Link>
          </div>
          <div className={styles.sideNavItems}>
            <Link to={routes.a}>
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
