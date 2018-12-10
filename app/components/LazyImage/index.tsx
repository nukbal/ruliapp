import React, { Component } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import Image from 'react-native-fast-image';
import { stopDownload } from 'react-native-fs';
import loader from './loader';
import handle from '../../utils/handle';

const styles = StyleSheet.create({
  ImageContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  }
});

interface Props {
  source: { uri: string };
}

interface State {
  path?: string;
  screenWidth: number;
  percent: number;
}

function setImageSize(image: { width: number, height: number }, screenWidth: number) {
  let width = screenWidth;

  let ratio;
  const half = width / 2;
  if (half > image.width) {
    ratio = half / image.width;
    width = half;
  } else if (width > image.width) {
    ratio = 1;
    width = image.width;
  } else {
    ratio = width / image.width;
  }
  const height = Math.floor(image.height * ratio);
  return { width, height };
}

export default class LazyImage extends Component<Props, State> {

  state = { path: undefined, percent: 0, screenWidth: 0 };
  jobId?: number = undefined;
  image: any = undefined;
  loader: any;
  screenWidth = 0;

  componentDidMount() {
    this.loader = handle(loader(this.props.source.uri, this.onStartDownload, this.updateDownload));
    this.loader.promise.then((image: any) => {
      this.loader = undefined;
      this.jobId = undefined;
      this.image = image;
      if (this.image) {
        this.setState({ path: this.image.path });
      }
    });
  }

  shouldComponentUpdate(_: Props, state: State) {
    return this.state.percent !== state.percent ||
      this.state.path !== state.path || 
      this.state.screenWidth !== state.screenWidth;
  }

  componentWillUnmount() {
    if (this.jobId) stopDownload(this.jobId);
    if (this.loader) this.loader.cancel();

    this.image = undefined;
    this.loader = undefined;
  }

  onStartDownload = (path: string, id?: number) => {
    this.jobId = id;
  }

  updateDownload = (percent: number) => {
    if (percent !== this.state.percent && this.state.percent < 100) {
      this.setState({ percent });
    }
  }

  onLayout = ({ nativeEvent }: any) => {
    if (this.state.screenWidth !== nativeEvent.layout.width) {
      this.setState({ screenWidth: nativeEvent.layout.width });
    }
  }

  render() {
    const { path, percent, screenWidth } = this.state;

    if (path && screenWidth) {
      const containerStyle = [styles.ImageContent, setImageSize(this.image, screenWidth)];
      return (
        <Image
          style={containerStyle}
          source={{ uri: path }}
          resizeMode="contain"
        />
      );
    }

    return (
      <View style={[styles.ImageContent, { backgroundColor: '#dedede' }]} onLayout={this.onLayout}>
        <ActivityIndicator />
        <Text>{percent || 0}</Text>
      </View>
    )
  }
}
