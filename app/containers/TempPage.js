// @flow
// import React, { Component } from 'react';
import { connect } from 'react-redux'
import Temp from '../components/Temp';

// type Props = {};

// export default class TempPage extends Component<Props> {
//   props: Props;

//   render() {
//     return <Temp />;
//   }
// }
export default connect()(Temp)