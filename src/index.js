import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { StackNavigator, addNavigationHelpers } from 'react-navigation';
import {
  createReduxBoundAddListener,
} from 'react-navigation-redux-helpers';

import MainRouter from './containers';

const addListener = createReduxBoundAddListener("root");

export class RootRouter extends PureComponent {
  render() {
    const { dispatch, router } = this.props;
    return (
      <MainRouter
        navigation={addNavigationHelpers({ dispatch, state: router, addListener })}
      />);
  }
}

function mapStateToProps(state) {
  return {
    router: state.router,
  };
}

export default connect(mapStateToProps)(RootRouter);
