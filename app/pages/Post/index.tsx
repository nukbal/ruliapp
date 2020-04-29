import React, { useMemo, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SectionList, View } from 'react-native';

import { getTheme } from 'stores/theme';
import Title from 'components/Title';
import Text from 'components/Text';

import Footer from './Footer';
import Contents from './Contents';
import Comments from './Comments';
import Profile from './Profile';
import usePost from './usePost';
import Placeholder from './placeholder';


function keyExtractor(item: CommentRecord | ContentRecord) {
  return item.key;
}

export default function Post() {
  const {
    url, subject, contents, comments, ready, isCommentLoading, loadComment,
    user, date, views, likes, dislikes, commentSize,
  } = usePost();
  const ref = useRef<SectionList<any> | null>(null);
  const theme = useSelector(getTheme);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollToLocation({ itemIndex: 0, sectionIndex: 0, animated: false });
    }
  }, [url]);

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

  if (!url) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '80%' }}>
        <Text size={1100}>🤔</Text>
        <Text size={500}>선택된 게시물이 없습니다.</Text>
      </View>
    );
  }
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
      ref={ref}
      stickySectionHeadersEnabled={false}
      refreshing={isCommentLoading}
      onRefresh={loadComment}
      viewabilityConfig={{
        waitForInteraction: false,
        itemVisiblePercentThreshold: 25,
      }}
    />
  );
}
