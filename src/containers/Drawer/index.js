import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableWithoutFeedback } from 'react-native';
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
    const { title, params } = config;
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Board', params: { title, ...params }})
      ]
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <SafeAreaView style={styles.wrapper}>
        <ScrollView>
          {Object.keys(BoardList).map(key => (
            <TouchableWithoutFeedback key={key} onPress={this.onPressBoard(BoardList[key])}>
              <View style={styles.listItem}>
                <Text>{BoardList[key].title}</Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
