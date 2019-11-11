import React from 'react';
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { getTheme } from 'app/stores/theme';
import { getPostMeta } from 'app/stores/post';

interface Props {
  url: string;
}

export default function ContentFooter({ url }: Props) {
  const theme = useSelector(getTheme);
  const { likes, dislikes, commentSize } = useSelector(getPostMeta(url));

  const open = () => {
    const path = `http://m.ruliweb.com/${url}`;
    Linking.openURL(path).catch((err) => console.error('An error occurred', err));
  };

  const color = theme.gray[800];
  const textStyle = [styles.infoText, { color }];

  return (
    <View style={[styles.infoPanel, { borderColor: theme.gray[300] }]}>
      {likes !== undefined && (
        <View style={styles.infoItem}>
          <Icon name="thumb-up" size={20} color={color} />
          <Text style={textStyle}>{likes}</Text>
        </View>
      )}
      {dislikes !== undefined && (
        <View style={styles.infoItem}>
          <Icon name="thumb-down" size={20} color={color} />
          <Text style={textStyle}>{dislikes}</Text>
        </View>
      )}
      {commentSize !== undefined && (
        <View style={styles.infoItem}>
          <Icon name="message" size={20} color={color} />
          <Text style={textStyle}>{commentSize}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.infoItem} onPress={open}>
        <Icon name="launch" size={20} color={color} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  infoPanel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  infoItem: {
    flex: 1,
    padding: 8,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 6,
    fontWeight: 'bold',
    color: 'white',
  },
});
