import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { requestDetail, getDetailInfo, updateComment } from '../../store/ducks/detail';
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

export class Detail extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
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

  static defaultProps = {
    contents: [],
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    const { prefix, boardId } = params.board;
    this.props.request(prefix, boardId, params.id);
  }

  onRefresh = () => {
    const { prefix, boardId, articleId } = this.props;
    this.props.updateComment(prefix, boardId, articleId);
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

function mapStateToProps(state) {
  return getDetailInfo(state);
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
