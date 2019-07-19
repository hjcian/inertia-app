// @flow
import React, { Component } from 'react';
import Portfolio from '../components/Portfolio';

import MainVisual from './MainVisual'

type Props = {};

export default class PortfolioPage extends Component<Props> {
  props: Props;

  render() {
    return (
      <MainVisual mainWin={<Portfolio />} />
    )
  }
}
