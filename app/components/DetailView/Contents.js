import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, WebView } from 'react-native';

import { listItem, primary } from '../../styles/color';

import LazyImage from '../LazyImage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: listItem,
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 4,
    paddingBottom: 4,
    margin: 0,
  },
  text: {
    marginBottom: 6,
    color: 'black',
    lineHeight: 21,
    justifyContent: 'flex-start',
  },
  placeholder: {
    backgroundColor: '#EEEEEE',
    height: 16,
  },
  placeholderImage: {
    flex: 1,
    height: 200,
    backgroundColor: '#EEEEEE',
  },
});

export default class ContentItem extends PureComponent {
  getElement = () => {
    const { type, content } = this.props;
    if (type === 'placeholder') {
      return <View style={content === 'image' ? styles.placeholderImage : [styles.placeholder, { width: content }]} />
    }
    if (type === 'embed') {
      return <WebView style={styles.placeholderImage} source={{ uri: content }} javaScriptEnabled />;
    } else if (type === 'image') {
      return <LazyImage source={{ uri: content }} fitScreen />;
    } else {
      return <Text style={styles.text}>{content}</Text>;
    }
  }

  render() {
    const { style } = this.props;
    return (
      <View style={[styles.container, ...style]}>
        {this.getElement()}
      </View>
    );
  }
}
