import React, { memo, useMemo, useState, useCallback } from 'react';
import Video, { OnLoadData } from 'react-native-video';
import { StyleSheet, LayoutChangeEvent } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
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
  const [pause, setPause] = useState(false);

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setScreenWidth(nativeEvent.layout.width);
  }, []);

  const onLoad = useCallback(({ naturalSize }: OnLoadData) => {
    setSize({ width: naturalSize.width, height: naturalSize.height });
  }, []);

  const height = useMemo(() => setImageHeight(size, screenWidth), [size, screenWidth]);
  const onPress = useCallback(() => setPause((p) => !p), []);

  return (
    <TouchableOpacity
      style={styles.container}
      onLayout={onLayout}
      onPress={onPress}
      activeOpacity={0.65}
    >
      <Video
        source={{ uri }}
        onLoad={onLoad}
        style={{ height, flex: 1 }}
        ignoreSilentSwitch="obey"
        resizeMode="cover"
        paused={pause}
        muted
        repeat
        useTextureView={false}
      />
    </TouchableOpacity>
  );
}

function isEqual(prev: Props, next: Props) {
  return (
    prev.uri === next.uri
  );
}

export default memo(LazyVideo, isEqual);
