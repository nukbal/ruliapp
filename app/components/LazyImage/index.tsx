import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Image, { OnLoadEvent, OnProgressEvent } from 'react-native-fast-image';

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
  percent: number;
  size: { width: number, height: number };
}

function setImageSize(image: { width: number, height: number }) {
  let { width } = Dimensions.get('window');
  width = width - 32;

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
  state = { percent: 0, size: { width: 0, height: 0 } };

  shouldComponentUpdate(_: Props, state: State) {
    return this.state.percent !== state.percent ||
      this.state.size.width !== state.size.width;
  }

  onProgress = ({ nativeEvent }: OnProgressEvent) => {
    if (this.state.percent < 100) {
      const percent = Math.round((nativeEvent.loaded / nativeEvent.total) * 100);
      this.setState({ percent });
    }
  }

  onLoad = ({ nativeEvent }: OnLoadEvent) => {
    this.setState({ size: nativeEvent });
  }

  render() {
    const { percent, size } = this.state;

    const containerStyle = [styles.ImageContent, { backgroundColor: '#ededed' }];
    if (size.width) {
      // @ts-ignore
      containerStyle[1] = setImageSize(size);
    }
    return (
      <Image
        style={containerStyle}
        source={this.props.source}
        resizeMode="contain"
        onProgress={this.onProgress}
        onLoad={this.onLoad}
      />
    );
  }
}
