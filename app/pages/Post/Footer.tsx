import React, { memo, useContext } from 'react';
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import ThemeContext from '../../ThemeContext';

interface Props {
  url: string;
  likes?: number;
  dislikes?: number;
  comments: number;
}

function ContentFooter({ url, likes, dislikes, comments }: Props) {
  const { theme } = useContext(ThemeContext);

  const open = () => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  return (
    <View style={[styles.infoPanel, { backgroundColor: theme.primary }]}>
      {likes !== undefined && (
        <View style={styles.infoItem}>
          <Icon name="thumb-up" size={20} color="white" />
          <Text style={styles.infoText}>{likes}</Text>
        </View>
      )}
      {dislikes !== undefined && (
        <View style={styles.infoItem}>
          <Icon name="thumb-down" size={20} color="white" />
          <Text style={styles.infoText}>{dislikes}</Text>
        </View>
      )}
      {comments > 0 && (
        <View style={styles.infoItem}>
          <Icon name="message" size={20} color="white" />
          <Text style={styles.infoText}>{comments}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.infoItem} onPress={open}>
        <Icon name="launch" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}
ContentFooter.defaultProps = {
  comments: 0,
};

export default memo(ContentFooter);
