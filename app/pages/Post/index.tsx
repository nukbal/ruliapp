import React, { useMemo } from 'react';
import { SectionList } from 'react-native';
import { useSelector } from 'react-redux';

import { getTheme } from 'stores/theme';
import Title from 'components/Title';

import Footer from './Footer';
import Contents from './Contents';
import Comments from './Comments';
import Profile from './Profile';
import usePost from './usePost';
import Placeholder from './placeholder';

interface Props {
  route: any;
  navigation: any;
}

function keyExtractor(item: CommentRecord | ContentRecord) {
  return item.key;
}

export default function Post({ route }: Props) {
  const { url, ward } = route.params;
  const {
    subject, contents, comments, ready, isCommentLoading, loadComment,
    user, date, views, likes, dislikes, commentSize,
  } = usePost(url, ward);
  const theme = useSelector(getTheme);

  const ListHeaderComponent = useMemo(() => (ready ? (
    <>
      <Title label={subject} />
      <Profile user={user} date={date} views={views} />
    </>
  ) : null), [ready, subject, user, date, views]);

  const ListFooter = useMemo(() => (ready ? (
    <Footer
      url={url}
      likes={likes}
      dislikes={dislikes}
      commentSize={commentSize}
    />
  ) : null), [ready, url, likes, dislikes, commentSize]);

  if (!ready) return <Placeholder />;

  return (
    <SectionList
      sections={[
        { key: 'contents', data: contents },
        // @ts-ignore
        { key: 'comments', data: comments },
      ]}
      renderItem={({ item, section }) => {
        if (section.key === 'contents') {
          return <Contents {...item} />;
        }
        // @ts-ignore
        return <Comments {...item} id={item.key} />;
      }}
      keyExtractor={keyExtractor}
      renderSectionHeader={({ section }) => {
        if (section.key === 'comments') return ListFooter;
        return ListHeaderComponent;
      }}
      stickySectionHeadersEnabled={false}
      refreshing={isCommentLoading}
      onRefresh={loadComment}
      viewabilityConfig={{
        waitForInteraction: false,
        itemVisiblePercentThreshold: 25,
      }}
      style={{ backgroundColor: theme.gray[50] }}
      initialNumToRender={3}
      updateCellsBatchingPeriod={75}
      windowSize={3}
    />
  );
}
