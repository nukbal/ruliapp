import React, { memo, useMemo, useReducer } from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import Video, { OnLoadData } from 'react-native-video';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ProgressBar from 'app/components/ProgressBar';
import { getTheme } from 'app/stores/theme';
import setImageHeight from 'app/utils/setImageHeight';
import useCachedFile from 'app/hooks/useCachedFile';
import { VIDEO_CACHE } from 'app/config/constants';

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
  pauseIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    zIndex: 100,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
});

const initialState = {
  screenWidth: 0,
  size: { width: 0, height: 0 },
  pause: false,
  ready: false,
};

const { actions, reducer } = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setScreen(state, action: PayloadAction<number>) {
      state.screenWidth = action.payload;
    },
    setPause(state, action: PayloadAction<boolean>) {
      state.pause = action.payload;
    },
    setSize(state, action: PayloadAction<{ width: number; height: number; }>) {
      state.size = action.payload;
      state.ready = true;
    },
  },
});

function LazyVideo({ source }: Props) {
  const [
    { screenWidth, size, pause, ready },
    dispatch,
  ] = useReducer(reducer, initialState);
  const uri = useCachedFile(source.uri, VIDEO_CACHE);
  const theme = useSelector(getTheme);

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => dispatch(actions.setScreen(nativeEvent.layout.width));
  const onLoad = ({ naturalSize }: OnLoadData) => {
    dispatch(actions.setSize({ width: naturalSize.width, height: naturalSize.height }));
  };
  const onPress = () => dispatch(actions.setPause(!pause));

  const height = useMemo(() => setImageHeight(size, screenWidth), [size, screenWidth]);
  const backgroundColor = ready ? 'transparent' : theme.gray[75];

  return (
    <View
      style={[styles.container, { height, backgroundColor }]}
      onLayout={onLayout}
    >
      {!uri && (
        <View style={styles.message}>
          <ProgressBar indetermate color={theme.primary[600]} />
        </View>
      )}
      {pause && <Icon name="pause" style={styles.pauseIcon} color={theme.gray[800]} size={32} />}
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
