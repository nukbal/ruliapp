import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LazyImage from '../../containers/LazyImage';
import { border, primary, listItem, primaryOpacity } from '../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 1,
    justifyContent: 'center',
    backgroundColor: listItem,
  },
  childContainer: {
    flex: 1,
    paddingLeft: 25,
    marginBottom: 3,
    justifyContent: 'center',
    backgroundColor: listItem,
  },
  bestContainer: {
    backgroundColor: primaryOpacity,
  },
  UserContainer: {
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  UserText: {
    color: 'black',
    justifyContent: 'flex-start',
  },
  CommentContainer: {
    flex: 1,
    padding: 8,
    justifyContent: 'flex-start',
  },
  CommentText: {
    color: 'black',
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
    height: 0,
    width: 0,
    visible: false,
  }

  componentDidMount() {
    this.layout = { width: 0, height: 0 };
  }

  setVisible = (visible) => {
    if (this.state.visible !== visible) {
      this.setState({ visible });
    }
  }

  onLayout = ({ nativeEvent }) => {
    const { width, height } = nativeEvent.layout;
    this.layout.width = width;
    this.layout.height = height;
    this.setState({ width, height });
  }

  layout = { width: 0, height: 0 };

  render() {
    const { user, comment, isChild, time, isBest, like, dislike, image, bestOnly } = this.props;
    const { visible, width } = this.state;
    const maxWidth = isChild ? width - 22 : width - 16;
    const containerStyle = [isChild ? styles.childContainer : styles.container];
    if (bestOnly) containerStyle[1] = styles.bestContainer;
    return (
      <View onLayout={this.onLayout} style={containerStyle}>
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
          {image && (<LazyImage source={{ uri: image }} maxWidth={maxWidth} />)}
          <Text style={styles.CommentText}>{comment}</Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={[styles.horizontal, { marginRight: 6 }]}>
            <Ionicons name="ios-thumbs-up-outline" size={20} color="black" />
            <Text style={[styles.UserText, { marginLeft: 6 }]}>{like}</Text>
          </View>
          <View style={[styles.horizontal, { marginRight: 6 }]}>
            <Ionicons name="ios-thumbs-down-outline" size={20} color="black" />
            <Text style={[styles.UserText, { marginLeft: 6 }]}>{dislike}</Text>
          </View>
        </View>
      </View>
    );
  }
}
