// @flow
import React, { Component } from 'react';
import Returns from '../components/Returns';

import MainVisual from './MainVisual'

type Props = {};

export default class ReturnsPage extends Component<Props> {
  props: Props;

  render() {
    return (
      <MainVisual mainWin={<Returns />} />
    )
  }
}
