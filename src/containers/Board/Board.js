import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { SafeAreaView } from 'react-navigation';
import { StyleSheet, FlatList, StatusBar, View, Button } from 'react-native';

import BoardItem from '../../components/BoardItem';
import { getBoardList, requestBoardList, getBoardInfo } from '../../store/ducks/boards';
import { darkBarkground, background, titleText, border } from '../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkBarkground,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  infoPanel: {
    flexDirection: 'row',
  },
});

export class Board extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params ? navigation.state.params.title : ''}`,
   });

  static defaultProps = {
    list: [],
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

  render() {
    const { list, info } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.infoPanel}>
          <Button onPress={() => this.requestList(info.page - 1)} title="Prev" />
          <Button onPress={() => this.requestList(info.page + 1)} title="Next" />
          <Button onPress={() => this.requestList(info.page)} title="Refresh" />
        </View>
        <FlatList
          data={list}
          renderItem={this.renderItem}
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
