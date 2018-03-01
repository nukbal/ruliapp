import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';

import CommentItem from './CommentItem';
import { background, listItem, primaryOpacity } from '../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 3,
    backgroundColor: listItem,
    marginTop: 8,
  },
  bestContainer: {
    flex: 1,
    borderRadius: 3,
    backgroundColor: primaryOpacity,
    marginTop: 8,
  }
});

export default class Comments extends PureComponent {
  static defaultProps = {
    comments: [],
  }

  render() {
    const { comments, best } = this.props;
    return (
      <FlatList
        style={best ? styles.bestContainer : styles.container}
        data={comments}
        renderItem={({ item }) => <CommentItem {...item} />}
      />
    );
  }
}
