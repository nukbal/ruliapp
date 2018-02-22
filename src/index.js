import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { StackNavigator, addNavigationHelpers } from 'react-navigation';

import { isFullLoading } from './store/ducks/loading';
import { requestBoardList } from './store/ducks/boards';

import MainRouter from './containers';
import FullLoading from './components/FullLoading';

export class RootRouter extends PureComponent {
  componentDidMount() {
    this.props.loadInitBoard('news', '1004');
  }

  render() {
    const { isFullLoading } = this.props;
    return isFullLoading ? (<FullLoading />) : (<MainRouter />);
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadInitBoard: bindActionCreators(requestBoardList, dispatch),
  };
}

function mapStateToProps(state) {
  return {
    isFullLoading: isFullLoading(state),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RootRouter);
