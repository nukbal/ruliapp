import React, { useEffect, useState, memo } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, View, Linking } from 'react-native';
import ProgressBar from 'components/ProgressBar';
import NativeButton from 'components/NativeButton';
import Text from 'components/Text';
import { getTheme } from 'stores/theme';
import { SHARE_CACHE as cache } from 'config/constants';

import Image from './LazyImage';
import Link from './Link';

interface Props {
  uri: string;
  style?: any;
}

interface DataType {
  mode: 'youtube' | null;
  title: string;
  image: { url: string; width: number; height: number } | null;
  url: string;
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    minHeight: 200,
    borderRadius: 6,
  },
  inline: {
    alignItems: 'flex-start',
    minHeight: 0,
    padding: 6,
  },
  thumbnail: {
    borderRadius: 6,
  },
  title: {
    position: 'absolute',
    top: 8,
    left: 6,
    marginRight: 6,
    fontWeight: 'bold',
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.825)',
  },
});

const initialData = {
  mode: null, title: '', image: null, url: '', error: undefined,
};

function ShareCard({ uri }: Props) {
  const theme = useSelector(getTheme);
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<DataType>(initialData);

  useEffect(() => {
    let isUnmount = false;
    let render = renderUnknown;
    if (uri.indexOf('youtube.com/') > -1 || uri.indexOf('youtu.be') > -1) {
      render = renderYoutube;
    }

    render(uri)
      .then((res) => {
        if (isUnmount) return;
        setData(res);
      })
      .catch(() => !isUnmount && setData({ ...initialData, url: uri }))
      .finally(() => !isUnmount && setReady(true));
    return () => {
      isUnmount = true;
    };
  }, [uri]);

  const onPress = () => {
    Linking.openURL(data.url || uri).catch((err) => console.error('An error occurred', err));
  };

  const backgroundColor = theme.gray[75];

  if (!ready) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <ProgressBar indetermate color={theme.primary[600]} />
      </View>
    );
  }

  if (data.mode === null) {
    return (
      <NativeButton
        style={[styles.container, styles.inline, { backgroundColor }]}
        onPress={onPress}
        pointerEnabled
      >
        <Text>{data.title || ''}</Text>
        <Link to={data.url || uri} />
      </NativeButton>
    );
  }

  return (
    <NativeButton
      style={[styles.container, { borderColor: theme.gray[300] }]}
      onPress={onPress}
      pointerEnabled
    >
      {data.image && (
        <Image
          testID="thumbnail"
          style={styles.thumbnail}
          source={{ uri: data.image.url }}
        />
      )}
      <Text
        numberOfLines={2}
        color="gray"
        shade={800}
        size={300}
        style={[styles.title]}
      >
        {data.title || ''}
      </Text>
    </NativeButton>
  );
}

export default memo(ShareCard, (prev, next) => prev.uri === next.uri);

async function renderYoutube(uri: string): Promise<DataType> {
  const result: DataType = {
    mode: null,
    title: '',
    image: null,
    url: uri,
  };
  let videoId = '';
  let path = uri;
  if (uri.indexOf('youtube.com/embed/') > -1) {
    videoId = uri.substring(uri.indexOf('/embed/') + 7, uri.length);
  } else if (uri.indexOf('youtu.be') > -1) {
    videoId = uri.substring(uri.indexOf('youtu.be/') + 9, uri.length);
  } else {
    const startIdx = uri.indexOf('?v=');
    const endIdx = uri.indexOf('&', startIdx);
    if (startIdx === -1) throw new Error('invalid url');
    videoId = uri.substring(uri.indexOf('?v=') + 3, endIdx !== -1 ? endIdx : uri.length);
  }
  if (!videoId) throw new Error('cannot found videoId');

  path = `https://www.youtube.com/embed/${videoId}`;
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  if (cache.has(videoId)) {
    return cache.get(videoId);
  }

  const res = await fetch(path, { method: 'get' });
  const html = await res.text();
  const startIdx = html.indexOf('"embedded_player_response":');
  const endIdx = html.indexOf('}"', startIdx);
  if (startIdx < 0 || endIdx < 0) throw new Error('invalid url');
  const target = html.substring(startIdx + 27, endIdx + 2);
  const json = JSON.parse(JSON.parse(target));
  result.mode = 'youtube';
  result.title = json.embedPreview.thumbnailPreviewRenderer.title.runs[0].text;
  // eslint-disable-next-line prefer-destructuring
  result.image = json.embedPreview.thumbnailPreviewRenderer.defaultThumbnail.thumbnails[1];
  result.url = url;

  return result;
}

// async function renderVimeo(uri: string) {
//   const result: DataType = {
//     mode: null,
//     title: '',
//     image: null,
//     url: uri,
//   };

//   return result;
// }

async function renderUnknown(uri: string) {
  const result: DataType = {
    mode: null,
    title: '',
    image: null,
    url: uri,
  };
  const res = await fetch(uri, {
    method: 'get',
    headers: {
      Accept: 'text/html',
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache, no-store',
      Pragma: 'no-cache',
    },
  });
  const html = await res.text();

  const titleIdx = html.indexOf('<title>');
  if (titleIdx > 0) {
    const endIdx = html.indexOf('</title>', titleIdx);
    if (endIdx > 0) {
      result.title = html.substring(titleIdx + 7, endIdx).trim();
    }
  }

  return result;
}
