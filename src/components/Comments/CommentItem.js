import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LazyImage from '../LazyImage';
import { border, primary } from '../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomColor: border,
    borderBottomWidth: 1,
    marginBottom: 3,
    justifyContent: 'center',
  },
  childContainer: {
    flex: 1,
    paddingLeft: 25,
    borderBottomColor: border,
    borderBottomWidth: 1,
    marginBottom: 3,
    justifyContent: 'center',
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
    justifyContent: 'flex-start',
  },
  CommentContainer: {
    flex: 1,
    padding: 8,
    justifyContent: 'flex-start',
  },
  CommentText: {
    color: 'white',
    justifyContent: 'flex-start',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    padding: 3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bestIcon: {
    backgroundColor: primary,
    color: 'white',
    padding: 6,
    paddingTop: 2,
    paddingBottom: 2,
    marginLeft: 6,
  }
});

export default class CommentItem extends PureComponent {
  state = {
    visible: false,
  }

  setVisible = (visible) => {
    if (this.state.visible !== visible) {
      this.setState({ visible });
    }
  }

  render() {
    const { user, comment, isChild, time, isBest, like, dislike, image } = this.props;
    const { visible } = this.state;
    if (!visible) return <View style={[styles.container]} />
    return (
      <View style={isChild ? styles.childContainer : styles.container}>
        <View style={styles.UserContainer}>
          <View style={styles.horizontal}>
            <Text style={styles.UserText}>
              {user.name}
            </Text>
            {isBest && (<Text style={styles.bestIcon}>BEST</Text>)}
          </View>
          <Text style={styles.UserText}>
            {time}
          </Text>
        </View>
        <View style={styles.CommentContainer}>
          {image && (<LazyImage source={{ uri: image }} />)}
          <Text style={styles.CommentText}>{comment}</Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={[styles.horizontal, { marginRight: 6 }]}>
            <Ionicons name="ios-thumbs-up-outline" size={20} color="white" />
            <Text style={[styles.UserText, { marginLeft: 6 }]}>{like}</Text>
          </View>
          <View style={[styles.horizontal, { marginRight: 6 }]}>
            <Ionicons name="ios-thumbs-down-outline" size={20} color="white" />
            <Text style={[styles.UserText, { marginLeft: 6 }]}>{dislike}</Text>
          </View>
        </View>
      </View>
    );
  }
}
