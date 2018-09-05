import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import * as List from '../../config/BoardList';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
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

export default class Drawer extends PureComponent {
  onPressBoard = (key: string, config: any) => () => {
    const { navigation } = this.props;
    navigation.navigate({ routeName: 'Board', params: config, key: key });
    navigation.closeDrawer();
  }

  renderList = (key: string) => {
    // @ts-ignore
    const board = List[key];
    return (
      <TouchableOpacity key={key} style={styles.listWrapper} onPress={this.onPressBoard(key, board)}>
        <View style={styles.listItem}>
          <Text>{board.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.wrapper}>
        {Object.keys(List).map(this.renderList)}
      </SafeAreaView>
    );
  }
}
