import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  ListRenderItemInfo,
  SectionListData,
} from 'react-native';

import { primary } from '../../styles/color';

import Footer from './Footer';
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
  subject: string;
  contents: ContentRecord[];
  comments: CommentRecord[];
  likes: number;
  dislikes: number;
  commentSize: number;
  url: string;
  loading: boolean;
  onRefresh: () => void;
}

export default class DetailView extends Component<Props> {
  static defaultProps = {
    loading: false,
  }

  shouldComponentUpdate(props: Props) {
    return this.props.loading !== props.loading ||
      this.props.url !== props.url ||
      this.props.comments.length !== props.comments.length ||
      this.props.contents.length !== props.contents.length;
  }

  onRefresh = () => {
    if (!this.props.loading) {
      this.props.onRefresh();
    }
  }

  renderItem = ({ item, index }: ListRenderItemInfo<PostRecord>) => {
    // @ts-ignore
    return <Contents {...item} />;
  }

  renderComment = ({ item }: ListRenderItemInfo<CommentRecord>) => {
    if (!item) return null;
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
    if (section.index === 0 && this.props.url) {
      const { likes, dislikes, commentSize, url } = this.props;
      return (
        <Footer
          likes={likes}
          dislikes={dislikes}
          comments={commentSize}
          url={`http://m.ruliweb.com/${url}`}
        />
      );
    }
    return null;
  }

  keyExtractor = (item: CommentRecord | ContentRecord, i: number) => item.key;

  render() {
    const {
      subject,
      contents,
      comments,
    } = this.props;
    const sections: SectionListData<any>[] = [
      { index: 0, data: contents, title: subject, renderItem: this.renderItem, removeClippedSubviews: true },
      { index: 1, data: comments, renderItem: this.renderComment, removeClippedSubviews: true },
    ];
    return (
      <SectionList
        refreshing={this.props.loading}
        onRefresh={this.onRefresh}
        renderSectionHeader={this.renderSectionHeader}
        renderSectionFooter={this.renderSectionFooter}
        keyExtractor={this.keyExtractor}
        sections={sections}
        stickySectionHeadersEnabled={false}
      />
    );
  }
}
