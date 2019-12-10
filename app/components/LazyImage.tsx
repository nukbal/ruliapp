import React, { memo, useMemo, useCallback, useReducer } from 'react';
import {
  StyleSheet,
  View,
  Text,
  LayoutChangeEvent,
  ImageSourcePropType,
  Image,
  Platform,
} from 'react-native';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import ProgressBar from 'app/components/ProgressBar';
import setImageHeight from 'app/utils/setImageHeight';
import { getTheme } from 'app/stores/theme';
import useCachedFile from 'app/hooks/useCachedFile';

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
  source: ImageSourcePropType;
}

const initialState = {
  layoutWidth: 0,
  size: { width: 0, height: 0 },
};

const { reducer, actions } = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setSize(state, action: PayloadAction<typeof initialState['size']>) {
      state.size = action.payload;
    },
    setScreen(state, action: PayloadAction<number>) {
      state.layoutWidth = action.payload;
    },
  },
});

function LazyImage({ source }: Props) {
  const theme = useSelector(getTheme);
  // @ts-ignore
  const [uri, progress, error] = useCachedFile(source.uri);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { layoutWidth, size } = state;

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    dispatch(actions.setScreen(nativeEvent.layout.width));
  }, []);
  const onLoad = useCallback(({ nativeEvent }: any) => {
    dispatch(actions.setSize(nativeEvent.source));
  }, []);
  const height = useMemo(() => setImageHeight(size, layoutWidth), [size, layoutWidth]);

  const textStyle = { color: theme.primary[600] };
  const backgroundColor = uri ? 'transparent' : theme.gray[75];

  return (
    <View
      style={[styles.ImageContent, { height, backgroundColor }]}
      onLayout={onLayout}
    >
      {!!error && (
        <View style={styles.message}>
          <Text style={textStyle}>불러오기 실패</Text>
          <Text style={textStyle}>{error}</Text>
        </View>
      )}
      {!uri && !error && (
        <View style={styles.message}>
          <ProgressBar
            color={theme.primary[600]}
            indetermate={progress === 0}
            progress={progress}
          />
        </View>
      )}
      {!!uri && (
        <Image
          style={{ height }}
          source={{ uri }}
          onLoad={onLoad}
          resizeMethod={Platform.OS === 'android' ? 'resize' : 'auto'}
          resizeMode="cover"
        />
      )}
    </View>
  );
}

function isEqual(prev: Props, next: Props) {
  return (
    prev.source === next.source
  );
}

export default memo(LazyImage, isEqual);
