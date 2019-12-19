import React, { useMemo, memo } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { useSelector } from 'react-redux';

import { getTheme } from 'stores/theme';
import format from 'utils/formatDate';

import styles from './styles';
import Placeholder from './placeholder';

interface Props {
  data: PostItemRecord;
  onPress: () => void;
  onShowUnderlay: any;
  onHideUnderlay: any;
}

function BoardItem({ onPress, onShowUnderlay, onHideUnderlay, data }: Props) {
  const { date, subject, user, commentSize, likes, views } = data;
  const theme = useSelector(getTheme);
  const dateStr = useMemo(() => (date ? format(date) : ''), [date]);

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
export default memo(BoardItem);
