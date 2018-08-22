import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Actions, getDetailInfo } from '../../store/ducks/posts';
import { darkBarkground } from '../../styles/color';
import DetailView from '../../components/DetailView';

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
}

export class Detail extends PureComponent<Props> {
  static navigationOptions = ({ navigation }: Props) => ({
    title: `${navigation.state.params.title}`,
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

  componentDidMount() {
    const { params } = this.props.navigation.state;
    const { prefix, boardId } = params.board;
    this.props.request(prefix, boardId, params.id);
  }

  onRefresh = () => {
    const { prefix, boardId, articleId } = this.props;
    this.props.request(prefix, boardId, articleId, true);
  }

  render() {
    const { navigation, request, screenProps, updateComment, ...rest } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <DetailView {...rest} refresh={this.onRefresh} title={navigation.state.params.title} />
      </SafeAreaView>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    request: bindActionCreators(requestDetail, dispatch),
    updateComment: bindActionCreators(updateComment, dispatch),
  };
}

function mapStateToProps(state: AppState) {
  return getDetailInfo(state);
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
