import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { listItem, primary } from '../../styles/color';

import LazyImage from '../LazyImage';

const styles = StyleSheet.create({
  container: {
    backgroundColor: listItem,
    padding: 3,
    margin: 0,
  },
  text: {
    marginBottom: 6,
    color: 'white',
    justifyContent: 'flex-start',
  },
});

export default class ContentItem extends PureComponent {
  getElement = () => {
    const { type, content } = this.props;
    if (type === 'embeded') {
      return <Text style={styles.text}>{content}</Text>;
    } else if (type === 'image') {
      return <LazyImage source={{ uri: content }} fitScreen />
    } else {
      return <Text style={styles.text}>{content}</Text>;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.getElement()}
      </View>
    );
  }
}
