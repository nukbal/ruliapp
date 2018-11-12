import React, { Component } from 'react';
import { NavigationScreenProp, SafeAreaView } from 'react-navigation';
import {
  StyleSheet,
  FlatList,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  View,
  ListRenderItemInfo,
} from 'react-native';

import SearchBar from '../../components/SearchBar';
import BoardItem from '../../components/BoardItem';
import itemStyles from '../../components/BoardItem/styles';
import { darkBarkground } from '../../styles/color';
import { request } from '../../models/boards';
import Placeholder from './placeholder';

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
  }
});

const AppendLoading = (
  <View style={[itemStyles.container, { alignItems: 'center' }]}>
    <ActivityIndicator />
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
    const title = navigation.getParam('title', 'Ruliapp');
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
      const nextPage = this.params.page + 1;
      request({
        prefix: this.prefix,
        boardId: this.boardId,
        params: { ...this.params, page: nextPage }
      }).then((data) => {
        this.params.page = nextPage;
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
    const { pushing, init, appending } = this.state;
    if (!this.records.length || init) {
      return <Placeholder />;
    }
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.records}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          ListEmptyComponent={<Placeholder />}
          ListHeaderComponent={<SearchBar onSubmit={this.onSearch} />}
          refreshControl={
            <RefreshControl
              colors={["#9Bd35A", "#689F38"]}
              refreshing={pushing}
              onRefresh={this.onRefresh}
            />
          }
          ListFooterComponent={appending ? AppendLoading : undefined}
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
