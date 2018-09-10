import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { darkBarkground } from '../../styles/color';
import DetailView from '../../components/DetailView';
import PostPlaceholder from '../../components/DetailView/placeholder';

import { request } from '../../models/posts';
import { request as requestComments } from '../../models/comments';

import { PostRecord, ContentRecord, CommentRecord } from '../../types';

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
  navigation: any;
}

interface State extends PostRecord {
  comments: CommentRecord[];
  contents: ContentRecord[];
  loading: boolean;
}

export default class Post extends Component<Props, State> {
  static navigationOptions = ({ navigation }: Props) => ({
    title: navigation.state.params.subject,
    headerTintColor: 'white',
    headerRight: (
      <TouchableOpacity style={styles.headerIcon}>
        <Icon name="more-vert" size={20} color="white" />
      </TouchableOpacity>
    ),
    headerLeft: (
      <TouchableOpacity style={styles.headerIcon} onPress={() => { navigation.goBack(); }}>
        <Icon name="navigate-before" size={20} color="white" />
      </TouchableOpacity>
    ),
  });

  state = { prefix: '', boardId: '', id: '', subject: '', user: {}, comments: [], contents: [], loading: true };

  async componentDidMount() {
    const { params } = this.props.navigation.state;
    const { id, prefix, boardId } = params;
    const data = await request({ prefix, boardId, id });
    this.setState({ ...data, loading: false });
  }

  onRefresh = () => {
    const { params } = this.props.navigation.state;
    const { id, prefix, boardId } = params;
    this.setState({ loading: true });
    requestComments({ prefix, boardId, id }).then(comments => {
      this.setState({ comments, loading: false });
    });
  }

  render() {
    const { loading } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading ? (<PostPlaceholder />) : (<DetailView {...this.state} />)}
      </SafeAreaView>
    );
  }
}
