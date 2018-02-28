import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { border } from '../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomColor: border,
    borderBottomWidth: 1,
    marginBottom: 3,
  },
  replayContainer: {
    flex: 1,
    paddingLeft: 25,
    borderBottomColor: border,
    borderBottomWidth: 1,
    marginBottom: 3,
  },
  UserContainer: {
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  UserText: {
    color: 'white',
    fontWeight: 'bold',
  },
  CommentContainer: {
    flex: 1,
    padding: 8,
  },
  CommentText: {
    color: 'white',
  }
});

export default class CommentItem extends PureComponent {
  render() {
    const { user, comment, isChild, time } = this.props;
    return (
      <View style={isChild ? styles.replayContainer : styles.container}>
        <View style={styles.UserContainer}>
          <Text style={styles.UserText}>
            {user.name}
          </Text>
          <Text style={styles.UserText}>
            {time}
          </Text>
        </View>
        <View style={styles.CommentContainer}>
          <Text style={styles.CommentText}>{comment}</Text>
        </View>
      </View>
    );
  }
}
