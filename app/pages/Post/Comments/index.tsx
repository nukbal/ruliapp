import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { transparentize } from 'polished';

import LazyImage from '../LazyImage';
import formatDate from '../../../utils/formatDate';
import styles from './styles';
import ThemeContext from '../../../ThemeContext';

export default function Comment(
  { user, content, time, likes = 0, dislike = 0, image, best, child }: CommentRecord,
) {
  const { theme } = useContext(ThemeContext);
  const containerStyle = [styles.container, { borderColor: theme.border }];
  const textStyle = { color: theme.text };
  
  if (child) {
    // @ts-ignore
    containerStyle.push({ paddingLeft: 28, backgroundColor: transparentize(0.825, theme.primary) });
  }

  return (
    <View style={containerStyle}>
      <View style={styles.UserContainer}>
        <Text style={[styles.UserText, textStyle]}>{user.name}</Text>
        {time && (<Text style={textStyle}>{formatDate(time)}</Text>)}
      </View>
      {image && (<View style={styles.UserContainer}><LazyImage source={{ uri: image }} /></View>)}
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
