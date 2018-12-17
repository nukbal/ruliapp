import React, { PureComponent } from 'react';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import { NavigationScreenProp } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { darkBarkground } from '../../styles/color';
import DetailView from '../../components/DetailView';
import PostPlaceholder from '../../components/DetailView/placeholder';
import {
  Actions,
  getPostContents,
  getPostComments,
  getPostMeta,
  isPostLoading,
  isCommentLoading,
} from '../../stores/posts';

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
  navigation: NavigationScreenProp<any, { url: string, parent: string, key: string, subject: string }>;
  contents: ContentRecord[];
  comments: CommentRecord[];
  meta: {
    commentSize: number;
    views: number;
    likes: number;
    dislikes: number;
    url: string;
    date: Date;
  };
  request: typeof Actions.request;
  requestComment: typeof Actions.requestComment;
  loading: boolean;
  commentLoading: boolean;
}

interface State {
  init: boolean;
  loading: boolean;
}

export class Post extends PureComponent<Props, State> {
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

  componentDidMount() {
    const { navigation } = this.props;
    const { params } = navigation.state;
    if (params) {
      this.props.request(params);
    }
  }

  onRefresh = () => {
    const { params } = this.props.navigation.state;
    if (!this.props.commentLoading) {
      this.props.requestComment(params);
    }
  }

  render() {
    const { contents, comments, loading, commentLoading } = this.props;
    return (
      <View style={styles.container}>
        {
          (loading) ?
          <PostPlaceholder /> :
          <DetailView
            subject={this.props.navigation.state.params.subject}
            contents={contents}
            comments={comments}
            onRefresh={this.onRefresh}
            loading={commentLoading}
            {...this.props.meta}
          />
        }
      </View>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    comments: getPostComments(state),
    contents: getPostContents(state),
    meta: getPostMeta(state),
    loading: isPostLoading(state),
    commentLoading: isCommentLoading(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return {
    request: bindActionCreators(Actions.request, dispatch),
    requestComment: bindActionCreators(Actions.requestComment, dispatch),
  };
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Post);
