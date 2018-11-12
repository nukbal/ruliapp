import React, { Component } from 'react';
import { StyleSheet, SectionList, Text, TouchableHighlight } from 'react-native';
import { NavigationScreenProp, NavigationActions, StackActions, SafeAreaView } from 'react-navigation';
import { primary } from '../../styles/color';

import boardList from '../../config/BoardList';

interface Props {
  navigation: NavigationScreenProp<any>;
}

export default class Drawer extends Component<Props> {
  state = { current: null };

  shouldComponentUpdate() {
    return false;
  }

  onPressItem = ({ key, ...rest }: any) => {
    const { navigation } = this.props;
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Board', params: rest, key })
      ]
    });
    navigation.dispatch(resetAction);
  }

  renderItem = ({ item, index, section }: any) => {
    const onPress = () => this.onPressItem(item);
    return (
      <TouchableHighlight onPress={onPress} key={index}>
        <Text>{item.title}</Text>
      </TouchableHighlight>
    );
  }

  render() {
    const sections = [
      { title: '', data: boardList },
    ];
    return (
      <SafeAreaView>
        <SectionList
          sections={sections}
          renderItem={this.renderItem}
        />
      </SafeAreaView>
    );
  }
}
