import React from 'react';
import { StyleSheet } from 'react-native';

import Text from 'app/components/Text';

import ShareCard from 'app/components/ShareCard';
import LazyImage from 'app/components/LazyImage';
import LazyVideo from 'app/components/LazyVideo';
import Link from 'app/components/Link';

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

export default function ContentItem({ type, content }: ContentRecord) {
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
        <LazyImage source={{ uri: content }} />
      );
    }
    case 'video': {
      return (
        <LazyVideo source={{ uri: content }} />
      );
    }
    case 'link': {
      return <Link to={content} />;
    }
    default: {
      return <Text style={[styles.text]}>{content}</Text>;
    }
  }
}
