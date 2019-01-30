import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import styles from './styles';
import Placeholder from './placeholder';

interface Props extends PostRecord {
  onPress: () => void;
  onShowUnderlay: any;
  onHideUnderlay: any;
}

function Fixed(n: number) {
  return `0${n}`.slice(-2);
}

export default class BoardItem extends Component<Props> {
  shouldComponentUpdate(props: Props) {
    return this.props.subject !== props.subject ||
      this.props.likes !== props.likes ||
      this.props.views !== props.views ||
      this.props.commentSize !== props.commentSize;
  }

  render() {
    if (!this.props.subject) return <Placeholder />;

    const { subject, user, commentSize, likes, views, date } = this.props;
    const dateStr = date ? `${Fixed(date.getMonth() + 1)}/${Fixed(date.getDay())} ${Fixed(date.getHours())}:${Fixed(date.getMinutes())}` : '';
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        onShowUnderlay={this.props.onShowUnderlay}
        onHideUnderlay={this.props.onHideUnderlay}
        underlayColor="#1A70DC"
      >
        <View style={styles.container}>
          <View style={styles.info}>
            <Text style={styles.titleText} numberOfLines={1}>{subject}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.itemText} numberOfLines={1}>
              {user.name} | 덧글 {commentSize || 0} | 추천 {likes} | 조회 {views} | {dateStr}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
