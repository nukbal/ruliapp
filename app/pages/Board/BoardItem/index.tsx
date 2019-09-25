import React, { memo, useMemo, useContext } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import styles from './styles';
import Placeholder from './placeholder';
import ThemeContext from '../../../ThemeContext';

interface Props extends PostRecord {
  onPress: () => void;
  onShowUnderlay: any;
  onHideUnderlay: any;
}

function Fixed(n: number) {
  return `0${n}`.slice(-2);
}

export default function BoardItem(props: Props) {
  const {
    subject, user, commentSize, likes, views, date,
    onPress, onShowUnderlay, onHideUnderlay,
  } = props;
  const { theme } = useContext(ThemeContext);
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
      underlayColor={theme.primaryHover}
      style={[styles.container, { backgroundColor: theme.background, borderColor: theme.border }]}
    >
      <>
        <View style={styles.info}>
          <Text numberOfLines={1} style={{ color: theme.text }}>{subject}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.itemText, { color: theme.label }]} numberOfLines={1}>
            {`${user.name} | 덧글 ${commentSize || 0} | 추천 ${likes} | 조회 ${views} | ${dateStr}`}
          </Text>
        </View>
      </>
    </TouchableHighlight>
  );
}
