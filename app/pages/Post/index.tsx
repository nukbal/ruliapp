import React, { useCallback, useContext, useRef } from 'react';
import { NavigationScreenProp } from 'react-navigation';
import {
  SectionList,
  SectionListData,
} from 'react-native';

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
  const cache = useRef(new Set());
  const { theme } = useContext(ThemeContext);
  const url = `http://m.ruliweb.com/${params.url}`;

  const renderContent = useCallback(({ item }: any) => {
    if (Array.isArray(item)) {
      return <ContentRow row={item} />;
    }
    return <Contents {...item} url={url} viewable={cache.current.has(item.key)} />;
  }, [url]);

  const renderComment = useCallback(
    ({ item }: any) => <Comments {...item} id={item.key} viewable={cache.current.has(item.key)} />,
    [],
  );

  const renderSectionFooter = useCallback(({ section }: { section: SectionListData<any> }) => {
    if (section.index === 0) {
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

  const onViewItemChange = useCallback(({ viewableItems }: any) => {
    cache.current = new Set(viewableItems.filter((item: any) => item.isViewable).map((item: any) => item.item.key));
    console.log(cache.current);
  }, []);

  if (!ready) return <Placeholder />;

  const sections: SectionListData<any>[] = [
    {
      index: 0,
      data: contents,
      renderItem: renderContent,
    },
    {
      index: 1,
      data: comment,
      renderItem: renderComment,
    },
  ];

  return (
    <SectionList
      sections={sections}
      keyExtractor={keyExtractor}
      renderSectionFooter={renderSectionFooter}
      refreshing={isCommentLoading}
      onRefresh={loadComment}
      onViewableItemsChanged={onViewItemChange}
      style={{ backgroundColor: theme.background }}
    />
  );
}
