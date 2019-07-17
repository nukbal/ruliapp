import React, { memo, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Share,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ThemeContext from '../../ThemeContext';

const styles = StyleSheet.create({
  infoPanel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
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

interface Props {
  url: string;
  likes: number;
  dislikes: number;
  comments: number;
}

function ContentFooter({ url, likes, dislikes, comments }: Props) {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={[styles.infoPanel, { backgroundColor: theme.primary }]}>
      {likes > 0 && (
        <View style={styles.infoItem}>
          <Icon name="thumb-up" size={20} color="white" />
          <Text style={styles.infoText}>{likes}</Text>
        </View>
      )}
      {dislikes > 0 && (
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
      <TouchableOpacity style={styles.infoItem} onPress={() => Share.share({ url })}>
        <Icon name="link" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}
ContentFooter.defaultProps = {
  likes: 0,
  dislikes: 0,
  comments: 0,
};

export default memo(ContentFooter);
