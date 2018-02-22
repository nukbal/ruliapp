import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { getDetail, requestDetail } from '../../store/ducks/detail';

export class Home extends PureComponent {
  static defaultProps = {
    detail: {},
  }

  componentWillMount() {
    this.props.requestDetail();
  }

  render() {
    const { detail } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <View>
            <Text>{detail.title}</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function mapDispatchToProps(dispatch) {
  return {
    requestDetail: bindActionCreators(requestDetail, dispatch),
  };
}

function mapStateToProps(state) {
  return {
    detail: getDetail(state),
  };
}

export default connect(mapStateToProps)(Home);
