import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { transparentize } from 'polished';

import { primary } from '../../../styles/color';
import LazyImage from '../LazyImage';
import formatDate from '../../../utils/formatDate';

export default function Comment(
  { user, content, time, likes = 0, dislike = 0, image, best, child }: CommentRecord,
) {
  return (
    <Container child={child}>
      <UserSection>
        <UserText>{user.name}</UserText>
        {best && (<Tag>BEST</Tag>)}
        {time && (<Time>{formatDate(time)}</Time>)}
      </UserSection>
      {image && (<UserSection><LazyImage source={{ uri: image }} /></UserSection>)}
      <UserSection>
        <Contents>{content || ''}</Contents>
      </UserSection>
      <Footer>
        {likes > 0 && (<Icon name="thumb-up" size={20} color={primary} />)}
        {likes > 0 && (<UserText>{likes}</UserText>)}
        {dislike > 0 && (<Icon name="thumb-down" size={20} color="red" />)}
        {dislike > 0 && (<UserText>{dislike}</UserText>)}
      </Footer>
    </Container>
  );
}

const Container = styled.View<{ child?: any }>`
  padding-top: 16;
  padding-bottom: 16;
  padding-left: ${({ child }) => (child ? 32 : 16)};
  padding-right: 16;
  justify-content: center;
  border-bottom-color: ${({ theme }) => theme.border};
  border-bottom-width: 1;
  background-color: ${({ child, theme }) => (child ? transparentize(0.825, theme.primary) : theme.background)};
`;

const UserSection = styled.View`
  flex-direction: row;
`;

const UserText = styled.Text`
  color: ${({ theme }) => theme.text};
  font-weight: bold;
  padding-right: 6;
`;

const Tag = styled.Text`
  background-color: ${({ theme }) => theme.primary};
  padding-top: 3;
  padding-bottom: 3;
  padding-left: 8;
  padding-right: 8;
  font-size: 13;
  color: white;
`;

const Time = styled.Text`
  align-self: flex-end;
  color: ${({ theme }) => theme.text};
`;

const Contents = styled.Text`
  color: ${({ theme }) => theme.text};
`;

const Footer = styled.View`
  padding-top: 8;
  flex-direction: row;
`;
