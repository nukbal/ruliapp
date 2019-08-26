import React, { useMemo, useContext } from 'react';
import { NavigationScreenProp } from 'react-navigation';
import {
  FlatList,
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
  return item.key;
}

const renderComment = ({ item }: any) => <Comments {...item} />;

export default function Post({ navigation }: Props) {
  const { params } = navigation.state;
  const {
    likes, dislikes, contents, comment, ready, isCommentLoading, loadComment,
  } = usePost(params.url, params.key);
  const { theme } = useContext(ThemeContext);

  const header = useMemo(() => (
    <>
      {contents.map((item) => (
        Array.isArray(item)
          // @ts-ignore
          ? <ContentRow key={`row${item[0].key}`} row={item} />
          : <Contents key={item.key} {...item} />
      ))}
      <Footer
        likes={likes}
        dislikes={dislikes}
        comments={comment.length}
        url={`http://m.ruliweb.com/${params.url}`}
      />
    </>
  ), [comment.length, contents, dislikes, likes, params.url]);

  if (!ready) return <Placeholder />;

  return (
    <FlatList
      data={comment}
      renderItem={renderComment}
      keyExtractor={keyExtractor}
      ListHeaderComponent={header}
      refreshing={isCommentLoading}
      onRefresh={loadComment}
      style={{ backgroundColor: theme.background }}
      removeClippedSubviews
    />
  );
}
