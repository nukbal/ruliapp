import React, { PureComponent } from 'react';
import { Text, StyleSheet, WebView } from 'react-native';
import { listItem } from '../../styles/color';
import LazyImage from '../LazyImage';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: listItem,
    paddingHorizontal: 16,
    paddingVertical: 4,
    margin: 0,
  },
  text: {
    color: 'black',
    lineHeight: 21,
    justifyContent: 'flex-start',
  },
  media: {
    height: 200,
  }
});

export default function ContentItem({ type, content }: ContentRecord) {
  if (!type || !content) return null;

  switch (type) {
    case 'reference': {
      return <Text style={[styles.container, styles.text]}>출처: {content}</Text>;
    }
    case 'object': {
      return (
        <WebView
          // @ts-ignore
          source={{ uri: content }}
          style={[styles.container, styles.media]}
          javaScriptEnabled
        />
      );
    }
    case 'image': {
      return <LazyImage source={{ uri: content }} style={styles.container} />;
    }
    default: {
      return <Text style={[styles.container, styles.text]}>{content}</Text>;
    }
  }
}

