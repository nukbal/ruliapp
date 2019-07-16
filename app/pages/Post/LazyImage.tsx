import React, { memo, useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  LayoutChangeEvent,
} from 'react-native';
import Image, { OnLoadEvent } from 'react-native-fast-image';

const styles = StyleSheet.create({
  ImageContent: {
    flex: 1,
    marginTop: 6,
    marginBottom: 6,
    backgroundColor: 'rgba(100,100,100,0.25)',
  },
});

interface Props {
  source: { uri: string };
}

export function setImageHeight(image: { width: number, height: number }, screenWidth: number) {
  const width = screenWidth;
  const ratio = width / image.width;
  // eslint-disable-next-line no-bitwise
  const height = ~~(image.height * ratio);
  return height || 200;
}

function LazyImage({ source }: Props) {
  const [error, setError] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  // const [percent, setPercent] = useState(0);

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => setScreenWidth(nativeEvent.layout.width);
  const onLoad = ({ nativeEvent }: OnLoadEvent) => setSize(nativeEvent);
  const onError = () => setError(true);

  const height = useMemo(() => setImageHeight(size, screenWidth), [size, screenWidth]);

  if (error) {
    return (
      <View style={[styles.ImageContent, { height: 200, alignItems: 'center', justifyContent: 'center' }]}>
        <Text>불러오기 실패</Text>
        <Text>{source.uri}</Text>
      </View>
    );
  }
  return (
    <Image
      style={[styles.ImageContent, { height }]}
      source={source}
      resizeMode={Image.resizeMode.contain}
      onLayout={onLayout}
      onLoad={onLoad}
      onError={onError}
    />
  );
}

function isEqual(prev: Props, next: Props) {
  return (
    prev.source.uri === next.source.uri
  );
}

export default memo(LazyImage, isEqual);
