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
  width: number;
  height: number;
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

  state = { path: undefined, width: 0, height: 0, percent: 0 };
  image: any = undefined;
  promise: any;
  screenWidth = 0;

  componentDidMount() {
    this.promise = loader(this.props.source.uri, undefined, this.updateDownload);
    this.promise.then((image: any) => {
      this.promise = undefined;
      this.image = image;
      if (this.image) {
        const { path, width, height } = this.image;
        let layout;
        if (width && height) {
          layout = { width, height };
        }
        this.downloadHandler(path, layout);
      }
    });
  }

  shouldComponentUpdate(_: Props, state: State) {
    return this.state.percent !== state.percent ||
      this.state.path !== state.path || 
      this.state.height !== state.height;
  }

  componentWillUnmount() {
    this.image = undefined;
    this.promise = undefined;
  }

  downloadHandler = (path: string, layout?: { width: number, height: number }) => {
    if (layout && this.screenWidth) {
      const { width, height } = setImageSize(layout, this.screenWidth);
      this.setState({ path, width, height });
    } else {
      this.setState({ path });
    }
  }

  updateDownload = (percent: number) => {
    if (percent !== this.state.percent && this.state.percent < 100) {
      this.setState({ percent });
    }
  }

  onLayout = ({ nativeEvent }: any) => {
    if (this.screenWidth !== nativeEvent.layout.width) {
      this.screenWidth = nativeEvent.layout.width;
      if (this.state.path) {
        const layout = { width: this.image.width, height: this.image.height };
        const { width, height } = setImageSize(layout, this.screenWidth);
        this.setState({ width, height });
      }
    }
  }

  render() {
    const { path, height, width, percent } = this.state;
    const containerStyle = [styles.ImageContent];
    // @ts-ignore
    if (height && width) containerStyle.push({ height, width });

    if (path) {
      return (
        <Image
          style={containerStyle}
          source={{ uri: path, cache: 'only-if-cached' }}
          resizeMode="contain"
        />
      );
    }

    return (
      <View style={containerStyle} onLayout={this.onLayout}>
        <ActivityIndicator />
        <Text>{percent || 0}</Text>
      </View>
    )
  }
}
