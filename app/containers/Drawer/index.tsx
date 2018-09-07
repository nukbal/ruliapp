import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View, Text } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { primary } from '../../styles/color';

import boardList from '../../config/BoardList';
import { DrawerItems } from 'react-navigation';

const styles = StyleSheet.create({
  header: {
    flex: 1,
    padding: 16,
    height: 63,
    justifyContent: 'center',
    backgroundColor: primary,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listWrapper: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 18,
    paddingLeft: 18,
  }
});

function ParentItem({ label, onPress }: { label: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.listWrapper} onPress={onPress}>
      <View style={styles.listItem}>
        <Text>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default class Drawer extends Component {

  shouldComponentUpdate() {
    return false;
  }

  onPressItem = ({ focused, route }) => {
    if (focused) return;

    const { key, ...rest } = route;
    const { navigation } = this.props;
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Board', params: rest, key })
      ]
    });
    navigation.dispatch(resetAction);
    // navigation.navigate({ index: 0, routeName: 'Board', params: rest, key, type: 'ReplaceCurrentScreen' });
    navigation.closeDrawer();
  }

  getLabel = ({ route }) => {
    return route.title;
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.header}><Text>Ruliweb</Text></View>
        <DrawerItems
          items={boardList}
          getLabel={this.getLabel}
          renderIcon={() => null}
          onItemPress={this.onPressItem}
        />
      </ScrollView>
    );
  }
}
