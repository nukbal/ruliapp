import React, { Component } from 'react';
import { bindActionCreators, AnyAction, Dispatch } from 'redux';
import { connect } from 'react-redux';
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
import { Actions } from '../../stores/boards';
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
  navigation: NavigationScreenProp<any, { title: string, key: string }>;
  request: typeof Actions.request;
  update: typeof Actions.update;
  records: any[];
}

interface State {
  init: boolean;
  pushing: boolean;
  appending: boolean;
}

export class Board extends Component<Props, State> {
  static navigationOptions = ({ navigation }: Props) => {
    const title = navigation.getParam('title', 'Ruliapp');
    return {
      title: title || '',
    };
  };
  
  state = { init: true, pushing: true, appending: false };

  componentDidMount() {
    const { getParam } = this.props.navigation;
    const key = getParam('key');
    if (key) {
      this.props.request(key);
    }
  }

  shouldComponentUpdate(_: Props, state: State) {
    return state.init !== this.state.init ||
      state.pushing !== this.state.pushing ||
      state.appending !== this.state.appending;
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
    this.setState({ init: false, pushing: false, appending: false });
  }

  onEndReached = () => {
    if (!this.state.appending) {
      this.setState({ appending: true });
    }
  }

  onRefresh = () => {
    if (!this.state.pushing) {
      this.setState({ pushing: true });
    }
  }

  onSearch = (keyword: string) => {
    if (!this.state.pushing && keyword) {
      this.setState({ pushing: true });
    }
  }

  keyExtractor = (item: PostRecord, i: number) => item.key;
  getItemLayout = (_: any, index: number) => ({ length: 75, offset: 75 * index, index })

  render() {
    const { pushing, init, appending } = this.state;
    const { records } = this.props;
    if (init) {
      return <Placeholder />;
    }
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={records}
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

function mapStateToProps(state: any) {
  return {
    records: [],
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    request: bindActionCreators(Actions.request, dispatch),
    update: bindActionCreators(Actions.update, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
