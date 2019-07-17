// @flow
import React, { Component } from 'react';
import Home from '../components/Home';

import MainVisual from './MainVisual'

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  render() {
    return (
      <MainVisual mainWin={<Home />} />
    )
  }
}
