import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  AsyncStorage,
  ActivityIndicator,
  LayoutChangeEvent,
} from 'react-native';
import fs from 'react-native-fs';

import compress from '../../utils/compressUrl';
import { IMG_PATH } from '../../config/constants';

const styles = StyleSheet.create({
  ImageContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
});

interface Props {
  source: { uri: string };
  style?: any;
}

export function setImageSize(image: { width: number, height: number }, screenWidth: number) {
  let width = screenWidth;
  let ratio = 1;
  if (width > image.width) {
    ratio = width / image.width;
    // eslint-disable-next-line prefer-destructuring
    width = image.width;
  } else {
    ratio = width / image.width;
  }
  // eslint-disable-next-line no-bitwise
  const height = ~~(image.height * ratio);
  return { width, height };
}

function getImageSize(path: string) {
  return new Promise<{ width: number, height: number }>((done, error) => {
    Image.getSize(path, (width, height) => { done({ width, height }); }, error);
  });
}


export default function LazyImage({ source, style }: Props) {
  const [error, setError] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [percent, setPercent] = useState(0);
  const [uri, setUri] = useState<string | undefined>();

  const onProgress = useCallback((
    { contentLength, bytesWritten }: fs.DownloadProgressCallbackResult,
  ) => {
    if (bytesWritten < contentLength) {
      setPercent(Math.round(bytesWritten / contentLength * 100));
    }
  }, []);

  useEffect(() => {
    let isDone = false;

    async function loadImage() {
      try {
        const checkCache = AsyncStorage.getItem(`@Image:${source.uri}`);
        const json = await checkCache;
        if (json) {
          const { width, height, path } = JSON.parse(json);
          setSize({ width, height });
          setUri(path);
          return;
        }

        if (isDone) return;

        const path = `${IMG_PATH}/${compress(source.uri)}`;
        const job = fs.downloadFile({
          fromUrl: source.uri,
          toFile: path,
          cacheable: false,
          progress: onProgress,
        });

        await job.promise;
        if (isDone) return;

        const { width, height } = await getImageSize(path);
        if (isDone) return;

        await AsyncStorage.setItem(`@Image:${source.uri}`, JSON.stringify({ path, width, height }));
        if (isDone) return;

        setSize({ width, height });
        setUri(path);
      } catch (e) {
        // console.warn(e);
        setError(true);
      }
    }
    loadImage();

    return () => {
      isDone = true;
    };
  }, [source.uri, onProgress]);

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setScreenWidth(nativeEvent.layout.width);
  }, []);

  const imageSize = useMemo(() => setImageSize(size, screenWidth), [size, screenWidth]);

  if (error) {
    return (
      <View style={styles.ImageContent}>
        <Text>불러오기 실패</Text>
      </View>
    );
  }
  if (!(screenWidth > 0 && uri && size.width)) {
    return (
      <View
        style={[styles.ImageContent, style, { backgroundColor: '#ededed' }]}
        onLayout={onLayout}
      >
        <ActivityIndicator />
        {percent ? (<Text>{percent || '0'}</Text>) : null}
      </View>
    );
  }
  return (
    <Image
      style={[styles.ImageContent, style, imageSize]}
      source={{ uri }}
    />
  );
}
