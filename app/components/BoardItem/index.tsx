import React, { PureComponent } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { listItem, labelText, border, primaryLight } from '../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 75,
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: listItem,
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 1,
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
  },
  itemText: {
    marginLeft: 3,
    fontSize: 13,
    color: labelText,
  },
  placeholder: {
    backgroundColor: '#EEEEEE',
    height: 16,
  },
});

export default class BoardItem extends PureComponent {
  state = { touching: false }

  beforePress = () => {
    this.setState({ touching: true });
  }

  afterPress = () => {
    this.setState({ touching: false });
  }

  onPress = () => {
    const { onPress, id, title, prefix, boardId } = this.props;
    if (!onPress) return;

    onPress(id, title, prefix, boardId);
  }

  render() {
    const { title, comments, author, like, views, times, likes, placeholder } = this.props;

    if (placeholder) {
      return (
        <View style={styles.container}>
          <View style={styles.info}>
            <View style={[styles.placeholder, { flex: 1 }]} />
          </View>
          <View style={styles.info}>
            <View style={[styles.placeholder, { width: '65%' }]} />
          </View>
        </View>
      );
    }
    
    const viewStyle = [styles.container];
    const itemText = [styles.itemText];
    const titleText = [styles.titleText];
    if (this.state.touching) {
      viewStyle.push({ backgroundColor: primaryLight });
      itemText.push({ color: 'white' });
      titleText.push({ color: 'white' });
    }
    return (
      <TouchableWithoutFeedback
        onPressIn={this.beforePress}
        onPress={this.onPress}
        onPressOut={this.afterPress}
      >
        <View style={viewStyle}>
          <View style={styles.info}>
            <Text style={titleText} numberOfLines={1}>{title}</Text>
          </View>
          <View style={styles.info}>
            <Text style={itemText} numberOfLines={1}>{author} |</Text>
            <Text style={itemText}>덧글 {comments || 0} |</Text>
            <Text style={itemText}>추천 {likes || 0} |</Text>
            <Text style={itemText}>조회 {views || 0}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
