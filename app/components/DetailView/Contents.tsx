import React from 'react';
import { Text, StyleSheet, WebView, View } from 'react-native';
import Video from 'react-native-video';
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
        <View style={styles.container}>
          <WebView
            // @ts-ignore
            source={{ uri: content }}
            style={styles.media}
            javaScriptEnabled
          />
        </View>
      );
    }
    case 'image': {
      return (
        <View style={styles.container}>
          <LazyImage source={{ uri: content }} />
        </View>
      );
    }
    case 'video': {
      return (
        <Video
          source={{ uri: content }}
          style={[styles.container, styles.media]}
          ignoreSilentSwitch="obey"
          muted
          repeat
        />
      );
    }
    default: {
      return <Text style={[styles.container, styles.text]}>{content}</Text>;
    }
  }
}

