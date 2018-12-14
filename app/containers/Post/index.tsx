import React, { PureComponent } from 'react';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import { SafeAreaView, NavigationScreenProp } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { darkBarkground } from '../../styles/color';
import DetailView from '../../components/DetailView';
import PostPlaceholder from '../../components/DetailView/placeholder';
import { Actions, getPostRecordsByKey, isPostLoading, isCommentLoading } from '../../stores/posts';

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
  data: PostRecord;
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
    const { params } = this.props.navigation.state;
    this.props.request(params);
  }

  onRefresh = () => {
    const { params } = this.props.navigation.state;
    if (!this.props.commentLoading) {
      this.props.requestComment(params);
    }
  }

  render() {
    const { data, loading, commentLoading } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        {
          (loading || !data || !data.contents) ?
          <PostPlaceholder /> :
          <DetailView data={data} onRefresh={this.onRefresh} loading={commentLoading} />
        }
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: any, props: Props) {
  let data = undefined;

  if (props.navigation.state.params) {
    const { parent, key } = props.navigation.state.params;
    // @ts-ignore
    data = getPostRecordsByKey(parent, key)(state);
  }

  return {
    data,
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
