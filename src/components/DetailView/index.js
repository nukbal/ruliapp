import React, { PureComponent } from 'react';
import { ScrollView, View, Text, StyleSheet, Share, FlatList } from 'react-native';
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
    Share.share({ url: `http://bbs.ruliweb.com/${prefix}/board/${boardId}/read/${articleId}` });
  }

  render() {
    const { title, contents, commentList, bestCommentList, comments } = this.props;
    return (
      <ScrollView>
        <FlatList
          data={contents}
          renderItem={({ item }) => <Contents {...item} />}
          ListHeaderComponent={(
            <View style={styles.title}>
              <Text style={styles.titleText}>{title}</Text>
            </View>
          )}
          ListFooterComponent={(
            <View style={styles.infoPanel}>
              <View style={styles.infoItem}>
                <Ionicons name="ios-chatboxes-outline" size={25} color="white" />
                <Text>{comments}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="ios-share-outline" size={25} color="white" onPress={this.onPressShare} />
              </View>
            </View>
          )}
        />
        {bestCommentList.length > 0 && (<Comments comments={bestCommentList} best />)}
        <Comments comments={commentList} />
      </ScrollView>
    );
  }
}
