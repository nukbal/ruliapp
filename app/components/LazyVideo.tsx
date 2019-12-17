import React, { memo, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Video, { OnLoadData } from 'react-native-video';
import {
  View, StyleSheet,
  LayoutChangeEvent, TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Haptic from 'react-native-haptic-feedback';

import { getTheme } from 'app/stores/theme';
import setImageHeight from 'app/utils/setImageHeight';
import useCachedFile from 'app/hooks/useCachedFile';
import saveFile from 'app/utils/saveFile';
import { FILE_PREFIX } from 'app/config/constants';

import ProgressBar from './ProgressBar';
import Text from './Text';
import BottomSheet from './BottomSheet';
import ListItem from './ListItem';

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
    opacity: 0.65,
  },
});

function LazyVideo({ source }: Props) {
  const theme = useSelector(getTheme);
  const [uri, progress, error] = useCachedFile(source.uri);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [screenWidth, setLayout] = useState(0);
  const [pause, setPause] = useState(false);
  const [bottom, showBottomSheet] = useState(false);

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => setLayout(nativeEvent.layout.width);
  const onLoad = ({ naturalSize }: OnLoadData) => setSize({ width: naturalSize.width, height: naturalSize.height });
  const onPress = () => setPause(!pause);
  const toggleMenu = () => {
    if (!bottom) Haptic.trigger('impactLight');
    showBottomSheet(!bottom);
  };
  const save = async () => {
    await saveFile(uri);
    showBottomSheet(false);
  };

  const height = useMemo(() => setImageHeight(size, screenWidth), [size, screenWidth]);
  const backgroundColor = uri ? 'transparent' : theme.gray[75];

  return (
    <View
      style={[styles.container, { height, backgroundColor }]}
      onLayout={onLayout}
    >
      {!!error && (
        <View style={styles.message}>
          <Text color="primary">불러오기 실패</Text>
          <Text color="primary">{source.uri}</Text>
          <Text color="primary">{error}</Text>
        </View>
      )}
      {!uri && !error && (
        <View style={styles.message}>
          <ProgressBar
            color={theme.primary[600]}
            indetermate
            progress={progress}
          />
        </View>
      )}
      {pause && (
        <Icon
          name="pause"
          style={[styles.pauseIcon, { backgroundColor: theme.gray[300] }]}
          color={theme.gray[800]}
          size={32}
        />
      )}
      {!!uri && (
        <TouchableWithoutFeedback onPress={onPress} onLongPress={toggleMenu}>
          <Video
            source={{ uri: FILE_PREFIX + uri }}
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
      {!!uri && (
        <BottomSheet show={bottom} onClose={toggleMenu}>
          <ListItem name="archive" onPress={save}>저장하기</ListItem>
        </BottomSheet>
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
