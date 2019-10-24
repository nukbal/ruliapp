import React, { memo, useMemo, useContext, useCallback, useReducer } from 'react';
import {
  StyleSheet,
  View,
  Text,
  LayoutChangeEvent,
  ImageSourcePropType,
} from 'react-native';
// @ts-ignore
import ProgressBar from 'react-native-progress/Bar';
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
  viewable?: boolean;
}

export function setImageHeight(image: { width: number, height: number }, screenWidth: number) {
  const ratio = image.height / image.width;
  const height = screenWidth * ratio;
  return height || 200;
}

const initState = {
  error: null as string | null,
  layoutWidth: 0,
  progress: 0,
  size: { width: 0, height: 0 },
  ready: false,
};

function reducer(state: typeof initState, action: any) {
  switch (action.type) {
    case 'SIZE': {
      return { ...state, size: action.payload, ready: true };
    }
    case 'PROGRESS': {
      return { ...state, progress: action.payload };
    }
    case 'LAYOUT': {
      return { ...state, layoutWidth: action.payload };
    }
    case 'ERROR': {
      return { ...state, error: action.payload };
    }
    default: {
      return state;
    }
  }
}

function LazyImage({ source }: Props) {
  const { theme } = useContext(ThemeContext);
  const [state, dispatch] = useReducer(reducer, initState);
  const { error, layoutWidth, progress, size, ready } = state;

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    dispatch({ type: 'LAYOUT', payload: nativeEvent.layout.width });
  }, []);
  const onLoad = useCallback(({ nativeEvent }: OnLoadEvent) => {
    dispatch({ type: 'SIZE', payload: nativeEvent });
  }, []);
  const onProgress = useCallback(({ nativeEvent }: OnProgressEvent) => {
    dispatch({ type: 'PROGRESS', payload: nativeEvent.loaded / nativeEvent.total });
  }, []);
  const onError = useCallback(() => dispatch({ type: 'ERROR', payload: '이미지 로딩에 실패하였습니다.' }), []);
  const height = useMemo(() => setImageHeight(size, layoutWidth), [size, layoutWidth]);

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
          <ProgressBar
            color={theme.primary}
            borderColor={theme.primary}
            progress={progress}
            useNativeDriver
          />
        </View>
      )}
      <Image
        style={ready ? { height } : undefined}
        // @ts-ignore
        source={source}
        onLoad={onLoad}
        onError={onError}
        onProgress={onProgress}
        resizeMode="cover"
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
