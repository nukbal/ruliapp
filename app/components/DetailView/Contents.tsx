import React, { PureComponent } from 'react';
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

export default function renderContent({ type, content }: ContentRecord) {
  if (!type || !content) return null;

  switch (type) {
    case 'reference': {
      return <Text style={[styles.container, styles.text]}>출처: {content}</Text>;
    }
    case 'object': {
      return (
        <WebView
          style={[styles.container]}
          // @ts-ignore
          source={{ uri: content }}
          javaScriptEnabled
        />
      );
    }
    case 'image': {
      // @ts-ignore
      return <LazyImage source={{ uri: content }} fitScreen />;
    }
    case 'block': {
      if (Array.isArray(content)) {
        const values = []
        for (let i = 0, len = content.length; i < len; i += 1) {
          const item = renderContent(content[i]);
          if(item) values.push(item);
        }
        return <View style={styles.container}>{values}</View>;
      }
    }
    default: {
      return <Text style={styles.text}>{content}</Text>;
    }
  }
  return null;
}
