import React, { Component } from 'react';
import { TouchableOpacity, Text, Alert, AsyncStorage } from 'react-native';
import cancel from '../../utils/cancel';
import styles from './styles';

export default class ImageCache extends Component<any, { posts: number }> {
  state = { posts: 0 };
  promises: any[] = [];

  shouldComponentUpdate(_: any, state: { posts: number }) {
    return this.state.posts !== state.posts;
  }

  componentDidMount() {
    AsyncStorage.getAllKeys((err, keys) => {
      if (keys) {
        const cachedKey = keys.filter(key => key.indexOf('@Post') > -1);
        this.setState({ posts: cachedKey.length });
      }
    });
  }

  componentWillUnmount() {
    this.promises.forEach(p => p && p.cancel());
  }

  deleteAll = () => {
    if (this.state.posts === 0) return;
    AsyncStorage.getAllKeys((err, keys) => {
      if (keys) {
        AsyncStorage
          .multiRemove(keys.filter(key => key.indexOf('@Post') > -1))
          .then(() => {
            Alert.alert('Done!');
            this.componentDidMount();
          });
      }
    });
  }

  onPress = () => {
    Alert.alert(
      '게시글 캐시 삭제',
      '저장된 모든 게시글 캐시가 삭제됩니다. 진행하시겠습니까?',
      [
        { text: '나중에', onPress: () => null },
        { text: 'OK', onPress: this.deleteAll },
      ],
    )
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.onPress}
      >
        <Text>캐시된 게시글: {this.state.posts}건</Text>
      </TouchableOpacity>
    );
  }
}
