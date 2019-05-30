import React, { memo, useMemo } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import styles from './styles';
import Placeholder from './placeholder';

interface Props extends PostRecord {
  onPress: () => void;
  onShowUnderlay: any;
  onHideUnderlay: any;
}

function Fixed(n: number) {
  return `0${n}`.slice(-2);
}

function BoardItem(props: Props) {
  const {
    subject, user, commentSize, likes, views, date,
    onPress, onShowUnderlay, onHideUnderlay,
  } = props;
  const dateStr = useMemo(
    () => (
      date
        ? `${Fixed(date.getMonth() + 1)}/${Fixed(date.getDate())} ${Fixed(date.getHours())}:${Fixed(date.getMinutes())}`
        : ''
    ),
    [date],
  );

  if (!subject) return <Placeholder />;
  return (
    <TouchableHighlight
      onPress={onPress}
      onShowUnderlay={onShowUnderlay}
      onHideUnderlay={onHideUnderlay}
      underlayColor="#1A70DC"
    >
      <View style={styles.container}>
        <View style={styles.info}>
          <Text style={styles.titleText} numberOfLines={1}>{subject}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.itemText} numberOfLines={1}>
            {`${user.name} | 덧글 ${commentSize || 0} | 추천 ${likes} | 조회 ${views} | ${dateStr}`}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

function isEqual(prev: Props, next: Props) {
  return prev.subject === next.subject
    && prev.views === next.views
    && prev.commentSize === next.commentSize
    && prev.likes === next.likes;
}
export default memo(BoardItem, isEqual);
