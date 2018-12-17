import React, { Component } from 'react';
import { bindActionCreators, AnyAction, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { NavigationScreenProp } from 'react-navigation';
import {
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
  View,
  ListRenderItemInfo,
  Text,
} from 'react-native';

import SearchBar from '../../components/SearchBar';
import BoardItem from '../../components/BoardItem';
import itemStyles from '../../components/BoardItem/styles';
import { darkBarkground } from '../../styles/color';
import { Actions, getBoardList } from '../../stores/boards';
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
  records: PostRecord[];
}

interface State {
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
  constructor(props: Props) {
    super(props);
    if (props.navigation.state.params) {
      this.boardKey = props.navigation.state.params.key;
    }
  }
  
  boardKey = '';
  lastPage = 1;
  state = { pushing: false, appending: false };

  componentDidMount() {
    if (this.boardKey) {
      this.props.request(this.boardKey);
    }
  }

  shouldComponentUpdate(props: Props, state: State) {
    return state.pushing !== this.state.pushing ||
      state.appending !== this.state.appending ||
      this.props.records.length !== props.records.length;
  }

  pressItem = ({ url, parent, key, subject }: PostRecord) => {
    const { navigate } = this.props.navigation;
    navigate({ routeName: 'Post', params: { url, parent, key, subject } });
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

  onEndReached = () => {
    if (this.boardKey && !this.state.appending && this.props.records.length > 0) {
      this.setState({ appending: true });
      this.props.request(this.boardKey, { page: this.lastPage + 1 }, () => {
        this.lastPage = this.lastPage + 1;
        this.setState({ appending: false });
      });
    }
  }

  onRefresh = () => {
    if (this.boardKey && !this.state.pushing && this.props.records.length > 0) {
      this.setState({ pushing: true });
      this.props.request(this.boardKey, { page: 1 }, () => {
        this.setState({ pushing: false });
      });
    }
  }

  onSearch = (keyword: string) => {
    if (this.boardKey && !this.state.pushing && keyword) {
      this.setState({ pushing: true });
      this.props.request(this.boardKey, { keyword, page: 1 }, () => {
        this.setState({ pushing: false });
      });
    }
  }

  keyExtractor = (item: PostRecord, i: number) => item.key;
  getItemLayout = (_: any, index: number) => ({ length: 75, offset: 75 * index, index })

  render() {
    const { pushing, appending } = this.state;
    const { records } = this.props;

    if (!this.boardKey) {
      return (
        <View style={[styles.container, { alignItems: 'center' }]}>
          <Text>Please select board</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={records}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          ListEmptyComponent={<Placeholder />}
          ListHeaderComponent={<SearchBar onSubmit={this.onSearch} />}
          refreshing={pushing}
          onRefresh={this.onRefresh}
          ListFooterComponent={appending ? AppendLoading : undefined}
          getItemLayout={this.getItemLayout}
          initialNumToRender={8}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0}
        />
        <StatusBar barStyle="light-content" />
      </View>
    );
  }
}

function mapStateToProps(state: any, props: Props) {
  if (props.navigation.state.params) {
    return {
      records: getBoardList(props.navigation.state.params.key)(state),
    };
  }
  return {
    records: [],
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    request: bindActionCreators(Actions.request, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
