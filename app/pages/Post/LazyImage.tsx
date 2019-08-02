import React, { memo, useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  LayoutChangeEvent,
  ActivityIndicator,
  Image,
  ImageLoadEventData,
  NativeSyntheticEvent,
  PixelRatio,
  Platform,
} from 'react-native';

const styles = StyleSheet.create({
  ImageContent: {
    flex: 1,
    width: '100%',
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
  const onLoad = ({ nativeEvent }: NativeSyntheticEvent<ImageLoadEventData>) => {
    setSize({
      width: PixelRatio.getPixelSizeForLayoutSize(nativeEvent.source.width),
      height: PixelRatio.getPixelSizeForLayoutSize(nativeEvent.source.height),
    });
    setReady(true);
  };
  const onError = () => setError(true);
  const height = useMemo(() => setImageHeight(size, screenWidth), [size, screenWidth]);
  const onProgress = useCallback(({ nativeEvent }: any) => setPercent(Math.round(nativeEvent.loaded / nativeEvent.total)), []);

  return (
    <View style={styles.ImageContent} onLayout={onLayout}>
      {error && <View style={styles.message}><Text style={styles.text}>불러오기 실패</Text></View>}
      {!ready && (
        <View style={styles.message}>
          <ActivityIndicator />
          {Platform.OS === 'ios' && (<Text style={styles.text}>{percent}</Text>)}
        </View>
      )}
      <Image
        style={{ height }}
        source={source}
        onLoad={onLoad}
        onProgress={onProgress}
        onError={onError}
        progressiveRenderingEnabled
        resizeMethod="auto"
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
