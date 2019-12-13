import React, { useCallback, useMemo } from 'react';
import { SectionList } from 'react-native';
import { useSelector } from 'react-redux';

import { getTheme } from 'app/stores/theme';
import Title from 'app/components/Title';

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
  if (Array.isArray(item)) return item[0].key;
  return item.key;
}

export default function Post({ route }: Props) {
  const { url, bookmark } = route.params;
  const {
    subject, contents, comments, ready, isCommentLoading, loadComment,
    user, date, views, likes, dislikes, commentSize,
  } = usePost(url, bookmark);
  const theme = useSelector(getTheme);

  const renderItems = useCallback(({ item, section }: any) => {
    if (section.index === 0) {
      return <Contents {...item} />;
    }
    return <Comments {...item} id={item.key} />;
  }, []);

  const ListHeaderComponent = useMemo(() => (ready ? (
    <>
      <Title label={subject} />
      <Profile user={user} date={date} views={views} />
    </>
  ) : null), [ready, subject, user, date, views]);

  const ListFooter = useMemo(
    () => (ready ? <Footer url={url} likes={likes} dislikes={dislikes} commentSize={commentSize} /> : null),
    [ready, url, likes, dislikes, commentSize],
  );

  if (!ready) return <Placeholder />;

  return (
    <SectionList
      sections={[
        { index: 0, data: contents },
        { index: 1, data: comments },
      ]}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={renderItems}
      keyExtractor={keyExtractor}
      renderSectionHeader={({ section }) => {
        if (section.index === 1) return ListFooter;
        return null;
      }}
      stickySectionHeadersEnabled={false}
      refreshing={isCommentLoading}
      onRefresh={loadComment}
      viewabilityConfig={{
        waitForInteraction: false,
        itemVisiblePercentThreshold: 25,
      }}
      style={{ backgroundColor: theme.gray[50] }}

      removeClippedSubviews
      initialNumToRender={3}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={50}
      windowSize={5}
    />
  );
}
