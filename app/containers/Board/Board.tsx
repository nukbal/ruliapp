import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { SafeAreaView } from 'react-navigation';
import { StyleSheet, FlatList, StatusBar, RefreshControl, ListRenderItemInfo, View, Text } from 'react-native';

import SearchBar from '../../components/SearchBar';
import BoardItem from '../../components/BoardItem';
import { getBoardList, getBoardInfo, isBoardLoading, Actions } from '../../store/ducks/boards';
import { darkBarkground } from '../../styles/color';

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
  empty: {
    flex: 1,
    backgroundColor: darkBarkground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#dedede',
    fontSize: 16,
  }
});

const EmptyState = (
  <View style={styles.empty}>
    <Text style={styles.emptyText}>Empty</Text>
  </View>
);

interface Props extends ReturnType<typeof getBoardInfo> {
  navigation: any;
  request: typeof Actions.request;
  list: string[];
  refreshing: boolean;
}

export class Board extends PureComponent<Props> {
  static navigationOptions = ({ navigation }: Props) => {
    const title = navigation.getParam('title');
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
    const prefix = getParam('prefix');
    const boardId = getParam('boardId');
    if (prefix) {
      this.props.request(prefix, boardId, { page: 1 });
    }
  }

  pressItem = (params: LinkType & { subject: string }) => {
    const { navigate } = this.props.navigation;
    navigate({ routeName: 'Post', params });
  }

  renderItem = ({ item }: ListRenderItemInfo<string>) => {
    if (!item) return null;
    return (
      <BoardItem
        onPress={this.pressItem}
        id={item}
      />
    );
  }

  onEndReached = () => {
    const { prefix, request, boardId, params } = this.props;
    if (prefix) {
      request(prefix, boardId, { ...params, page: 1 }, true);
    }
  }

  onRefresh = () => {
    const { prefix, boardId, request } = this.props;
    if (prefix) {
      request(prefix, boardId, { page: 1 }, true);
    }
  }

  onSearch = (value: string) => {
    const { prefix, boardId, request } = this.props;
    if (prefix && boardId && value) {
      request(prefix, boardId, { page: 1, keyword: value });
    }
  }

  keyExtractor = (item: string, index: number) => item;

  render() {
    const { list, refreshing } = this.props;
    if (list.length === 0 && !refreshing) {
      return EmptyState;
    }
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={list}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          ListHeaderComponent={<SearchBar onSubmit={this.onSearch} />}
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
  const { boardId, prefix, title, params } = getBoardInfo(state);
  return {
    boardId,
    prefix,
    title,
    params,
    list: getBoardList(state),
    refreshing: isBoardLoading(state),
  };
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Board);
