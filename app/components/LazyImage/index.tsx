import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  AsyncStorage,
  ActivityIndicator,
  LayoutChangeEvent,
} from 'react-native';
import fs from 'react-native-fs';

import compress from '../../utils/compressUrl';
import cancel from '../../utils/cancel';
import { IMG_PATH } from '../../config/constants';

const styles = StyleSheet.create({
  ImageContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  image: {
    flex: 1,
  }
});

interface Props {
  source: { uri: string };
}

interface State {
  uri?: string;
  percent: number;
  size: { width: number, height: number };
  screenWidth: number;
  error: boolean;
}

function setImageSize(image: { width: number, height: number }, screenWidth: number) {
  let width = screenWidth;
  let ratio = 1;
  if (width > image.width) {
    ratio = width / image.width;
    width = image.width;
  } else {
    ratio = width / image.width;
  }
  const height = Math.floor(image.height * ratio);
  return { width, height };
}

function empty() {}

export default class LazyImage extends Component<Props, State> {
  state = {
    uri: undefined,
    percent: 0,
    size: { width: 0, height: 0 },
    screenWidth: 0,
    error: false,
  };
  job: ReturnType<typeof fs.downloadFile> | undefined;
  path: string | undefined;
  promise: Array<{ promise: Promise<any>, cancel: () => void }> = [];

  componentDidMount() {
    const p = cancel<string | null>(
      AsyncStorage.getItem(`@Image:${this.props.source.uri}`),
    );
    this.promise.push(p);
    p.promise.then(this.checkCache).catch(empty);;
  }

  componentWillUnmount() {
    if (this.job) {
      fs.stopDownload(this.job.jobId);
    }
    this.promise.forEach(p => p.cancel());
    this.job = undefined;
  }

  checkCache = (json: string | null) => {
    if (json) {
      const { width, height, path } = JSON.parse(json);
      this.setState({ size: { width, height }, uri: path });
    } else {
      this.path = `${IMG_PATH}/${compress(this.props.source.uri)}`;
      this.job = fs.downloadFile({
        fromUrl: this.props.source.uri,
        toFile: this.path,
        cacheable: false,
        progress: this.onProgress,
      });
      const p = cancel(this.job.promise);
      this.promise.push(p);
      p.promise.then(this.onLoad).catch(empty);
    }
  }

  onError = () => {
    this.setState({ error: true });
  }

  onLoad = () => {
    if (!this.job) return;
    Image.getSize(this.path!, this.getSize, this.onError);
  }

  getSize = (width: number, height: number) => {
    const _prom = AsyncStorage.setItem(
      `@Image:${this.props.source.uri}`,
      JSON.stringify({ path: this.path, width, height }),
    );
    const p =  cancel(_prom);
    this.promise.push(p);
    p.promise.then(() => {
      if (!this.job) return;
      this.setState({ size: { width, height }, uri: this.path });
      this.job = undefined;
    }).catch(empty);
  }

  onProgress = ({ contentLength, bytesWritten }: fs.DownloadProgressCallbackResult) => {
    if (bytesWritten < contentLength) {
      const percent = Math.round(bytesWritten / contentLength * 100);
      this.setState({ percent });
    }
  }

  onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    this.setState({ screenWidth: nativeEvent.layout.width });
  }

  shouldComponentUpdate(_: Props, state: State) {
    return this.state.percent !== state.percent ||
      this.state.uri !== state.uri ||
      this.state.screenWidth !== state.screenWidth ||
      this.state.error !== state.error;
  }

  render() {
    const { size, error, screenWidth, uri, percent } = this.state;
    if (error) {
      return (
        <View style={styles.ImageContent}>
          <Text>불러오기 실패</Text>
        </View>
      );
    }
    if (!(screenWidth > 0 && uri && size.width)) {
      return (
        <View
          style={[styles.ImageContent, { backgroundColor: '#ededed' }]}
          onLayout={this.onLayout}
        >
          <ActivityIndicator />
          {percent ? (<Text>{percent || '0'}</Text>) : null}
        </View>
      );
    }

    return (
      <Image
        style={[styles.ImageContent, setImageSize(size, screenWidth)]}
        source={{ uri }}
      />
    );
  }
}
