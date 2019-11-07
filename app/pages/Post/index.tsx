import React, { useCallback, useContext } from 'react';
import {
  SectionList,
  SectionListData,
} from 'react-native';

import Title from 'app/components/Title';

import Footer from './Footer';
import Contents from './Contents';
import Comments from './Comments';
import usePost from './usePost';
import Placeholder from './placeholder';
import ThemeContext from '../../ThemeContext';

type NaviProps = { url: string, parent: string, key: string, subject: string };

interface Props {
  route: any;
  navigation: any;
}

function keyExtractor(item: CommentRecord | ContentRecord) {
  if (Array.isArray(item)) return item[0].key;
  return item.key;
}

export default function Post({ route }: Props) {
  const { title, url, key } = route.params;
  const {
    likes, dislikes, contents, comment, ready, isCommentLoading, loadComment,
  } = usePost(url, key);
  const { theme } = useContext(ThemeContext);
  const path = `http://m.ruliweb.com/${url}`;

  const renderItems = useCallback(({ item, section }: any) => {
    if (section.index === 0) {
      return <Contents {...item} url={path} />;
    }
    return <Comments {...item} id={item.key} />;
  }, [path]);

  const renderSectionHeader = useCallback(({ section }: { section: SectionListData<any> }) => {
    if (section.index === 1) {
      return (
        <Footer
          likes={likes}
          dislikes={dislikes}
          comments={comment.length}
          url={url}
          disabled={!ready}
        />
      );
    }
    return null;
  }, [comment.length, dislikes, likes, url, ready]);

  if (!ready) return <Placeholder />;

  return (
    <SectionList
      sections={[
        { index: 0, data: contents },
        { index: 1, data: comment },
      ]}
      ListHeaderComponent={<Title label={title} />}
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
