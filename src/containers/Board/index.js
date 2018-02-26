import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SafeAreaView, StackNavigator } from 'react-navigation';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { getBoardList, requestBoardList, getBoardInfo } from '../../store/ducks/boards';
import BoardItem from '../../components/BoardItem';
import DetailScreen from '../Detail';
import { darkBarkground, background, titleText, border } from '../../styles/color';

export class Board extends PureComponent {
  static defaultProps = {
    list: [],
  }

  componentWillMount() {
    this.props.requestBoard('news', '1004');
  }

  pressItem = (id) => {
    const { navigate } = this.props.navigation;
    navigate('Detail', { id, board: this.props.info });
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
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkBarkground,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

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

const BoardScreen = connect(mapStateToProps, mapDispatchToProps)(Board);

export default StackNavigator({
  Board: { screen: BoardScreen },
  Detail: { screen: DetailScreen },
}, {
  navigationOptions: {
    headerStyle: {
      backgroundColor: darkBarkground,
      borderBottomColor: border,
      borderBottomWidth: 1,
    },
    headerTitleStyle: {
      color: titleText,
    },
    cardStyle: {
      opacity: 1,
    },
  },
});
