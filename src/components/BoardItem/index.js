import React, { Component } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { listItem, labelText, border, primaryOpacity } from '../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 8,
  },
  itemContainer: {
    flex: 1,
    padding: 8,
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
  state = {
    visible: false,
  }

  setVisible = (visible) => {
    if (this.state.visible !== visible) {
      this.setState({ visible });
    }
  }

  onPress = () => {
    const { onPress, id, title, prefix, boardId } = this.props;
    if (!onPress) return;

    onPress(id, title, prefix, boardId);
  }

  render() {
    const { title, comments, author, like, views, times, likes } = this.props;
    return (
      <TouchableHighlight style={styles.container} onPress={this.onPress} activeOpacity={0.7}>
        <View style={styles.itemContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <View style={styles.info}>
            <View style={styles.item}>
              <Ionicons name="ios-chatboxes-outline" size={20} color={labelText} />
              <Text style={styles.itemText}>{comments || 0}</Text>
            </View>
            <View style={styles.item}>
              <Ionicons name="ios-heart-outline" size={20} color={labelText} />
              <Text style={styles.itemText}>{likes || 0}</Text>
            </View>
            <View style={styles.item}>
              <Ionicons name="ios-person-outline" size={20} color={labelText} />
              <Text style={styles.itemText}>{views || 0}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
