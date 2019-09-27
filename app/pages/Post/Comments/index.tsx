import React, { useContext, useMemo, memo } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { transparentize } from 'polished';

import LazyImage from '../LazyImage';
import LazyVideo from '../LazyVideo';
import formatDate from '../../../utils/formatDate';
import styles from './styles';
import ThemeContext from '../../../ThemeContext';

interface Props extends CommentRecord {
  id: string;
  viewable?: boolean;
}

function Comment(
  {
    user, content, time, likes = 0, dislike = 0, image, child, reply, isDeleted,
  }: Props,
) {
  const { theme } = useContext(ThemeContext);

  const timeText = useMemo(() => (time ? formatDate(time) : ''), [time]);
  const containerStyle = [styles.container, { borderColor: theme.border }];
  const textStyle = { color: theme.text };

  if (isDeleted) {
    return (
      <View style={containerStyle}>
        <View style={styles.UserContainer}>
          <Text style={textStyle}>삭제된 댓글입니다.</Text>
        </View>
      </View>
    );
  }

  if (child) {
    // @ts-ignore
    containerStyle.push({ paddingLeft: 28, paddingTop: 25, backgroundColor: transparentize(0.825, theme.primary) });
  }

  const Media = ((image && image.indexOf('.mp4') !== -1) ? LazyVideo : LazyImage);

  return (
    <View style={containerStyle}>
      {reply && (
        <View style={styles.replyContainer}>
          <Icon name="insert-comment" size={12} color={theme.text} />
          <Text style={[styles.replyText, textStyle]}>{reply}</Text>
        </View>
      )}
      <View style={styles.UserContainer}>
        <Text style={[styles.UserText, textStyle]}>{user.name}</Text>
        {timeText && (<Text style={textStyle}>{timeText}</Text>)}
      </View>
      {image && <Media source={{ uri: image }} viewable />}
      <View style={[styles.UserContainer, { paddingVertical: 6 }]}>
        <Text style={textStyle}>{content || ''}</Text>
      </View>
      <View style={styles.infoContainer}>
        {likes > 0 && (<Icon name="thumb-up" size={20} color={theme.primary} />)}
        {likes > 0 && (<Text style={[styles.iconText, textStyle]}>{likes}</Text>)}
        {dislike > 0 && (<Icon name="thumb-down" size={20} color="red" />)}
        {dislike > 0 && (<Text style={[styles.iconText, textStyle]}>{dislike}</Text>)}
      </View>
    </View>
  );
}

function isEqual(prev: Props, next: Props) {
  return (
    prev.likes === next.likes
    && prev.dislike === next.dislike
    && prev.isDeleted === next.isDeleted
    && prev.viewable === next.viewable
  );
}

export default memo(Comment, isEqual);
