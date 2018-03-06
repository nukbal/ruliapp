import React, { PureComponent } from 'react';
import { ScrollView, View, Text, StyleSheet, Share, SectionList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
    marginTop: 6,
    marginBottom: 6,
    borderRadius: 3,
    padding: 8,
    backgroundColor: listItem,
    borderBottomColor: border,
    borderBottomWidth: 1,
    justifyContent: 'flex-start',
  },
  titleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  infoPanel: {
    flex: 1,
    backgroundColor: primary,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
    padding: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 6,
    fontWeight: 'bold',
    color: 'white'
  }
});


export default class DetailView extends PureComponent {
  static defaultProps = {
    contents: [],
    commentList: [],
    bestCommentList: [],
    loading: false,
  }

  componentDidMount() {
    this.refs = {};
  }

  onPressShare = () => {
    const { boardId, articleId, prefix } = this.props;
    Share.share({ url: `http://m.ruliweb.com/${prefix}/board/${boardId}/read/${articleId}` });
  }

  renderItem = (row) => {
    const { item } = row;
    return (
      <Contents
        ref={(ref) => { this.addRefs(ref, row); }}
        {...item}
      />
    );
  }

  addRefs = (ref, { item, index }) => {
    this.refs[item.key] = { ref, item, index };
  }

  updateItem = (key, isViewable) => {
    if (!this.refs[key]) return;
    if (!this.refs[key].ref) return;
    this.refs[key].ref.setVisible(isViewable);
  }

  onViewItemChanged = (info) => {
    info.changed.map(({ key, isViewable }) => { this.updateItem(key, isViewable); });
  }

  renderComment = (isBest) => (row) => {
    const { item } = row;
    return (
      <CommentItem
        ref={(ref) => { this.addRefs(ref, row); }}
        {...item}
        bestOnly={isBest}
      />
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
    if (section.index !== 0) {
      return <View style={{ marginBottom: 12 }} />
    }

    const { likes, dislikes, comments } = this.props;

    return (
      <View style={styles.infoPanel}>
        <View style={styles.infoItem}>
          <Ionicons name="ios-thumbs-up-outline" size={25} color="white" />
          <Text style={styles.infoText}>{likes}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="ios-thumbs-down-outline" size={25} color="white" />
          <Text style={styles.infoText}>{dislikes}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="ios-chatboxes-outline" size={25} color="white" />
          <Text style={styles.infoText}>{comments}</Text>
        </View>
        <TouchableOpacity style={styles.infoItem} onPress={this.onPressShare}>
          <Ionicons name="ios-share-outline" size={25} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  refs = {};

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
        onViewableItemsChanged={this.onViewItemChanged}
        stickySectionHeadersEnabled={false}
      />
    );
  }
}
