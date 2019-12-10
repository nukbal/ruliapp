import React, { memo, useMemo, useReducer } from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import Video, { OnLoadData } from 'react-native-video';
import { View, StyleSheet, LayoutChangeEvent, TouchableWithoutFeedback } from 'react-native';

import ProgressBar from 'app/components/ProgressBar';
import { getTheme } from 'app/stores/theme';
import setImageHeight from 'app/utils/setImageHeight';
import useCachedFile from 'app/hooks/useCachedFile';

interface Props {
  source: any;
  viewable?: boolean;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 6,
    marginBottom: 6,
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

const initialState = {
  screenWidth: 0,
  size: { width: 0, height: 0 },
  pause: false,
};

const { actions, reducer } = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setScreen(state, action: PayloadAction<number>) {
      state.screenWidth = action.payload;
    },
    togglePause(state) {
      state.pause = !state.pause;
    },
    setSize(state, action: PayloadAction<{ width: number; height: number; }>) {
      state.size = action.payload;
    },
  },
});

function LazyVideo({ source }: Props) {
  const [
    { screenWidth, size, pause },
    dispatch,
  ] = useReducer(reducer, initialState);
  const [uri, progress] = useCachedFile(source.uri);
  const theme = useSelector(getTheme);

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => dispatch(actions.setScreen(nativeEvent.layout.width));
  const onLoad = ({ naturalSize }: OnLoadData) => {
    dispatch(actions.setSize({ width: naturalSize.width, height: naturalSize.height }));
  };
  const onPress = () => dispatch(actions.togglePause());

  const height = useMemo(() => setImageHeight(size, screenWidth), [size, screenWidth]);
  const backgroundColor = uri ? 'transparent' : theme.gray[75];

  return (
    <View
      style={[styles.container, { height, backgroundColor }]}
      onLayout={onLayout}
    >
      {!uri && (
        <View style={styles.message}>
          <ProgressBar indetermate color={theme.primary[600]} progress={progress} />
        </View>
      )}
      {!!uri && (
        <TouchableWithoutFeedback onPress={onPress}>
          <Video
            source={{ uri }}
            onLoad={onLoad}
            style={{ height }}
            ignoreSilentSwitch="obey"
            resizeMode="cover"
            paused={pause}
            allowsExternalPlayback={false}
            disableFocus
            muted
            repeat
          />
        </TouchableWithoutFeedback>
      )}
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

export default memo(LazyVideo, isEqual);
