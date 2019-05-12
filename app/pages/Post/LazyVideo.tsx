import React, { useState, useCallback } from 'react';
import Video, { OnLoadData } from 'react-native-video';
import { StyleSheet, LayoutChangeEvent } from 'react-native';
import { setImageSize } from './LazyImage';

interface Props {
  uri: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
});

export default function LazyVideo({ uri }: Props) {
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

  return (
    <Video
      source={{ uri }}
      onLoad={onLoad}
      onLayout={onLayout}
      style={[styles.container, (isLoad ? setImageSize(size, screenWidth) : { backgroundColor: '#ededed' })]}
      ignoreSilentSwitch="obey"
      muted
      repeat
    />
  );
}
