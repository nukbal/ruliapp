import React, { useEffect, useState, memo } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, View, Text, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProgressBar from 'components/ProgressBar';
import { getTheme } from 'stores/theme';
import { SHARE_CACHE as cache } from 'config/constants';
import Image from './LazyImage';

interface Props {
  uri: string;
  style?: any;
}

interface DataType {
  title: string;
  image: { url: string; width: number; height: number } | null;
  url: string;
  error?: boolean;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 6,
    padding: 6,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
  },
  info: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
    paddingRight: 22,
  },
  icon: {
    position: 'absolute',
    right: 4,
    top: 6,
  },
});

function ShareCard({ uri }: Props) {
  const theme = useSelector(getTheme);
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<DataType>({ title: '', image: null, url: '', error: false });

  useEffect(() => {
    let isUnmount = false;
    if (uri.indexOf('youtube.com/embed/') > -1) {
      const videoId = uri.substring(uri.indexOf('/embed/') + 7, uri.length);
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      if (cache.has(videoId)) {
        setData(cache.get(videoId));
        setReady(true);
        return;
      }

      fetch(uri, { method: 'get' })
        .then((res) => (isUnmount ? '' : res.text()))
        .then((html) => {
          if (isUnmount) return;
          const startIdx = html.indexOf('"embedded_player_response":');
          const endIdx = html.indexOf('}"', startIdx);
          if (startIdx > 0 && endIdx > 0) {
            const target = html.substring(startIdx + 27, endIdx + 2);
            const json = JSON.parse(JSON.parse(target));
            const targetData = {
              title: json.embedPreview.thumbnailPreviewRenderer.title.runs[0].text,
              image: json.embedPreview.thumbnailPreviewRenderer.defaultThumbnail.thumbnails[1],
              url,
            };
            cache.set(videoId, targetData);
            setData(targetData);
          } else {
            // youtube video is not available
            setData({ image: null, url, title: '', error: true });
          }
          setReady(true);
        })
        .catch((e) => { console.warn('share', e.message); });
    } else {
      setData({ image: null, url: uri, title: uri });
      setReady(true);
    }
    return () => {
      isUnmount = true;
    };
  }, [uri]);

  const onPress = () => {
    if (data.error) return;
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

  if (data.error) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.title, { color: theme.gray[800] }]}>
          존재하지 않는 영상입니다.
        </Text>
      </View>
    );
  }

  const titleStyle = data.image ? { borderColor: theme.gray[300], borderTopWidth: 1, paddingTop: 6 } : {};

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor, borderColor: theme.gray[300] }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {data.image && <Image source={{ uri: data.image.url }} />}
      <View style={[styles.info, titleStyle]}>
        <Text numberOfLines={2} style={[styles.title, { color: theme.gray[800] }]}>{data.title}</Text>
        <Icon name="launch" size={16} color={theme.primary[600]} style={styles.icon} />
      </View>
    </TouchableOpacity>
  );
}

export default memo(ShareCard, (prev, next) => prev.uri === next.uri);
