import React, { memo, useMemo, useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  LayoutChangeEvent,
  Image,
  NativeSyntheticEvent,
  ImageLoadEventData,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSelector } from 'react-redux';
import Haptic from 'react-native-haptic-feedback';

import setImageHeight from 'app/utils/setImageHeight';
import { getTheme } from 'app/stores/theme';
import useCachedFile from 'app/hooks/useCachedFile';
import { FILE_PREFIX } from 'app/config/constants';
import saveFile from 'app/utils/saveFile';

import ProgressBar from './ProgressBar';
import Text from './Text';
import BottomSheet from './BottomSheet';
import ListItem from './ListItem';

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
  source: { uri: string };
}

function LazyImage({ source }: Props) {
  const theme = useSelector(getTheme);
  const [uri, progress, error] = useCachedFile(source.uri);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [layoutWidth, setLayout] = useState(0);
  const [show, setShow] = useState(false);

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setLayout(nativeEvent.layout.width);
  }, []);
  const onLoad = useCallback(({ nativeEvent }: NativeSyntheticEvent<ImageLoadEventData>) => {
    setSize(nativeEvent.source);
  }, []);
  const save = useCallback(async () => {
    await saveFile(uri);
    setShow(false);
  }, [uri]);
  const toggleMenu = useCallback(() => {
    if (!show) Haptic.trigger('impactLight');
    setShow(!show);
  }, [show]);
  const height = useMemo(() => setImageHeight(size, layoutWidth), [size, layoutWidth]);
  const backgroundColor = uri ? 'transparent' : theme.gray[75];

  return (
    <View
      style={[styles.ImageContent, { height, backgroundColor }]}
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
            indetermate={progress === 0}
            progress={progress}
          />
        </View>
      )}
      {!!uri && (
        <TouchableWithoutFeedback onLongPress={toggleMenu}>
          <Image
            style={{ height }}
            source={{ uri: FILE_PREFIX + uri }}
            onLoad={onLoad}
          />
        </TouchableWithoutFeedback>
      )}
      {!!uri && (
        <BottomSheet show={show} onClose={toggleMenu}>
          <ListItem name="archive" onPress={save}>저장하기</ListItem>
        </BottomSheet>
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
