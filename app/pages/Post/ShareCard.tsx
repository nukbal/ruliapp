import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Image from './LazyImage';
import ThemeContext from '../../ThemeContext';

interface Props {
  uri: string;
  style?: any;
}

interface DataType {
  title: string;
  image: { url: string; width: number; height: number } | null;
  url: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 6,
    padding: 6,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(100,100,100,0.25)',
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

export default function ShareCard({ uri }: Props) {
  const { theme } = useContext(ThemeContext);
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<DataType>({ title: '', image: null, url: '' });

  useEffect(() => {
    let isUnmount = false;
    if (uri.indexOf('youtube.com') > -1) {
      fetch(uri, { method: 'get' })
        .then((res) => (isUnmount ? '' : res.text()))
        .then((html) => {
          if (isUnmount) return;

          const startIdx = html.indexOf('"embedded_player_response":');
          const endIdx = html.indexOf('}"', startIdx);
          if (startIdx > 0 && endIdx > 0) {
            const target = html.substring(startIdx + 27, endIdx + 2);
            const json = JSON.parse(JSON.parse(target));
            setData({
              title: json.embedPreview.thumbnailPreviewRenderer.title.runs[0].text,
              image: json.embedPreview.thumbnailPreviewRenderer.defaultThumbnail.thumbnails[1],
              url: (
                `https://www.youtube.com/watch?v=${
                  json.embedPreview.thumbnailPreviewRenderer.playButton.buttonRenderer.navigationEndpoint.watchEndpoint.videoId}`
              ),
            });
          }
          setReady(true);
        })
        .catch((e) => { console.warn('share', e.message); });
    } else {
      setData({ ...data, title: uri });
      setReady(true);
    }
    return () => {
      isUnmount = true;
    };
  }, [data, uri]);

  const onPress = () => {
    Linking.openURL(data.url || uri).catch((err) => console.error('An error occurred', err));
  };

  if (!ready) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: theme.border }, data.image ? {} : { minHeight: 0 }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {data.image && <Image source={{ uri: data.image.url }} />}
      <View style={[styles.info, data.image ? { borderColor: theme.border, borderTopWidth: 1, paddingTop: 6 } : {}]}>
        <Text numberOfLines={2} style={[styles.title, { color: theme.text }]}>{data.title}</Text>
        <Icon name="launch" size={16} color={theme.primary} style={styles.icon} />
      </View>
    </TouchableOpacity>
  );
}
