import React, { memo, useMemo, useState, useCallback } from 'react';
import Video, { OnLoadData } from 'react-native-video';
import { StyleSheet, LayoutChangeEvent } from 'react-native';
import { setImageHeight } from './LazyImage';

interface Props {
  uri: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 6,
    marginBottom: 6,
    backgroundColor: 'rgba(100,100,100,0.25)',
  },
});

function LazyVideo({ uri }: Props) {
  const [screenWidth, setScreenWidth] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isLoad, setLoad] = useState(false);

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setScreenWidth(nativeEvent.layout.width);
  }, []);

  const onLoad = useCallback(({ naturalSize }: OnLoadData) => {
    setSize({ width: naturalSize.width, height: naturalSize.height });
    setLoad(true);
  }, []);

  const height = useMemo(() => setImageHeight(size, screenWidth), [size, screenWidth]);

  return (
    // @ts-ignore
    <Video
      source={{ uri }}
      onLoad={onLoad}
      onLayout={onLayout}
      style={[styles.container, { height }]}
      ignoreSilentSwitch="obey"
      resizeMode="cover"
      muted
      repeat
      hideShutterView
      useTextureView={false}
    />
  );
}

function isEqual(prev: Props, next: Props) {
  return (
    prev.uri === next.uri
  );
}

export default memo(LazyVideo, isEqual);
