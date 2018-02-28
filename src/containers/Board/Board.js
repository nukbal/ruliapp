import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { SafeAreaView } from 'react-navigation';
import { StyleSheet, FlatList, StatusBar } from 'react-native';

import BoardItem from '../../components/BoardItem';
import { getBoardList, requestBoardList, getBoardInfo } from '../../store/ducks/boards';
import { darkBarkground, background, titleText, border } from '../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkBarkground,
    alignItems: 'center',
    justifyContent: 'center',
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
    const { prefix, boardId } = this.props;
    this.props.requestBoard(prefix, boardId);
  }

  pressItem = (id, title) => {
    const { navigate } = this.props.navigation;
    navigate('Detail', { id, board: this.props.info, title });
  }

  renderItem = ({ item }) => {
    return (
      <BoardItem {...item} onPress={this.pressItem} />
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.props.list}
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
