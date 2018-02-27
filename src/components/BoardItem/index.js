import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { listItem, labelText, border } from '../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 8,
    marginBottom: 8,
    borderRadius: 3,
    backgroundColor: listItem,
    alignItems: 'baseline',
    justifyContent: 'center',
    borderBottomColor: border,
    borderBottomWidth: 1,
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
    color: 'white',
    fontWeight: 'bold',
  },
  itemText: {
    marginLeft: 8,
    fontWeight: 'bold',
    color: labelText,
  }
});

export default class BoardItem extends Component {
  onPress = () => {
    const { onPress, id } = this.props;
    if (!onPress) return;

    onPress(id);
  }

  render() {
    const { title, comments, author, like, views, times, likes } = this.props;
    return (
      <TouchableOpacity onPress={this.onPress}>
        <View style={styles.container}>
          <Text style={styles.titleText}>{title}</Text>
          <View style={styles.info}>
            <View style={styles.item}>
              <FontAwesome name="comment-o" size={20} color={labelText} />
              <Text style={styles.itemText}>{comments || 0}</Text>
            </View>
            <View style={styles.item}>
              <FontAwesome name="thumbs-o-up" size={20} color={labelText} />
              <Text style={styles.itemText}>{likes || 0}</Text>
            </View>
            <View style={styles.item}>
              <FontAwesome name="eye" size={20} color={labelText} />
              <Text style={styles.itemText}>{views || 0}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
