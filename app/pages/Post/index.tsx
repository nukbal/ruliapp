import React, { useCallback, useContext } from 'react';
import { NavigationScreenProp } from 'react-navigation';
import {
  SectionList,
  SectionListData,
} from 'react-native';

import Title from 'app/components/Title';

import Footer from './Footer';
import Contents, { ContentRow } from './Contents';
import Comments from './Comments';
import usePost from './usePost';
import ThemeContext from '../../ThemeContext';
import Placeholder from './placeholder';

type NaviProps = { url: string, parent: string, key: string, subject: string }

interface Props {
  navigation: NavigationScreenProp<any, NaviProps>;
}

function keyExtractor(item: CommentRecord | ContentRecord) {
  if (Array.isArray(item)) return item[0].key;
  return item.key;
}

export default function Post({ navigation }: Props) {
  const { params } = navigation.state;
  const {
    likes, dislikes, contents, comment, ready, isCommentLoading, loadComment,
  } = usePost(params.url, params.key);
  const { theme } = useContext(ThemeContext);
  const url = `http://m.ruliweb.com/${params.url}`;

  const renderItems = useCallback(({ item, section }: any) => {
    if (section.index === 0) {
      return <Contents {...item} url={url} />;
    }
    return <Comments {...item} id={item.key} />;
  }, [url]);

  const renderSectionHeader = useCallback(({ section }: { section: SectionListData<any> }) => {
    if (section.index === 1) {
      return (
        <Footer
          likes={likes}
          dislikes={dislikes}
          comments={comment.length}
          url={url}
        />
      );
    }
    return null;
  }, [comment.length, dislikes, likes, url]);

  if (!ready) {
    return (
      <>
        <Title label={params.title} />
        <Placeholder />
      </>
    );
  }

  return (
    <SectionList
      sections={[
        { index: 0, data: contents },
        { index: 1, data: comment },
      ]}
      ListHeaderComponent={<Title label={params.title} />}
      renderItem={renderItems}
      keyExtractor={keyExtractor}
      renderSectionHeader={renderSectionHeader}
      stickySectionHeadersEnabled={false}
      refreshing={isCommentLoading}
      onRefresh={loadComment}
      viewabilityConfig={{
        waitForInteraction: false,
        itemVisiblePercentThreshold: 25,
      }}
      removeClippedSubviews
      style={{ backgroundColor: theme.background }}
    />
  );
}
