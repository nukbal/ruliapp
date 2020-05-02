import React, { useMemo, useRef, useEffect } from 'react';
import { SectionList, View, useWindowDimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation, DrawerActions } from '@react-navigation/core';
import { useIsDrawerOpen } from '@react-navigation/drawer';

import Title from 'components/Title';
import Text from 'components/Text';

import { setCurrent } from 'stores/post';

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
  const { width } = useWindowDimensions();
  const isOpen = useIsDrawerOpen();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const ref = useRef<SectionList<any> | null>(null);
  const isLargeScreen = width >= 735;

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollToLocation({ itemIndex: 0, sectionIndex: 0, animated: false });
    }
  }, [url]);

  useEffect(() => {
    if (!url && !isLargeScreen && isOpen) {
      navigation.dispatch(DrawerActions.closeDrawer());
    }
    if (url && !isLargeScreen && !isOpen) {
      const timeout = setTimeout(() => dispatch(setCurrent({ url: '' })), 250);
      return () => clearTimeout(timeout);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, isOpen, isLargeScreen]);

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
        <Text size={2000}>🤔</Text>
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
      style={{ paddingTop: 12 }}
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
