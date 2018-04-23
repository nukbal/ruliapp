import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { SafeAreaView } from 'react-navigation';
import { StyleSheet, FlatList, StatusBar, View, Button } from 'react-native';

import FullLoading from '../../components/FullLoading';
import SearchBar from '../../components/SearchBar';
import BoardItem from '../../components/BoardItem';
import { getBoardList, requestBoardList, getBoardInfo, isBoardLoading, updateBoardList } from '../../store/ducks/boards';
import { darkBarkground, background, titleText, border, primary } from '../../styles/color';

import BoardList from '../../config/BoardList';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkBarkground,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  infoPanel: {
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export class Board extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam('title', BoardList.BestHumorBoard.title);
    return {
      title: title || '',
    };
  };

  static defaultProps = {
    list: [],
    refreshing: false,
  }

  componentDidMount() {
    this.requestList();
  }

  requestList = (page = 1) => {
    const { getParam } = this.props.navigation;
    const params = BoardList.BestHumorBoard.params;
    const prefix = getParam('prefix', params.prefix);
    const boardId = getParam('boardId', params.boardId);
    if (page >= 1) {
      this.props.requestBoard(prefix, boardId, page);
    }
  }

  pressItem = (id, title, prefix, boardId) => {
    const { navigate } = this.props.navigation;
    navigate('Detail', { id, board: { prefix, boardId }, title });
  }

  renderItem = (row) => {
    const { item } = row;
    return (
      <BoardItem
        onPress={this.pressItem}
        {...item}
      />
    );
  }

  onEndReached = () => {
    const { info, refreshing } = this.props;
    const { prefix, boardId, page } = info;
    if (!refreshing) {
      this.props.updateBoard(prefix, boardId, page + 1);
    }
  }

  onRefresh = () => {
    this.element.scrollToIndex({ index: 0, viewOffset: 0 });
    this.requestList();
  }

  onSearch = (value) => {

  }

  element = null

  render() {
    const { list, info, refreshing } = this.props;
    const header = refreshing ? null : (<SearchBar />);
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          ref={(ref) => { this.element = ref; }}
          data={list}
          renderItem={this.renderItem}
          ListHeaderComponent={header}
          ListEmptyComponent={(<FullLoading />)}
          refreshing={refreshing}
          onRefresh={this.onRefresh}
          getItemLayout={(data, index) => (
            {length: 75, offset: 75 * index, index}
          )}
          initialNumToRender={10}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          removeClippedSubviews
        />
        <StatusBar barStyle="light-content" />
      </SafeAreaView>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    requestBoard: bindActionCreators(requestBoardList, dispatch),
    updateBoard: bindActionCreators(updateBoardList, dispatch),
  };
}

function mapStateToProps(state) {
  return {
    info: getBoardInfo(state),
    list: getBoardList(state),
    refreshing: isBoardLoading(state),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
