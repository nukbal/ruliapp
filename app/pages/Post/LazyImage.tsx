import React, { memo, useState, useMemo, useCallback, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  LayoutChangeEvent,
  ActivityIndicator,
  ImageSourcePropType,
} from 'react-native';
import Image, { OnLoadEvent, OnProgressEvent } from 'react-native-fast-image';
import ThemeContext from '../../ThemeContext';

const styles = StyleSheet.create({
  ImageContent: {
    flex: 1,
    width: '100%',
    marginTop: 6,
    marginBottom: 6,
    padding: 0,
    backgroundColor: 'rgba(100,100,100,0.25)',
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
  source: ImageSourcePropType;
  showing?: boolean;
}

export function setImageHeight(image: { width: number, height: number }, screenWidth: number) {
  const width = screenWidth;
  const ratio = width / image.width;
  const height = image.height * ratio;
  return height || 200;
}

function LazyImage({ source, showing }: Props) {
  const { theme } = useContext(ThemeContext);
  const [error, setError] = useState<string | null>(null);
  const [screenWidth, setScreenWidth] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [ready, setReady] = useState(false);
  const [percent, setPercent] = useState(0);

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => setScreenWidth(nativeEvent.layout.width);
  const onLoad = ({ nativeEvent }: OnLoadEvent) => {
    setSize(nativeEvent);
    setReady(true);
  };
  const onError = () => setError('이미지 로딩에 실패하였습니다.');
  const height = useMemo(() => setImageHeight(size, screenWidth), [size, screenWidth]);
  const onProgress = useCallback(
    ({ nativeEvent }: OnProgressEvent) => setPercent(Math.round((nativeEvent.loaded / nativeEvent.total) * 100)),
    [],
  );

  const textStyle = { color: theme.primary };

  return (
    <View
      style={[styles.ImageContent, { height }]}
      onLayout={onLayout}
    >
      {error && (
        <View style={styles.message}>
          <Text style={textStyle}>불러오기 실패</Text>
          <Text style={textStyle}>{error}</Text>
        </View>
      )}
      {!ready && (
        <View style={styles.message}>
          <ActivityIndicator color={theme.primary} />
          <Text style={textStyle}>{percent}</Text>
        </View>
      )}
      {showing && (
        <Image
          style={{ height }}
          // @ts-ignore
          source={source}
          onLoad={onLoad}
          onProgress={onProgress}
          onError={onError}
        />
      )}
    </View>
  );
}

function isEqual(prev: Props, next: Props) {
  return (
    // @ts-ignore
    prev.source.uri === next.source.uri
    && prev.showing === next.showing
  );
}

export default memo(LazyImage, isEqual);
