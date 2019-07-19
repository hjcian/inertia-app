// @flow
import React, { Component } from 'react';
import Import from '../components/Import';

import MainVisual from './MainVisual'

type Props = {};

export default class ImportPage extends Component<Props> {
  props: Props;

  render() {
    return (
      <MainVisual mainWin={<Import />} />
    )
  }
}


// import { connect } from 'react-redux'

// export default connect(  
// )(Import)
