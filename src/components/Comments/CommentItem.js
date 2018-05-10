import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import LazyImage from '../LazyImage';
import { border, primary, labelText, listItem, primaryOpacity, commentHeader } from '../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginBottom: 1,
    justifyContent: 'center',
    backgroundColor: listItem,
  },
  childContainer: {
    flex: 1,
    padding: 16,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  UserText: {
    color: 'black',
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    paddingRight: 6,
  },
  timeText: {
    fontSize: 13,
    color: labelText,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
  },
  CommentContainer: {
    flex: 1,
    paddingTop: 8,
    justifyContent: 'flex-start',
    alignItems: 'baseline',
  },
  CommentText: {
    color: 'black',
    lineHeight: 21,
    justifyContent: 'flex-start',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bestText: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 13,
    backgroundColor: primary,
    color: 'white',
  },
  placeholder: {
    backgroundColor: '#EEEEEE',
    height: 16,
  },
});

export default class CommentItem extends PureComponent {
  state = {
    width: 0,
  }

  onLayout = ({ nativeEvent }) => {
    const { width } = nativeEvent.layout;
    this.setState({ width });
  }

  render() {
    if (this.props.placeholder) {
      return (
        <View style={[styles.container, { width: '100%', height: 80 }]}>
          <View style={styles.UserContainer}>
            <View style={[styles.placeholder, { width: 150 }]} />
            <View style={[styles.placeholder, { width: 50 }]} />
          </View>
          <View style={[styles.CommentContainer, { paddingTop: 0 }]}>
            <View style={[styles.placeholder]} />
            <View style={[styles.placeholder, { width: '65%' }]} />
          </View>
        </View>
      );
    }

    const { user, comment, isChild, time, isBest, like, dislike, image, bestOnly } = this.props;
    const { width } = this.state;
    const maxWidth = isChild ? width - 32 : width - 24;
    const containerStyle = [isChild ? styles.childContainer : styles.container];
    if (bestOnly) containerStyle[1] = styles.bestContainer;
    return (
      <View onLayout={this.onLayout} style={containerStyle}>
        <View style={styles.UserContainer}>
          <View style={styles.horizontal}>
            <Text style={styles.UserText}>
              {user.name}
            </Text>
            {isBest && (<Text style={styles.bestText}>BEST</Text>)}
          </View>
          <Text style={styles.timeText}>
            {time}
          </Text>
        </View>
        <View style={styles.CommentContainer}>
          {image && (<LazyImage source={{ uri: image }} maxWidth={maxWidth} />)}
          <Text style={styles.CommentText}>{comment}</Text>
        </View>
        <View style={styles.infoContainer}>
          <FontAwesome name="thumbs-o-up" size={20} color={primary}/>
          <Text style={[styles.UserText, { marginLeft: 6 }]}>{like}</Text>
          <FontAwesome name="thumbs-o-down" size={20} color={primary}/>
          <Text style={[styles.UserText, { marginLeft: 6 }]}>{dislike}</Text>
        </View>
      </View>
    );
  }
}
