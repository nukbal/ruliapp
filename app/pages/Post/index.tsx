import React, { useCallback } from 'react';
import { NavigationScreenProp } from 'react-navigation';
import {
  SectionList,
  SectionListData,
} from 'react-native';

import Footer from './Footer';
import Contents from './Contents';
import Comments from './Comments';
import usePost from './usePost';
import styled from 'styled-components/native';

const List = styled(SectionList)`
  background-color: ${({ theme }) => theme.background};
`;

type NaviProps = { url: string, parent: string, key: string, subject: string }

interface Props {
  navigation: NavigationScreenProp<any, NaviProps>;
}

function keyExtractor(item: CommentRecord | ContentRecord) {
  return item.key;
}

const renderContent = ({ item }: any) => <Contents {...item} />;
const renderComment = ({ item }: any) => <Comments {...item} />;

export default function Post({ navigation }: Props) {
  const { params } = navigation.state;
  const {
    likes, dislikes, contents, comment, ready, isCommentLoading, loadComment,
  } = usePost(params.url, params.key);

  const renderSectionFooter = useCallback(({ section }: { section: SectionListData<any> }) => {
    if (section.index === 0) {
      return (
        <Footer
          likes={likes}
          dislikes={dislikes}
          comments={comment.length}
          url={`http://m.ruliweb.com/${params.url}`}
        />
      );
    }
    return null;
  }, [likes, dislikes, comment, params.url]);

  const sections: SectionListData<any>[] = [
    {
      index: 0,
      data: contents,
      renderItem: renderContent,
      removeClippedSubviews: true,
    },
    {
      index: 1,
      data: comment,
      renderItem: renderComment,
      removeClippedSubviews: true,
    },
  ];
  return (
    <List
      refreshing={isCommentLoading}
      onRefresh={loadComment}
      renderSectionFooter={renderSectionFooter}
      keyExtractor={keyExtractor}
      sections={sections}
      stickySectionHeadersEnabled={false}
    />
  );
}
