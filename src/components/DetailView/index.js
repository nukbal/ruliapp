import React, { PureComponent } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { darkBarkground, border, listItem, primary } from '../../styles/color';

import Comments from '../Comments';
import LazyImage from '../LazyImage';

const styles = StyleSheet.create({
  title: {
    flex: 1,
    marginBottom: 6,
    borderRadius: 3,
    padding: 8,
    backgroundColor: listItem,
    borderBottomColor: border,
    borderBottomWidth: 1,
  },
  titleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 4,
    padding: 8,
    borderRadius: 3,
    minHeight: 250,
    backgroundColor: listItem,
    justifyContent: 'flex-start',
  },
  TextContent: {
    marginBottom: 6,
    color: 'white',
  },
  infoPanel: {
    flex: 1,
    backgroundColor: primary,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});


export default class DetailView extends PureComponent {
  static defaultProps = {
    contents: [],
    commentList: [],
  }

  renderContentRow = (item) => {
    switch(item.type) {
      case 'embeded':
        return (<Text style={styles.TextContent} key={item.key}>{item.content}</Text>);
      case 'image':
        return (
          <LazyImage
            key={item.key}
            source={{ uri: item.content }}
          />
        );
      default:
        return (<Text style={styles.TextContent} key={item.key}>{item.content}</Text>);
        break;
    }
  }

  render() {
    const { title, contents, commentList } = this.props;
    return (
      <ScrollView>
      <View style={styles.title}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
      <View style={styles.content}>
        {contents.length > 0 && contents.map(this.renderContentRow)}
      </View>
      <View style={styles.infoPanel}>
        <View style={styles.infoItem}>
          <Text>1</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="ios-chatboxes-outline" size={20} color="white" />
          <Text>2</Text>
        </View>
      </View>
      <Comments comments={commentList} />
    </ScrollView>
    );
  }
}
