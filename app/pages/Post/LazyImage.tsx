import React, { memo, useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  LayoutChangeEvent,
} from 'react-native';
import Image, { OnLoadEvent } from 'react-native-fast-image';

const styles = StyleSheet.create({
  ImageContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
});

interface Props {
  source: { uri: string };
  style?: any;
}

export function setImageSize(image: { width: number, height: number }, screenWidth: number) {
  const width = screenWidth;
  const ratio = width / image.width;
  // eslint-disable-next-line no-bitwise
  const height = ~~(image.height * ratio);
  return { width, height };
}


function LazyImage({ source, style }: Props) {
  const [error, setError] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [percent, setPercent] = useState(0);
  const [uri, setUri] = useState<string | undefined>();

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setScreenWidth(nativeEvent.layout.width);
  }, []);

  const imageSize = useMemo(() => setImageSize(size, screenWidth), [size, screenWidth]);

  const onLoad = ({ nativeEvent }: OnLoadEvent) => {
    setSize(nativeEvent);
  };

  if (error) {
    return (
      <View style={styles.ImageContent}>
        <Text>불러오기 실패</Text>
      </View>
    );
  }
  if (!(screenWidth > 0 && uri && size.width)) {
    return (
      <View
        style={[styles.ImageContent, style, { backgroundColor: '#ededed' }]}
        onLayout={onLayout}
      >
        <ActivityIndicator />
        {percent ? (<Text>{percent || '0'}</Text>) : null}
      </View>
    );
  }
  return (
    <Image
      style={[styles.ImageContent, style, imageSize]}
      source={{ uri }}
      resizeMode="cover"
      onLoad={onLoad}
    />
  );
}

function isEqual(prev: Props, next: Props) {
  return (
    prev.source.uri === next.source.uri
  );
}

export default memo(LazyImage, isEqual);
