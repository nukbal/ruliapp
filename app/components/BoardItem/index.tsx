import React, { PureComponent } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { listItem, labelText, primaryLight } from '../../styles/color';

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

interface IBoardItem extends BoardRecord {
  onPress: (payload: LinkType & { subject: string }) => void;
}

export default class BoardItem extends PureComponent<IBoardItem, { touching: boolean }> {
  state = { touching: false }

  beforePress = () => {
    this.setState({ touching: true });
  }

  afterPress = () => {
    this.setState({ touching: false });
  }

  onPress = () => {
    const { onPress, subject, link } = this.props;
    if (!onPress) return;
    if (!link) return;

    onPress({ subject, ...link });
  }

  render() {
    const { subject, comments, author, views, likes } = this.props;
    
    const viewStyle = [styles.container];
    const itemText = [styles.itemText];
    const titleText = [styles.titleText];
    if (this.state.touching) {
      // @ts-ignore
      viewStyle.push({ backgroundColor: primaryLight });
      // @ts-ignore
      itemText.push({ color: 'white' });
      // @ts-ignore
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
            <Text style={titleText} numberOfLines={1}>{subject}</Text>
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
