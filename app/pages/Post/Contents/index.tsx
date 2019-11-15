import React from 'react';
import { StyleSheet } from 'react-native';

import Text from 'app/components/Text';

import ShareCard from './ShareCard';
import LazyImage from './LazyImage';
import LazyVideo from './LazyVideo';
import Link from './Link';

export const styles = StyleSheet.create({
  media: {
    height: 200,
    marginTop: 6,
    marginBottom: 6,
  },
  text: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default function ContentItem({ type, content, url }: ContentRecord & { url: string; }) {
  if (!type || !content) return null;

  switch (type) {
    case 'reference': {
      return <Link label="출처: " to={content} />;
    }
    case 'object': {
      return (
        <ShareCard uri={content} />
      );
    }
    case 'image': {
      return (
        <LazyImage source={{ uri: content, headers: { referer: url } }} />
      );
    }
    case 'video': {
      return (
        <LazyVideo source={{ uri: content }} />
      );
    }
    default: {
      return <Text style={[styles.text]}>{content}</Text>;
    }
  }
}
