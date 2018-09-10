import React, { PureComponent } from 'react';

import { SafeAreaView } from 'react-navigation';
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
  navigation: any;
}

export default class Board extends PureComponent<Props> {
  static navigationOptions = ({ navigation }: Props) => {
    const title = navigation.getParam('title');
    return {
      title: title || '',
    };
  };
  
  state = { list: [], loading: true };
  prefix: string | undefined;
  boardId: string | undefined;
  params: any = { page: 1 };

  async componentDidMount() {
    const { getParam } = this.props.navigation;
    this.prefix = getParam('prefix');
    this.boardId = getParam('boardId');
    if (this.prefix) {
      this.setState({ loading: true });
      const data = await request({
        prefix: this.prefix,
        boardId: this.boardId,
        params: { page: 1 },
      });
      this.requestHandler(data);
    }
  }

  pressItem = ({ id, boardId, prefix }: PostRecord) => {
    const { navigate } = this.props.navigation;
    navigate({ routeName: 'Post', params: { id, boardId, prefix } });
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
    if (data) {
      const num = this.params.page;
      this.setState({ list: data.posts.slice(0, num * 30), loading: false });
    } else {
      this.setState({ loading: false });
    }
  }

  onEndReached = () => {
    if (this.prefix && !this.state.loading) {
      this.setState({ loading: true });
      request({
        prefix: this.prefix,
        boardId: this.boardId,
        params: { ...this.params, page: this.params.page + 1 }
      }).then(this.requestHandler);
    }
  }

  onRefresh = () => {
    if (this.prefix && !this.state.loading) {
      this.setState({ loading: true });
      request({
        prefix: this.prefix,
        boardId: this.boardId,
        params: { ...this.params, page: 1 }
      }).then(this.requestHandler);
    }
  }

  onSearch = (keyword: string) => {
    if (this.prefix && !this.state.loading && keyword) {
      this.setState({ loading: true });
      request({
        prefix: this.prefix,
        boardId: this.boardId,
        params: { ...this.params, page: 1, keyword }
      }).then(this.requestHandler);
    }
  }

  keyExtractor = (item: PostRecord, i: number) => item.key;

  render() {
    const { list, loading } = this.state;
    if (list.length === 0 && !loading) {
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
              refreshing={loading}
              onRefresh={this.onRefresh}
            />
          }
          getItemLayout={(_, index) => (
            {length: 75, offset: 75 * index, index}
          )}
          initialNumToRender={10}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
        />
        <StatusBar barStyle="light-content" />
      </SafeAreaView>
    );
  }
}
