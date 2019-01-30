import React, { PureComponent } from 'react';
import { View, Text, FlatList, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import styles from './styles';
import ImageCache from './ImageCache';

export default class Setting extends PureComponent {
  renderItem = ({  }: ListRenderItem<number>) => {

  }

  render() {
    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.headerText}>게시판</Text>
        </View>
        <ImageCache />
      </SafeAreaView>
    );
  }
}
