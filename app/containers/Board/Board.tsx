import React, { Component } from 'react';

import { SafeAreaView, NavigationScreenProp } from 'react-navigation';
import {
  StyleSheet,
  FlatList,
  StatusBar,
  RefreshControl,
  ListRenderItemInfo,
  View,
  Text,
} from 'react-native';

import SearchBar from '../../components/SearchBar';
import BoardItem from '../../components/BoardItem';
import { darkBarkground } from '../../styles/color';
import { request } from '../../models/boards';

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

interface Props {
  navigation: NavigationScreenProp<any, { prefix: string, boardId: string, title: string }>;
}

interface State {
  init: boolean;
  pushing: boolean;
  appending: boolean;
}

export default class Board extends Component<Props, State> {
  static navigationOptions = ({ navigation }: Props) => {
    const title = navigation.getParam('title', 'BEST - 일반유머');
    return {
      title: title || '',
    };
  };
  
  state = { init: true, pushing: true, appending: false };
  prefix: string | undefined;
  boardId: string | undefined;
  params: any = { page: 1 };
  records: PostRecord[] = [];

  async componentDidMount() {
    const { getParam } = this.props.navigation;
    this.prefix = getParam('prefix', 'best/humor');
    this.boardId = getParam('boardId');
    if (this.prefix) {
      const data = await request({
        prefix: this.prefix,
        boardId: this.boardId,
        params: { page: 1 },
      });
      this.requestHandler(data);
    }
  }

  shouldComponentUpdate(_: Props, state: State) {
    return state.init !== this.state.init ||
      state.pushing !== this.state.pushing ||
      state.appending !== this.state.appending;
  }
  
  componentWillUnmount() {
    this.prefix = undefined;
    this.boardId = undefined;
    this.params = undefined;
    this.records = [];
  }

  pressItem = ({ id, boardId, prefix, subject }: PostRecord) => {
    const { navigate } = this.props.navigation;
    navigate({ routeName: 'Post', params: { id, boardId, prefix, subject } });
  }

  renderItem = ({ item, separators }: ListRenderItemInfo<PostRecord>) => {
    if (!item) return null;
    return (
      <BoardItem
        onPress={() => this.pressItem(item)}
        onShowUnderlay={separators.highlight}
        onHideUnderlay={separators.unhighlight}
        {...item}
      />
    );
  }

  requestHandler = (data: any) => {
    if (data) this.records = data.posts;
    this.setState({ init: false, pushing: false, appending: false });
  }

  onEndReached = () => {
    if (this.prefix && !this.state.appending) {
      this.setState({ appending: true });
      request({
        prefix: this.prefix,
        boardId: this.boardId,
        params: { ...this.params, page: this.params.page + 1 }
      }).then((data) => {
        this.params.page = this.params.page + 1;
        this.requestHandler(data);
      });
    }
  }

  onRefresh = () => {
    if (this.prefix && !this.state.pushing) {
      this.setState({ pushing: true });
      request({
        prefix: this.prefix,
        boardId: this.boardId,
        params: { ...this.params, page: 1 }
      }).then(this.requestHandler);
    }
  }

  onSearch = (keyword: string) => {
    if (this.prefix && !this.state.pushing && keyword) {
      this.setState({ pushing: true });
      request({
        prefix: this.prefix,
        boardId: this.boardId,
        params: { ...this.params, page: 1, keyword }
      }).then(this.requestHandler);
    }
  }

  keyExtractor = (item: PostRecord, i: number) => item.key;
  getItemLayout = (_: any, index: number) => ({ length: 75, offset: 75 * index, index })

  render() {
    const { pushing, init } = this.state;
    if (!this.records.length || init) {
      return EmptyState;
    }
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.records}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          ListHeaderComponent={<SearchBar onSubmit={this.onSearch} />}
          refreshControl={
            <RefreshControl
              colors={["#9Bd35A", "#689F38"]}
              refreshing={pushing}
              onRefresh={this.onRefresh}
            />
          }
          getItemLayout={this.getItemLayout}
          initialNumToRender={8}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0}
        />
        <StatusBar barStyle="light-content" />
      </SafeAreaView>
    );
  }
}
