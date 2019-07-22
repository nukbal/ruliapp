import React, { memo, useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  LayoutChangeEvent,
  ActivityIndicator,
} from 'react-native';
import Image, { OnLoadEvent, OnProgressEvent } from 'react-native-fast-image';

const styles = StyleSheet.create({
  ImageContent: {
    flex: 1,
    marginTop: 6,
    marginBottom: 6,
    backgroundColor: 'rgba(100,100,100,0.25)',
  },
  text: {
    color: 'orange',
  },
  message: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface Props {
  source: { uri: string };
}

export function setImageHeight(image: { width: number, height: number }, screenWidth: number) {
  const width = screenWidth;
  const ratio = width / image.width;
  // eslint-disable-next-line no-bitwise
  const height = image.height * ratio;
  return height || 200;
}

function LazyImage({ source }: Props) {
  const [error, setError] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [ready, setReady] = useState(false);
  const [percent, setPercent] = useState(0);

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => setScreenWidth(nativeEvent.layout.width);
  const onLoad = ({ nativeEvent }: OnLoadEvent) => setSize(nativeEvent);
  const onLoadEnd = () => setReady(true);
  const onError = () => setError(true);

  const onProgress = ({ nativeEvent }: OnProgressEvent) => setPercent(~~((nativeEvent.loaded / nativeEvent.total) * 100));
  const height = useMemo(() => setImageHeight(size, screenWidth), [size, screenWidth]);

  return (
    <View style={styles.ImageContent}>
      {error && <Text style={styles.text}>불러오기 실패</Text>}
      {!ready && (
        <View style={styles.message}>
          <ActivityIndicator />
          <Text style={styles.text}>{percent}</Text>
        </View>
      )}
      <Image
        style={{ height }}
        source={source}
        onLayout={onLayout}
        onLoad={onLoad}
        onLoadEnd={onLoadEnd}
        onError={onError}
        onProgress={onProgress}
      />
    </View>
  );
}

function isEqual(prev: Props, next: Props) {
  return (
    prev.source.uri === next.source.uri
  );
}

export default memo(LazyImage, isEqual);
