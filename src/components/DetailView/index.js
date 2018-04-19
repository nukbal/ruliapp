import React, { PureComponent } from 'react';
import { ScrollView, View, Text, StyleSheet, Share, SectionList, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { darkBarkground, border, listItem, primary } from '../../styles/color';

import Contents from './Contents';
import CommentItem from '../Comments/CommentItem';
import LazyImage from '../LazyImage';
import FullLoading from '../FullLoading';

const styles = StyleSheet.create({
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


export default class DetailView extends PureComponent {
  static defaultProps = {
    contents: [],
    commentList: [],
    bestCommentList: [],
    loading: false,
  }

  onPressShare = () => {
    const { boardId, articleId, prefix } = this.props;
    Share.share({ url: `http://m.ruliweb.com/${prefix}/board/${boardId}/read/${articleId}` });
  }

  renderItem = (row) => {
    const { item } = row;
    return (
      <Contents {...item} />
    );
  }

  renderComment = (isBest) => (row) => {
    const { item } = row;
    return (
      <CommentItem {...item} bestOnly={isBest} />
    );
  }

  renderSectionHeader = ({ section }) => {
    if (section.index !== 0) return;

    return (
      <View style={styles.title}>
        <Text style={styles.titleText}>{section.title}</Text>
      </View>
    );
  }

  renderSectionFooter = ({ section }) => {
    if (section.index === 0) {
      return (
        <View style={styles.infoPanel}>
          <View style={styles.infoItem}>
            <FontAwesome name="reply" size={20} color="white"/>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name="thumbs-o-up" size={20} color="white"/>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name="thumbs-o-down" size={20} color="white"/>
          </View>
          <TouchableOpacity style={styles.infoItem} onPress={this.onPressShare}>
            <FontAwesome name="share-square-o" size={20} color="white"/>
          </TouchableOpacity>
        </View>
      );
    } else if (section.index === 1){
      const { comments, commentList } = this.props;
      return (
        <View style={styles.infoItem}>
          <Text>덧글 {comments || commentList.length}개</Text>
        </View>
      );
    }
  }

  render() {
    const {
      title,
      contents,
      commentList,
      bestCommentList,
      loading,
    } = this.props;
    const sections = (loading === false ? ([
      { index: 0, data: contents, title, renderItem: this.renderItem },
      { index: 1, data: bestCommentList, renderItem: this.renderComment(true) },
      { index: 2, data: commentList, renderItem: this.renderComment() },
    ]) : []);
    return (
      <SectionList
        refreshing={loading}
        onRefresh={this.props.refresh}
        ListEmptyComponent={(<FullLoading />)}
        renderSectionHeader={this.renderSectionHeader}
        renderSectionFooter={this.renderSectionFooter}
        sections={sections}
        stickySectionHeadersEnabled={false}
        removeClippedSubviews
      />
    );
  }
}
