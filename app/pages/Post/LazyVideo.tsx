import React, { memo, useMemo, useState } from 'react';
import Video, { OnLoadData, LoadError } from 'react-native-video';
import { StyleSheet, LayoutChangeEvent, ImageSourcePropType } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { setImageHeight } from './LazyImage';

interface Props {
  source: ImageSourcePropType;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 6,
    marginBottom: 6,
    backgroundColor: 'rgba(100,100,100,0.25)',
  },
});

function LazyVideo({ source }: Props) {
  const [screenWidth, setScreenWidth] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [pause, setPause] = useState(false);

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => setScreenWidth(nativeEvent.layout.width);
  const onLoad = ({ naturalSize }: OnLoadData) => setSize({ width: naturalSize.width, height: naturalSize.height });
  const onPress = () => setPause((p) => !p);
  const onError = ({ error }: LoadError) => { console.warn(source.uri, error); };

  const height = useMemo(() => setImageHeight(size, screenWidth), [size, screenWidth]);

  return (
    <TouchableOpacity
      style={styles.container}
      onLayout={onLayout}
      onPress={onPress}
      activeOpacity={0.65}
    >
      <Video
        // @ts-ignore
        source={source}
        onLoad={onLoad}
        onError={onError}
        style={{ height }}
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
    prev.source.uri === next.source.uri
  );
}

export default memo(LazyVideo, isEqual);
