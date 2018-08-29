import React, { PureComponent } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import {  } from '../../utils/images';

const styles = StyleSheet.create({
  ImageContent: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    height: 200,
  }
});

interface Props {
  source: { uri: string };
  fitScreen?: boolean;
}

interface State {
  path?: string;
  width: number;
  height: number;
}

export default class LazyImage extends PureComponent<Props, State> {

  state = { path: undefined, width: 0, height: 0 };

  componentDidMount() {
    this.layout = { width: 0, height: 0 };
  }

  onLayout = ({ nativeEvent }: any) => {
    const { width, height } = nativeEvent.layout;
    this.layout.width = width;
    this.layout.height = height;
    Image.getSize(this.props.source.uri, this.setImageSize, () => {});
  }

  setImageSize = (w: number, h: number) => {
    let { height, width } = this.layout;

    if (this.props.fitScreen) {
      const ratio = width / w;
      height = Math.floor(h * ratio);
    } else {
      let ratio;
      const half = width / 2;
      if (half > w) {
        ratio = half / w;
        width = half;
      } else if (width > w) {
        ratio = 1;
        width = w;
      } else {
        ratio = width / w;
      }
      height = Math.floor(h * ratio);
    }
    this.setState({ width, height });
  }

  layout = { width: 0, height: 0 };

  render() {
    if (this.state.path) {
      return (
        <Image
          style={this.state}
          source={{ uri: this.state.path }}
          resizeMode="contain"
        />
      );
    }
    return <View style={styles.ImageContent} onLayout={this.onLayout} />;
  }
}
