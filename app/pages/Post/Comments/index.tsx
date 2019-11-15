import React, { useMemo, memo } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';

import { getTheme } from 'app/stores/theme';
import Text from 'app/components/Text';
import formatDate from 'app/utils/formatDate';

import LazyImage from '../Contents/LazyImage';
import LazyVideo from '../Contents/LazyVideo';
import styles from './styles';

interface Props extends CommentRecord {
  id: string;
  viewable?: boolean;
}

function Comment(
  {
    user, content, time, likes = 0, dislike = 0, image, reply, isDeleted,
  }: Props,
) {
  const theme = useSelector(getTheme);

  const timeText = useMemo(() => (time ? formatDate(time) : ''), [time]);
  const containerStyle = [styles.container];

  if (isDeleted) {
    return (
      <View style={containerStyle}>
        <View style={styles.UserContainer}>
          <Text>삭제된 댓글입니다.</Text>
        </View>
      </View>
    );
  }

  if (reply) {
    // @ts-ignore
    containerStyle.push({ paddingLeft: 28, paddingTop: 25 });
  }

  const Media = ((image && image.indexOf('.mp4') !== -1) ? LazyVideo : LazyImage);

  return (
    <View style={containerStyle}>
      {reply && (
        <View style={styles.replyContainer}>
          <Icon name="insert-comment" size={12} color={theme.gray[700]} />
          <Text size={75} shade={700}>{reply}</Text>
        </View>
      )}
      <View style={styles.UserContainer}>
        <Text style={[styles.UserText]}>{user.name}</Text>
        {timeText && (<Text>{timeText}</Text>)}
      </View>
      {image && <Media source={{ uri: image }} />}
      <View style={[styles.UserContainer, { paddingVertical: 6 }]}>
        <Text>{content || ''}</Text>
      </View>
      <View style={styles.infoContainer}>
        {likes > 0 && (<Icon name="thumb-up" size={20} color={theme.gray[800]} />)}
        {likes > 0 && (<Text style={[styles.iconText]} color="primary" shade={600}>{likes}</Text>)}
        {dislike > 0 && (<Icon name="thumb-down" size={20} color={theme.gray[800]} />)}
        {dislike > 0 && (<Text style={[styles.iconText]} color="red" shade={600}>{dislike}</Text>)}
      </View>
    </View>
  );
}

function isEqual(prev: Props, next: Props) {
  return (
    prev.likes === next.likes
    && prev.dislike === next.dislike
    && prev.isDeleted === next.isDeleted
  );
}

export default memo(Comment, isEqual);
