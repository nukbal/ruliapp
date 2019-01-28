import React, { Component } from 'react';
import { StyleSheet, SectionList, Text, TouchableHighlight, View } from 'react-native';
import { NavigationScreenProp, NavigationActions, StackActions, SafeAreaView } from 'react-navigation';
import { primary } from '../../styles/color';

import boardList from '../../config/BoardList';

const styles = StyleSheet.create({
  container: {
    height: 45,
    flex: 1,
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: 'baseline',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: primary,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 15,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  }
});

interface Props {
  navigation: NavigationScreenProp<any>;
}

export default class Drawer extends Component<Props> {
  state = { current: null };

  shouldComponentUpdate() {
    return false;
  }

  onPressItem = ({ key, title }: any) => {
    const { navigation } = this.props;
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Board', params: { title, key }, key })
      ]
    });
    navigation.dispatch(resetAction);
  }

  renderItem = ({ item, index, section }: any) => {
    const onPress = () => this.onPressItem(item);
    return (
      <TouchableHighlight
        style={styles.container}
        onPress={onPress}
        key={index}
        underlayColor="#1A70DC"
      >
        <Text>{item.title}</Text>
      </TouchableHighlight>
    );
  }

  render() {
    const sections = [
      { title: '', data: boardList },
    ];
    return (
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.headerText}>게시판</Text>
        </View>
        <SectionList
          sections={sections}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
