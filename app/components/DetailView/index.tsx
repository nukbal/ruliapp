import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Share,
  SectionList,
  TouchableOpacity,
  ListRenderItemInfo,
  SectionListData,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { primary } from '../../styles/color';

import Contents from './Contents';
import Comments from '../Comments';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 20,
    paddingRight: 16,
    paddingLeft: 16,
    justifyContent: 'flex-start',
  },
  titleText: {
    color: 'black',
    fontSize: 18,
  },
  infoPanel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: primary,
  },
  infoItem: {
    flex: 1,
    padding: 8,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 6,
    fontWeight: 'bold',
    color: 'white'
  },
});

interface Props {
  id: string;
  boardId: string;
  prefix: string;
  meta: Readonly<{
    subject: string;
    userName: string;
    userId: string;
    level?: number;
    exp?: number;
    age?: number;
    image?: string;
  }>;
  source?: string;
  contents: ContentRecord[];
  comments: CommentRecord[];
  commentSize: number;
  likes?: string;
  dislike?: string;
  loading?: boolean;
  onRefresh: () => void;
}

export default class DetailView extends PureComponent<Props> {
  static defaultProps = {
    contents: [],
    comments: [],
    commentSize: 0,
    loading: false,
  }

  onPressShare = () => {
    const { boardId, id, prefix } = this.props;
    Share.share({ url: `http://m.ruliweb.com/${prefix}/board/${boardId}/read/${id}` });
  }

  onRefresh = () => {
    const { comments, commentSize } = this.props;
    if (commentSize && comments.length < commentSize) {
      this.props.onRefresh();
    }
  }

  renderItem = ({ item, index }: ListRenderItemInfo<ContentRecord>) => {
    const newStyle = [];

    if (index === 0) {
      newStyle.push({ paddingTop: 16 });
    }
    if (index === this.props.contents.length - 1) {
      newStyle.push({ paddingBottom: 16 });
    }

    // @ts-ignore
    return <Contents {...item} style={newStyle} />;
  }

  renderComment = ({ item }: ListRenderItemInfo<CommentRecord>) => {
    if (!item.key) return null;
    return <Comments {...item} />;
  }

  renderSectionHeader = ({ section }: { section: SectionListData<any> }) => {
    if (section.index !== 0) return null;
    if (!section.title) return null;

    return (
      <View style={styles.title}>
        <Text style={styles.titleText}>{section.title}</Text>
      </View>
    );
  }

  renderSectionFooter = ({ section }: { section: SectionListData<any> }) => {
    if (section.index === 0) {
      const { likes, dislike } = this.props;
      return (
        <View style={styles.infoPanel}>
          {likes && (
            <View style={styles.infoItem}>
              <FontAwesome name="thumbs-o-up" size={20} color="white"/>
              <Text style={styles.infoText}>{likes}</Text>
            </View>
          )}
          {dislike && (
            <View style={styles.infoItem}>
              <FontAwesome name="thumbs-o-down" size={20} color="white"/>
              <Text style={styles.infoText}>{dislike}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.infoItem} onPress={this.onPressShare}>
            <FontAwesome name="share-square-o" size={20} color="white"/>
          </TouchableOpacity>
        </View>
      );
    } else if (section.index === 1 && this.props.comments) {
      const { comments } = this.props;
      return (
        <View style={styles.infoItem}>
          <Text>덧글 {comments}개</Text>
        </View>
      );
    }
  }

  render() {
    const {
      meta,
      contents,
      comments,
      loading,
    } = this.props;
    const sections = [
      { index: 0, data: contents, title: meta.subject, renderItem: this.renderItem },
      { index: 1, data: comments, renderItem: this.renderComment },
    ];
    return (
      <SectionList
        refreshing={loading}
        onRefresh={this.onRefresh}
        // @ts-ignore
        renderSectionHeader={this.renderSectionHeader}
        // @ts-ignore
        renderSectionFooter={this.renderSectionFooter}
        sections={sections}
        stickySectionHeadersEnabled={false}
        removeClippedSubviews
      />
    );
  }
}
