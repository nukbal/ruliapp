import React, { useMemo } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { useSelector } from 'react-redux';

import { getTheme } from 'app/stores/theme';
import { getPost } from 'app/stores/post';

import styles from './styles';
import Placeholder from './placeholder';

interface Props {
  id: string;
  onPress: () => void;
  onShowUnderlay: any;
  onHideUnderlay: any;
}

function Fixed(n: number) {
  return `0${n}`.slice(-2);
}

export default function BoardItem(props: Props) {
  const {
    id, onPress, onShowUnderlay, onHideUnderlay,
  } = props;
  const theme = useSelector(getTheme);
  const { date, subject, user, likes, views, commentSize } = useSelector(getPost(id));
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
      underlayColor={theme.gray[100]}
      style={[styles.container, { backgroundColor: theme.gray[50] }]}
    >
      <>
        <View style={styles.info}>
          <Text numberOfLines={1} style={[styles.subjectText, { color: theme.gray[800] }]}>{subject}</Text>
          <Text style={[styles.itemText, styles.metaText, { color: theme.gray[700] }]}>{dateStr}</Text>
        </View>
        <View style={[styles.info, styles.subInfo]}>
          <Text style={[styles.itemText, { color: theme.gray[700] }]} numberOfLines={1}>
            {`${user.name} | 덧글 ${commentSize || 0} | 추천 ${likes} | 조회 ${views}`}
          </Text>
        </View>
      </>
    </TouchableHighlight>
  );
}
