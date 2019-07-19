// @flow
import React, { Component } from 'react';
import Rebalance from '../components/Rebalance';

import MainVisual from './MainVisual'

type Props = {};

export default class RebalancePage extends Component<Props> {
  props: Props;

  render() {
    return (
      <MainVisual mainWin={<Rebalance />} />
    )
  }
}
