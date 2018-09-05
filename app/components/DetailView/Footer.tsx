import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Share,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { primary } from '../../styles/color';

const styles = StyleSheet.create({
  infoPanel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: primary,
  },
  infoItem: {
    flex: 1,
    padding: 8,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 6,
    fontWeight: 'bold',
    color: 'white'
  },
});

interface Props {
  url: string;
  likes: number;
  dislikes: number;
  comments: number;
}

export default class ContentFooter extends Component<Props> {
  static defaultProps = {
    likes: 0,
    dislikes: 0,
    comments: 0,
  }

  shouldComponentUpdate(props: Props) {
    return props.likes !== this.props.likes ||
      props.dislikes !== this.props.dislikes;
  }

  onPressShare = () => {
    Share.share({ url: this.props.url });
  }

  render() {
    const { likes, dislikes, comments } = this.props;
    return (
      <View style={styles.infoPanel}>
        {likes > 0 && (
          <View style={styles.infoItem}>
            <Icon name="thumb-up" size={20} color="white"/>
            <Text style={styles.infoText}>{likes}</Text>
          </View>
        )}
        {dislikes > 0 && (
          <View style={styles.infoItem}>
            <Icon name="thumb-down" size={20} color="white"/>
            <Text style={styles.infoText}>{dislikes}</Text>
          </View>
        )}
        {comments > 0 && (
          <View style={styles.infoItem}>
            <Icon name="message" size={20} color="white"/>
            <Text style={styles.infoText}>{comments}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.infoItem} onPress={this.onPressShare}>
          <Icon name="link" size={20} color="white"/>
        </TouchableOpacity>
      </View>
    );
  }
}
