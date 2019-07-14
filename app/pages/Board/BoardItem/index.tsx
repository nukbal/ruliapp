import React, { memo, useMemo } from 'react';
import styled from 'styled-components/native';
import { View, Text } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import styles from './styles';
import Placeholder from './placeholder';

export const Container = styled(TouchableHighlight)`
  height: 75;
  padding-left: 15;
  padding-right: 15;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.text};
`;

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
    <Container
      onPress={onPress}
      onShowUnderlay={onShowUnderlay}
      onHideUnderlay={onHideUnderlay}
      underlayColor="#1A70DC"
    >
      <>
        <View style={styles.info}>
          <Title numberOfLines={1}>{subject}</Title>
        </View>
        <View style={styles.info}>
          <Text style={styles.itemText} numberOfLines={1}>
            {`${user.name} | 덧글 ${commentSize || 0} | 추천 ${likes} | 조회 ${views} | ${dateStr}`}
          </Text>
        </View>
      </>
    </Container>
  );
}

function isEqual(prev: Props, next: Props) {
  return prev.subject === next.subject
    && prev.views === next.views
    && prev.commentSize === next.commentSize
    && prev.likes === next.likes;
}
export default memo(BoardItem, isEqual);
