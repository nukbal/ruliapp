import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  ListRenderItemInfo,
  SectionListData,
} from 'react-native';
import { List } from 'realm';

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
  data: PostRecord;
  loading: boolean;
  onRefresh: () => void;
}

export default class DetailView extends PureComponent<Props> {
  static defaultProps = {
    loading: true,
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
    if (section.index === 0 && this.props.data) {
      const { likes, dislikes, commentSize, prefix, boardId, id } = this.props.data;
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

  keyExtractor = (item: CommentRecord | ContentRecord, i: number) => item.key;

  render() {
    const {
      subject,
      contents,
      comments,
    } = this.props.data;
    const sections = [
      { index: 0, data: contents, title: subject, renderItem: this.renderItem },
      { index: 1, data: comments, renderItem: this.renderComment },
    ];
    return (
      <SectionList
        refreshing={this.props.loading}
        onRefresh={this.onRefresh}
        renderSectionHeader={this.renderSectionHeader}
        renderSectionFooter={this.renderSectionFooter}
        keyExtractor={this.keyExtractor}
        // @ts-ignore
        sections={sections}
        stickySectionHeadersEnabled={false}
      />
    );
  }
}
