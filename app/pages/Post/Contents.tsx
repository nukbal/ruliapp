import React, { useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import WebView from 'react-native-webview';
import LazyImage from './LazyImage';
import LazyVideo from './LazyVideo';
import ThemeContext from '../../ThemeContext';

export const styles = StyleSheet.create({
  media: {
    height: 200,
    marginTop: 6,
    marginBottom: 6,
  },
  text: {
    lineHeight: 21,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
});

function Content({ children }: { children: string }) {
  const { theme } = useContext(ThemeContext);
  return <Text style={[styles.text, { color: theme.text }]}>{children}</Text>
}

export default function ContentItem({ type, content }: ContentRecord) {
  if (!type || !content) return null;

  switch (type) {
    case 'reference': {
      return <Content>{`출처: ${content}`}</Content>;
    }
    case 'object': {
      return (
        <WebView
          // @ts-ignore
          source={{ uri: content }}
          style={styles.media}
          javaScriptEnabled
        />
      );
    }
    case 'image': {
      return (
        <LazyImage source={{ uri: content }} />
      );
    }
    case 'video': {
      return (
        <LazyVideo uri={content} />
      );
    }
    default: {
      return <Content>{content}</Content>;
    }
  }
}
