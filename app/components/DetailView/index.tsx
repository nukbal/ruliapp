import React, { PureComponent } from 'react';
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
  id: string;
  boardId: string;
  prefix: string;
  subject: string;
  contents: string[];
  comments: string[];
  commentSize?: number;
  likes?: number;
  dislikes?: number;
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

  onRefresh = () => {
    const { comments, commentSize } = this.props;
    if (commentSize && comments.length < commentSize) {
      this.props.onRefresh();
    }
  }

  renderItem = ({ item, index }: ListRenderItemInfo<string>) => {
    const newStyle = [];

    if (index === 0) {
      newStyle.push({ paddingTop: 16 });
    }
    if (index === this.props.contents.length - 1) {
      newStyle.push({ paddingBottom: 16 });
    }

    // @ts-ignore
    return <Contents id={item} style={newStyle} />;
  }

  renderComment = ({ item }: ListRenderItemInfo<string>) => {
    if (!item) return null;
    return <Comments id={item} />;
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
      const { likes, dislikes, commentSize, prefix, boardId, id } = this.props;
      return (
        <Footer
          likes={likes}
          dislikes={dislikes}
          comments={commentSize}
          url={`http://m.ruliweb.com/${prefix}/board/${boardId}/read/${id}`}
        />
      );
    }
    return null;
  }

  keyExtractor = (item: string, index: number) => item;

  render() {
    const {
      subject,
      contents,
      comments,
      loading,
    } = this.props;
    const sections = [
      { index: 0, data: contents, title: subject, renderItem: this.renderItem },
      { index: 1, data: comments, renderItem: this.renderComment },
    ];
    return (
      <SectionList
        refreshing={loading}
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