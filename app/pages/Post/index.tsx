import React, { useCallback } from 'react';
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
  const { url } = route.params;
  const {
    subject, contents, comments, ready, isCommentLoading, loadComment,
  } = usePost(url);
  const theme = useSelector(getTheme);
  const path = `http://m.ruliweb.com/${url}`;

  const renderItems = useCallback(({ item, section }: any) => {
    if (section.index === 0) {
      return <Contents {...item} url={path} />;
    }
    return <Comments {...item} id={item.key} />;
  }, [path]);

  if (!ready) return <Placeholder />;

  return (
    <SectionList
      sections={[
        { index: 0, data: contents },
        { index: 1, data: comments },
      ]}
      ListHeaderComponent={(
        <>
          <Title label={subject} />
          <Profile url={url} />
        </>
      )}
      renderItem={renderItems}
      keyExtractor={keyExtractor}
      renderSectionHeader={({ section }) => {
        if (section.index === 1) return <Footer url={url} />;
        return null;
      }}
      stickySectionHeadersEnabled={false}
      refreshing={isCommentLoading}
      onRefresh={loadComment}
      viewabilityConfig={{
        waitForInteraction: false,
        itemVisiblePercentThreshold: 25,
      }}
      removeClippedSubviews
      style={{ backgroundColor: theme.gray[50] }}
    />
  );
}
