import React from 'react';
import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import WebView from 'react-native-webview';
import LazyImage from './LazyImage';
import LazyVideo from './LazyVideo';

export const styles = StyleSheet.create({
  media: {
    height: 200,
  },
});
const Container = styled.View`
  background-color: ${({ theme }) => theme.background};
  padding-top: 16;
  padding-bottom: 16;
  padding-left: 4;
  padding-right: 4;
`;
const Txt = styled.Text`
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  line-height: 21;
`;

export default function ContentItem({ type, content }: ContentRecord) {
  if (!type || !content) return null;

  switch (type) {
    case 'reference': {
      return <Txt>{`출처: ${content}`}</Txt>;
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
        <Container>
          <LazyImage source={{ uri: content }} />
        </Container>
      );
    }
    case 'video': {
      return (
        <Container>
          <LazyVideo uri={content} />
        </Container>
      );
    }
    default: {
      return <Txt>{content}</Txt>;
    }
  }
}
