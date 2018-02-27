import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { background, listItem } from '../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 3,
    backgroundColor: listItem,
    marginTop: 8,
  }
});

export default class Comments extends Component {
  static defaultProps = {
    comments: [],
  }

  render() {
    const { comments } = this.props;
    return (
      <View style={styles.container}>
        {comments.length > 0 && comments.map((item, i) => {
          console.log(item);
          return (<Text key={`comment_${i}`}>{item.comment}</Text>);
        })}
      </View>
    );
  }
}
