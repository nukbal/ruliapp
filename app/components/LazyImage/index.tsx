import React, { Component } from 'react';
import { StyleSheet, Image, View, Text, ActivityIndicator } from 'react-native';
import loader from './loader';

const styles = StyleSheet.create({
  ImageContent: {
    flex: 1,
    backgroundColor: '#dedede',
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
  image: any = undefined;
  promise: any;
  screenWidth = 0;

  componentDidMount() {
    this.promise = loader(this.props.source.uri, undefined, this.updateDownload);
    this.promise.then((image: any) => {
      this.promise = undefined;
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
    this.image = undefined;
    this.promise = undefined;
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
      <View style={styles.ImageContent} onLayout={this.onLayout}>
        <ActivityIndicator />
        <Text>{percent || 0}</Text>
      </View>
    )
  }
}
