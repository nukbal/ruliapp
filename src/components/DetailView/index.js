import React, { PureComponent } from 'react';
import { ScrollView, View, Text, StyleSheet, Share, FlatList, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { darkBarkground, border, listItem, primary } from '../../styles/color';

import Contents from './Contents';
import Comments from '../Comments';
import LazyImage from '../LazyImage';

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

  componentWillMount() {
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
    if (!this.refs[key].ref) return;
    this.refs[key].ref.setVisible(isViewable);
  }

  onViewItemChanged = (info) => {
    info.changed.map(({ key, isViewable }) => { this.updateItem(key, isViewable); });
  }

  refs = {};

  render() {
    const {
      title,
      contents,
      commentList,
      bestCommentList,
      comments,
      loading,
      likes,
      dislikes,
    } = this.props;
    return (
      <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={this.props.refresh} />}
      >
        <FlatList
          data={contents}
          renderItem={this.renderItem}
          ListHeaderComponent={(
            <View style={styles.title}>
              <Text style={styles.titleText}>{title}</Text>
            </View>
          )}
          ListFooterComponent={(
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
              <View style={styles.infoItem}>
                <Ionicons name="ios-share-outline" size={25} color="white" onPress={this.onPressShare} />
              </View>
            </View>
          )}
          onViewableItemsChanged={this.onViewItemChanged}
          removeClippedSubviews
        />
        {bestCommentList.length > 0 && (<Comments comments={bestCommentList} best />)}
        <Comments comments={commentList} />
      </ScrollView>
    );
  }
}
