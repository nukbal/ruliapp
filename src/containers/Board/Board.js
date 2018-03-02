import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { SafeAreaView } from 'react-navigation';
import { StyleSheet, FlatList, StatusBar, View, Button } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import FullLoading from '../../components/FullLoading';
import BoardItem from '../../components/BoardItem';
import { getBoardList, requestBoardList, getBoardInfo, isBoardLoading } from '../../store/ducks/boards';
import { darkBarkground, background, titleText, border, primary } from '../../styles/color';

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
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params ? navigation.state.params.title : ''}`,
   });

  static defaultProps = {
    list: [],
    refreshing: false,
  }

  componentWillReceiveProps(props) {
    if (this.props.info.title !== props.info.title) {
      this.props.navigation.setParams({ title: props.info.title });
    }
  }

  componentWillMount() {
    this.requestList();
  }

  requestList = (page = 1) => {
    const { prefix, boardId } = this.props;
    if (page >= 1) {
      this.props.requestBoard(prefix, boardId, page);
    }
  }

  pressItem = (id, title, prefix, boardId) => {
    const { navigate } = this.props.navigation;
    navigate('Detail', { id, board: { prefix, boardId }, title });
  }

  renderItem = ({ item }) => {
    return (
      <BoardItem {...item} onPress={this.pressItem} />
    );
  }

  onRefresh = () => {
    this.requestList(this.props.info.page);
  }

  prevPage = () => {
    this.requestList(this.props.info.page - 1);
  }

  nextPage = () => {
    this.requestList(this.props.info.page + 1);
  }

  render() {
    const { list, info, refreshing } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={list}
          renderItem={this.renderItem}
          ListEmptyComponent={(<View style={{ flex: 1 }}><FullLoading /></View>)}
          ListHeaderComponent={(
            <View style={styles.infoPanel}>
              <Ionicons name="ios-arrow-back" size={25} color={primary} onPress={this.prevPage} />
              <Ionicons name="ios-arrow-forward" size={25} color={primary} onPress={this.nextPage} />
            </View>
          )}
          refreshing={refreshing}
          onRefresh={this.onRefresh}
          getItemLayout={(data, index) => (
            {length: 54, offset: 54 * index, index}
          )}
          onEndReachedThreshold={30}
          initialNumToRender={10}
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
