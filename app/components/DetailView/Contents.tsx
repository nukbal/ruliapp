import React, { Component, PureComponent } from 'react';
import { View, Text, StyleSheet, WebView } from 'react-native';
import { listItem } from '../../styles/color';
import LazyImage from '../LazyImage';

export const styles = StyleSheet.create({
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
});

function renderContent({ type, content }: ContentRecord) {
  if (!type || !content) return null;

  switch (type) {
    case 'reference': {
      return <Text style={styles.text}>출처: {content}</Text>;
    }
    case 'object': {
      return (
        <WebView
          // @ts-ignore
          source={{ uri: content }}
          javaScriptEnabled
        />
      );
    }
    case 'image': {
      return <LazyImage source={{ uri: content }} />;
    }
    default: {
      return <Text style={styles.text}>{content}</Text>;
    }
  }
}


export default class ContentItem extends PureComponent<ContentRecord> {
  render() {
    const Content = renderContent(this.props);
    return <View style={styles.container}>{Content}</View>
  }
}

