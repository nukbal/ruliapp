import React, { PureComponent } from 'react';
import { StyleSheet, ScrollView, TouchableWithoutFeedback, View, Text } from 'react-native';
import { NavigationActions, SafeAreaView } from 'react-navigation';
import * as List from '../../config/BoardList';

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
  onPressBoard = (config: any) => () => {
    const { title, ...params } = config;
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Board', params: { title, ...params }})
      ]
    });
    // @ts-ignore
    this.props.navigation.dispatch(resetAction);
  }

  renderList = (key: string) => {
    console.log(key);
    // @ts-ignore
    const board = List[key];
    return (
      <TouchableWithoutFeedback key={key} onPress={this.onPressBoard(board)}>
        <View style={styles.listItem}>
          <Text>{board.title}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.wrapper}>
        <ScrollView>
          {Object.keys(List).map(this.renderList)}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
