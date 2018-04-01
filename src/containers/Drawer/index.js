import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { NavigationActions, SafeAreaView } from 'react-navigation';
import BoardList from '../../config/BoardList';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  listItem: {
    flex: 1,
    padding: 8,
  }
});

export default class Drawer extends PureComponent {
  onPressBoard = (config) => () => {
    const { replace } = NavigationActions;
    const { title, params } = config;
    this.props.navigation
      .dispatch(replace({ routeName: 'Main', params: { title, ...params }}));
  }

  render() {
    return (
      <SafeAreaView style={styles.wrapper}>
        <ScrollView>
          {Object.keys(BoardList).map(key => (
            <TouchableOpacity key={key} onPress={this.onPressBoard(BoardList[key])}>
              <View style={styles.listItem}>
                <Text>{BoardList[key].title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
