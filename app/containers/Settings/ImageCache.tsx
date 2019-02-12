import React, { Component } from 'react';
import { TouchableOpacity, Text, Alert, AsyncStorage } from 'react-native';
import fs from 'react-native-fs';
import { IMG_PATH } from '../../config/constants';
import cancel from '../../utils/cancel';
import styles from './styles';

export default class ImageCache extends Component<any, { bytes: number }> {
  state = { bytes: 0 };
  promises: any[] = [];

  shouldComponentUpdate(_: any, state: { bytes: number }) {
    return this.state.bytes !== state.bytes;
  }

  componentDidMount() {
    const p = cancel(fs.readDir(IMG_PATH));
    this.promises.push(p);
    const jobId = this.promises.length;
    p.promise.then((items: fs.ReadDirItem[]) => {
      const bytes = items.reduce((acc, cur) => (acc + parseInt(cur.size, 10)), 0);
      this.setState({ bytes });
      this.promises[jobId] = null;
    }).catch(() => {});
  }

  componentWillUnmount() {
    this.promises.forEach(p => p && p.cancel());
  }

  deleteAll = () => {
    Promise.all([AsyncStorage.getAllKeys(), fs.readDir(IMG_PATH)])
    .then((arr) => {
      const pendings = [];
      pendings.push(
        AsyncStorage.multiRemove(
          arr[0].filter(item => item.indexOf('@Image') > -1),
        ),
      );
      for (let i = 0; i < arr[1].length; i += 1) {
        pendings.push(fs.unlink(arr[1][i].path));
      }
      Promise.all(pendings).then(() => {
        Alert.alert('Done!');
        this.componentDidMount();
      }).catch(() => {});
    }).catch(() => {});
  }

  onPress = () => {
    Alert.alert(
      '이미지 삭제',
      '저장된 모든 이미지 캐시가 삭제됩니다. 진행하시겠습니까?',
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
        <Text>캐시된 이미지: {Math.round(this.state.bytes / 1024)}KB</Text>
      </TouchableOpacity>
    );
  }
}
