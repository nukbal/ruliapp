import React, { Component } from 'react';
import { SafeAreaView, NavigationScreenProp } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { darkBarkground } from '../../styles/color';
import DetailView from '../../components/DetailView';
import PostPlaceholder from '../../components/DetailView/placeholder';

import { request } from '../../models/posts';
import { request as requestComments } from '../../models/comments';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkBarkground,
    justifyContent: 'flex-start',
  },
  headerIcon: {
    paddingRight: 12,
    paddingLeft: 12,
    marginRight: 8,
  }
});

interface Props {
  navigation: NavigationScreenProp<any, { prefix: string, boardId: string, id: string, subject: string }>;
}

interface State {
  init: boolean;
  loading: boolean;
}

export default class Post extends Component<Props, State> {
  static navigationOptions = ({ navigation }: Props) => ({
    title: navigation.state.params.subject,
    headerTintColor: 'white',
    headerRight: (
      <TouchableOpacity style={styles.headerIcon}>
        <Icon name="more-vert" size={24} color="white" />
      </TouchableOpacity>
    ),
    headerLeft: (
      <TouchableOpacity style={styles.headerIcon} onPress={() => { navigation.goBack(); }}>
        <Icon name="navigate-before" size={24} color="white" />
      </TouchableOpacity>
    ),
  });

  state = { init: true, loading: false };
  data: PostRecord | undefined;

  async componentDidMount() {
    const { params } = this.props.navigation.state;
    const { id, prefix, boardId } = params;
    this.data = await request({ prefix, boardId, id });
    if (this.data) {
      this.setState({ init: false, loading: false });
    } else {
      this.props.navigation.goBack();
    }
  }

  shouldComponentUpdate(_: Props, state: State) {
    return state.init !== this.state.init ||
      state.loading !== this.state.loading;
  }
  
  componentWillUnmount() {
    this.data = undefined;
  }

  onRefresh = () => {
    const { params } = this.props.navigation.state;
    const { id, prefix, boardId } = params;
    if (this.data && !this.state.loading && !this.state.init) {
      this.setState({ loading: true });
      requestComments({ prefix, boardId, id }).then(comments => {
        this.setState({ loading: false });
      });
    }
  }

  render() {
    const { loading, init } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {
          (init || !this.data) ?
          <PostPlaceholder /> :
          <DetailView data={this.data} onRefresh={this.onRefresh} loading={loading} />
        }
      </SafeAreaView>
    );
  }
}
