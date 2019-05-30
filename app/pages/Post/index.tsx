import React, { useCallback } from 'react';
import { NavigationScreenProp } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  TouchableOpacity,
  View,
  Text,
  SectionList,
  SectionListData,
} from 'react-native';

import PostPlaceholder from './placeholder';
import Footer from './Footer';
import Contents from './Contents';
import Comments from './Comments';
import usePost from './usePost';
import styles from './styles';

type NaviProps = { url: string, parent: string, key: string, subject: string }

interface Props {
  navigation: NavigationScreenProp<any, NaviProps>;
}

export default function Post({ navigation }: Props) {
  const { params } = navigation.state;
  const {
    likes, dislikes, contents, comment, ready, isCommentLoading, loadComment,
  } = usePost(params.url, params.key);

  const renderSectionHeader = useCallback(({ section }: { section: SectionListData<any> }) => {
    if (section.index !== 0 || !section.title) return null;

    return (
      <View style={styles.title}>
        <Text style={styles.titleText}>{section.title}</Text>
      </View>
    );
  }, []);

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

  const renderContent = useCallback(({ item }: any) => <Contents {...item} />, []);
  const renderComment = useCallback(({ item }: any) => <Comments {...item} />, []);
  const keyExtractor = useCallback(
    (item: CommentRecord | ContentRecord, i: number) => item.key,
    [],
  );

  if (!ready) {
    return <View style={styles.container}><PostPlaceholder /></View>;
  }

  const sections: SectionListData<any>[] = [
    {
      index: 0,
      data: contents,
      title: navigation.state.params.subject,
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
    <View style={styles.container}>
      <SectionList
        refreshing={isCommentLoading}
        onRefresh={loadComment}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        keyExtractor={keyExtractor}
        sections={sections}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

Post.navigationOptions = ({ navigation }: Props) => ({
  title: navigation.state.params.subject,
  headerTintColor: 'white',
  headerRight: (
    <TouchableOpacity style={styles.headerIcon}>
      <Icon name="more-vert" size={24} color="white" />
    </TouchableOpacity>
  ),
  headerLeft: (
    <TouchableOpacity style={styles.headerIcon} onPress={() => { navigation.goBack(); }}>
      <Icon name="navigate-before" size={24} color="white" />
    </TouchableOpacity>
  ),
});
