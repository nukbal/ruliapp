import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ShareCard from './ShareCard';
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
    lineHeight: 26,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
});

function Content({ children }: { children: string }) {
  const { theme } = useContext(ThemeContext);
  return <Text style={[styles.text, { color: theme.text }]}>{children}</Text>;
}

export function ContentRow({ row }: { row: ContentRecord[] }) {
  return (
    <View>
      {row.map((item) => <Content key={item.key}>{item.content}</Content>)}
    </View>
  );
}

export default function ContentItem({ type, content, url, viewable }: ContentRecord & { url: string; viewable: boolean }) {
  if (!type || !content) return null;

  switch (type) {
    case 'reference': {
      return <Content>{`출처: ${content}`}</Content>;
    }
    case 'object': {
      return (
        <ShareCard uri={content} />
      );
    }
    case 'image': {
      return (
        <LazyImage source={{ uri: content, headers: { referer: url } }} viewable={viewable} />
      );
    }
    case 'video': {
      return (
        <LazyVideo source={{ uri: content, headers: { referer: url } }} viewable={viewable} />
      );
    }
    default: {
      return <Content>{content}</Content>;
    }
  }
}
