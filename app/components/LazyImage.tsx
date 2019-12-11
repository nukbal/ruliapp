import React, { memo, useMemo, useCallback, useReducer } from 'react';
import {
  StyleSheet,
  View,
  LayoutChangeEvent,
} from 'react-native';
import Image, { OnProgressEvent, OnLoadEvent } from 'react-native-fast-image';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import setImageHeight from 'app/utils/setImageHeight';
import { getTheme } from 'app/stores/theme';

import ProgressBar from './ProgressBar';
import Text from './Text';

const styles = StyleSheet.create({
  ImageContent: {
    flex: 1,
    width: '100%',
    marginTop: 6,
    marginBottom: 6,
    padding: 0,
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
  source: any;
}

const initialState = {
  layoutWidth: 0,
  size: { width: 0, height: 0 },
  progress: 0,
  error: '',
  ready: false,
};

const { reducer, actions } = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setSize(state, action: PayloadAction<typeof initialState['size']>) {
      state.size = action.payload;
    },
    setProgress(state, action: PayloadAction<number>) {
      state.progress = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setScreen(state, action: PayloadAction<number>) {
      state.layoutWidth = action.payload;
    },
  },
});

function LazyImage({ source }: Props) {
  const theme = useSelector(getTheme);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { layoutWidth, size, error, ready, progress } = state;

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    dispatch(actions.setScreen(nativeEvent.layout.width));
  }, []);
  const onLoad = useCallback(({ nativeEvent }: OnLoadEvent) => {
    dispatch(actions.setSize(nativeEvent));
  }, []);
  const onProgress = useCallback(({ nativeEvent }: OnProgressEvent) => {
    dispatch(actions.setProgress(nativeEvent.loaded / nativeEvent.total));
  }, []);
  const onError = useCallback(() => {
    dispatch(actions.setError(JSON.stringify(source)));
  }, []);
  const height = useMemo(() => setImageHeight(size, layoutWidth), [size, layoutWidth]);
  const backgroundColor = ready ? 'transparent' : theme.gray[75];

  return (
    <View
      style={[styles.ImageContent, { height, backgroundColor }]}
      onLayout={onLayout}
    >
      {!!error && (
        <View style={styles.message}>
          <Text color="primary">불러오기 실패</Text>
          <Text color="primary">{error}</Text>
        </View>
      )}
      {!ready && !error && (
        <View style={styles.message}>
          <ProgressBar
            color={theme.primary[600]}
            indetermate={progress === 0}
            progress={progress}
          />
        </View>
      )}
      <Image
        style={{ height }}
        source={source}
        onLoad={onLoad}
        onError={onError}
        onProgress={onProgress}
      />
    </View>
  );
}

function isEqual(prev: Props, next: Props) {
  return (
    prev.source === next.source
  );
}

export default memo(LazyImage, isEqual);
