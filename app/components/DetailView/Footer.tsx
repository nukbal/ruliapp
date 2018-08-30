import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Share,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
  likes?: string;
  dislike?: string;
}

export default class ContentFooter extends Component<Props> {
  shouldComponentUpdate(props: Props) {
    return props.likes !== this.props.likes ||
      props.dislike !== this.props.dislike;
  }

  onPressShare = () => {
    Share.share({ url: this.props.url });
  }

  render() {
    const { likes, dislike } = this.props;
    return (
      <View style={styles.infoPanel}>
        {likes && (
          <View style={styles.infoItem}>
            <FontAwesome name="thumbs-o-up" size={20} color="white"/>
            <Text style={styles.infoText}>{likes}</Text>
          </View>
        )}
        {dislike && (
          <View style={styles.infoItem}>
            <FontAwesome name="thumbs-o-down" size={20} color="white"/>
            <Text style={styles.infoText}>{dislike}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.infoItem} onPress={this.onPressShare}>
          <FontAwesome name="share-square-o" size={20} color="white"/>
        </TouchableOpacity>
      </View>
    );
  }
}
