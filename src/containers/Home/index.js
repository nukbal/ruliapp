import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { getBoardList } from '../../store/ducks/boards';

export class Home extends PureComponent {
  static defaultProps = {
    list: [],
  }

  componentWillMount() {

  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity>
        <View style={styles.container}>
          <Text>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    console.log(this.props.list);
    return (
      <SafeAreaView>
        <FlatList
          data={this.props.list}
          renderItem={this.renderItem}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function mapStateToProps(state) {
  return {
    list: getBoardList(state),
  };
}

export default connect(mapStateToProps)(Home);
