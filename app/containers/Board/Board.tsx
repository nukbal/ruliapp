import React, { PureComponent, createRef} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { SafeAreaView } from 'react-navigation';
import { StyleSheet, FlatList, StatusBar, RefreshControl, ListRenderItemInfo } from 'react-native';

import SearchBar from '../../components/SearchBar';
import BoardItem from '../../components/BoardItem';
import { getBoardList, getBoardInfo, isBoardLoading, Actions } from '../../store/ducks/boards';
import { darkBarkground } from '../../styles/color';

import { BestBoard } from '../../config/BoardList';

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

interface Props {
  navigation: any;
  request: typeof Actions.request;
  info: ReturnType<typeof getBoardInfo>;
  list: BoardRecord[];
  refreshing: boolean;
}

export class Board extends PureComponent<Props> {
  static navigationOptions = ({ navigation }: Props) => {
    const title = navigation.getParam('title', BestBoard.title);
    return {
      title: title || '',
    };
  };

  static defaultProps = {
    refreshing: false,
    list: [],
  }

  componentDidMount() {
    const { getParam } = this.props.navigation;
    const prefix = getParam('prefix', BestBoard.prefix);
    const boardId = getParam('boardId');
    if (prefix) {
      this.props.request(prefix, boardId, { page: 1 });
    }
  }

  pressItem = ({ id, subject, prefix, boardId }: LinkType & { subject: string }) => {
    const { navigate } = this.props.navigation;
    navigate('Detail', { id, board: { prefix, boardId }, subject });
  }

  renderItem = (row: ListRenderItemInfo<BoardRecord>) => {
    return (
      <BoardItem
        onPress={this.pressItem}
        {...row.item}
      />
    );
  }

  onEndReached = () => {
    const { list, info } = this.props;
    if (list.filter(({ id }) => id).length > 0 && info.params) {
      this.updateList(info.params.page + 1, true);
    }
  }

  onRefresh = () => {
    if (this.element.current) {
      this.element.current.scrollToIndex({ index: 0, viewOffset: 0 });
      this.updateList(1, false);
    }
  }

  onSearch = (value: string) => {
    const { info, request } = this.props;
    const { prefix, boardId } = info;
    if (prefix && boardId && value) {
      request(prefix, boardId, { page: 1, keyword: value });
    }
  }

  updateList = (page: number, isEnd: boolean) => {
    const { info, refreshing, request } = this.props;
    const { prefix, boardId } = info;
    if (!refreshing && prefix && boardId) {
      request(prefix, boardId, { page }, true);
    }
  }

  element = createRef<FlatList<any>>();

  render() {
    const { list, refreshing } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          ref={this.element}
          data={list}
          renderItem={this.renderItem}
          // ListHeaderComponent={<SearchBar onSubmit={this.onSearch} />}
          refreshControl={
            <RefreshControl
              colors={["#9Bd35A", "#689F38"]}
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
          getItemLayout={(_, index) => (
            {length: 75, offset: 75 * index, index}
          )}
          initialNumToRender={10}
          // onEndReached={this.onEndReached}
          // onEndReachedThreshold={0.5}
          removeClippedSubviews
        />
        <StatusBar barStyle="light-content" />
      </SafeAreaView>
    );
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    request: bindActionCreators(Actions.request, dispatch),
  };
}

function mapStateToProps(state: AppState) {
  return {
    info: getBoardInfo(state),
    list: getBoardList(state),
    refreshing: isBoardLoading(state),
  };
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Board);
