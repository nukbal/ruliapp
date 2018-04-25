import React, { PureComponent } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { listItem, labelText, border, primaryOpacity } from '../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 75,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    flex: 1,
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: listItem,
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    flexWrap:'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleText: {
    color: 'black',
    marginBottom: 2,
  },
  itemText: {
    marginLeft: 3,
    fontSize: 12,
    color: labelText,
  },
  authorText: {
    fontSize: 12,
    color: labelText,
  },
});

export default class BoardItem extends PureComponent {
  onPress = () => {
    const { onPress, id, title, prefix, boardId } = this.props;
    if (!onPress) return;

    onPress(id, title, prefix, boardId);
  }

  render() {
    const { title, comments, author, like, views, times, likes } = this.props;

    return (
      <TouchableHighlight style={styles.container} onPress={this.onPress} >
        <View style={styles.itemContainer}>
          <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
          <View style={styles.info}>
            <View style={styles.info}>
              <Text style={styles.authorText} numberOfLines={1}>{author}</Text>
            </View>
            <View style={styles.info}>
              <View style={styles.item}>
                <Ionicons name="ios-chatboxes-outline" size={16} color={labelText} />
                <Text style={styles.itemText}>{comments || 0}</Text>
              </View>
              <View style={styles.item}>
                <Ionicons name="ios-heart-outline" size={16} color={labelText} />
                <Text style={styles.itemText}>{likes || 0}</Text>
              </View>
              <View style={styles.item}>
                <Ionicons name="ios-person-outline" size={16} color={labelText} />
                <Text style={styles.itemText}>{views || 0}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
