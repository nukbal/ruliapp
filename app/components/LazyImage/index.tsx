import React, { Component } from 'react';
import {
  StyleSheet, View,
  ActivityIndicator,
} from 'react-native';
import Image, { OnLoadEvent, OnProgressEvent } from 'react-native-fast-image';

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
  percent: number;
  size: { width: number, height: number };
  screenWidth: number;
  error: boolean;
}

function setImageSize(image: { width: number, height: number }, screenWidth: number) {
  if (!image.width || !screenWidth) return { backgroundColor: '#ededed' };
  let width = screenWidth;
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
  state = { percent: 0, size: { width: 0, height: 0 }, screenWidth: 0, error: false };

  shouldComponentUpdate(_: Props, state: State) {
    return this.state.percent !== state.percent ||
      this.state.size.width !== state.size.width ||
      this.state.error !== state.error;
  }

  onLayout = ({ nativeEvent }: any) => {
    this.setState({ screenWidth: nativeEvent.layout.width });
  }

  onLoad = ({ nativeEvent }: OnLoadEvent) => {
    this.setState({ size: { width: nativeEvent.width, height: nativeEvent.height } });
  }

  onError = () => {
    this.setState({ error: true });
  }

  render() {
    const { size, error } = this.state;
    if (error) {
      return (<View style={styles.ImageContent} />);
    }

    return (
      <Image
        style={[styles.ImageContent, setImageSize(size, this.state.screenWidth)]}
        source={this.props.source}
        onLayout={this.onLayout}
        onLoad={this.onLoad}
        onError={this.onError}
      />
    );
  }
}
