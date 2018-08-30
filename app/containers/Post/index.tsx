import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Actions, getPostInfo, getContents, isLoading } from '../../store/ducks/posts';
import { Actions as CommentAction, getComments } from '../../store/ducks/comments';
import { darkBarkground } from '../../styles/color';
import DetailView from '../../components/DetailView';
import PostPlaceholder from '../../components/DetailView/placeholder';

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
  request: typeof Actions.request;
  requestComment: typeof CommentAction.request;
  prefix: string;
  boardId: string;
  id: string;
  contents: ContentRecord[];
  comments: CommentRecord[];
  commentSize: number;
  loading: boolean;
}

export class Post extends PureComponent<Props> {
  static navigationOptions = ({ navigation }: Props) => ({
    title: navigation.state.params.subject,
    drawerLockMode: 'locked-closed',
    headerTintColor: 'white',
    headerRight: (
      <TouchableOpacity style={styles.headerIcon}>
        <FontAwesome name="ellipsis-v" size={20} color="white" />
      </TouchableOpacity>
    ),
    headerLeft: (
      <TouchableOpacity style={styles.headerIcon} onPress={() => { navigation.goBack(); }}>
        <FontAwesome name="chevron-left" size={20} color="white" />
      </TouchableOpacity>
    ),
   });

   static defaultProps = {
     contents: [],
   };

  componentDidMount() {
    const { params } = this.props.navigation.state;
    const { id, prefix, boardId } = params;
    this.props.request(prefix, boardId, id);
  }

  onRefresh = () => {
    const { prefix, boardId, id } = this.props;
    this.props.requestComment(prefix, boardId, id);
  }

  render() {
    const { loading, ...rest } = this.props;
    if (loading) {
      return (
        <SafeAreaView style={styles.container}>
          <PostPlaceholder />
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <DetailView
          {...rest}
          onRefresh={this.onRefresh}
        />
      </SafeAreaView>
    );
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    request: bindActionCreators(Actions.request, dispatch),
    requestComment: bindActionCreators(CommentAction.request, dispatch),
  };
}

function mapStateToProps(state: AppState) {
  const info = getPostInfo(state);
  return {
    contents: getContents(state),
    comments: getComments(state),
    loading: isLoading(state),
    ...info,
  };
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Post);
