import React, { memo, useState, useMemo, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  LayoutChangeEvent,
  ActivityIndicator,
  ImageSourcePropType,
  ImageLoadEventData,
  NativeSyntheticEvent,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
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
  viewable?: boolean;
}

export function setImageHeight(image: { width: number, height: number }, screenWidth: number) {
  const width = screenWidth;
  const ratio = width / image.width;
  const height = image.height * ratio;
  return height || 200;
}

function LazyImage({ source }: Props) {
  const { theme } = useContext(ThemeContext);
  const [error, setError] = useState<string | null>(null);
  const [screenWidth, setScreenWidth] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [ready, setReady] = useState(false);

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => setScreenWidth(nativeEvent.layout.width);
  const onLoad = ({ nativeEvent }: NativeSyntheticEvent<ImageLoadEventData>) => {
    setSize(nativeEvent.source);
    setReady(true);
  };
  const onError = () => setError('이미지 로딩에 실패하였습니다.');
  const height = useMemo(() => setImageHeight(size, screenWidth), [size, screenWidth]);
  const resizeMethod = useMemo(() => {
    if (Platform.OS === 'ios') return 'auto';
    const screenHeight = Dimensions.get('screen').height;
    return height > screenHeight ? 'resize' : 'auto';
  }, [height]);

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
        </View>
      )}
      <Image
        style={{ height }}
        source={source}
        onLoad={onLoad}
        onError={onError}
        resizeMethod={resizeMethod}
      />
    </View>
  );
}

function isEqual(prev: Props, next: Props) {
  return (
    // @ts-ignore
    prev.source.uri === next.source.uri
    && prev.viewable === next.viewable
  );
}

export default memo(LazyImage, isEqual);
