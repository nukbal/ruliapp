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

  componentDidMount() {
    this.refs = {};
  }

  renderItem = (row) => {
    const { item } = row;
    return (
      <CommentItem
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
  
  refs = {}

  render() {
    const { comments, best } = this.props;
    return (
      <FlatList
        style={best ? styles.bestContainer : styles.container}
        data={comments}
        renderItem={this.renderItem}
        onViewableItemsChanged={this.onViewItemChanged}
        onEndReachedThreshold={30}
      />
    );
  }
}
