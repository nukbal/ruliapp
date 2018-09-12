import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import LazyImage from '../LazyImage';
import { primary } from '../../styles/color';
import styles from './styles';
import formatDate from '../../utils/formatDate';

export default class Comment extends PureComponent<CommentRecord> {
  static defaultProps = {
    likes: 0,
    dislike: 0,
  }

  render() {
    const { user, content, time, likes, dislike, image, best, child } = this.props;
    const containerStyle: any = [styles.container];
    if (child) {
      containerStyle.push({ paddingLeft: 16 });
    }
    return (
      <View style={containerStyle}>
        <View style={styles.UserContainer}>
          <View style={styles.horizontal}>
            <Text style={styles.UserText}>
              {user.name}
            </Text>
            {best && (<Text style={styles.bestText}>BEST</Text>)}
          </View>
          {time && (<Text style={styles.timeText}>{formatDate(time)}</Text>)}
        </View>
        <View style={styles.CommentContainer}>
          {image && (<LazyImage source={{ uri: image }} />)}
          <Text style={styles.CommentText}>{content || ''}</Text>
        </View>
        <View style={styles.infoContainer}>
          {likes > 0 && (<Icon name="thumb-up" size={20} color={primary} />)}
          {likes > 0 && (<Text style={[styles.UserText, { marginLeft: 6 }]}>{likes}</Text>)}
          {dislike > 0 && (<Icon name="thumb-down" size={20} color="red" />)}
          {dislike > 0 && (<Text style={[styles.UserText, { marginLeft: 6 }]}>{dislike}</Text>)}
        </View>
      </View>
    );
  }
}
