import React, { useContext } from 'react';
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ThemeContext from '../../ThemeContext';

interface Props {
  url: string;
  likes?: number;
  dislikes?: number;
  comments: number;
  disabled: boolean;
}

export default function ContentFooter({ url, likes, dislikes, comments = 0, disabled }: Props) {
  const { theme } = useContext(ThemeContext);

  const open = () => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  const color = disabled ? theme.backgroundSub : theme.primary;
  const textStyle = [styles.infoText, { color }];

  return (
    <View style={[styles.infoPanel, { borderColor: theme.border }]}>
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
      {comments > 0 && (
        <View style={styles.infoItem}>
          <Icon name="message" size={20} color={color} />
          <Text style={textStyle}>{comments}</Text>
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
    marginVertical: 4,
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
