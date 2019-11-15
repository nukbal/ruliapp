import React, { memo, useMemo, useState } from 'react';
import Video, { OnLoadData } from 'react-native-video';
import { StyleSheet, LayoutChangeEvent, ImageSourcePropType, TouchableWithoutFeedback } from 'react-native';
import { setImageHeight } from './LazyImage';

interface Props {
  source: ImageSourcePropType;
  viewable?: boolean;
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

  const height = useMemo(() => setImageHeight(size, screenWidth), [size, screenWidth]);

  return (
    <TouchableWithoutFeedback
      style={[styles.container, { height }]}
      onLayout={onLayout}
      onPress={onPress}
    >
      <Video
        // @ts-ignore
        source={source}
        onLoad={onLoad}
        style={{ height }}
        ignoreSilentSwitch="obey"
        resizeMode="cover"
        paused={pause}
        allowsExternalPlayback={false}
        disableFocus
        hideShutterView
        muted
        repeat
      />
    </TouchableWithoutFeedback>
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
