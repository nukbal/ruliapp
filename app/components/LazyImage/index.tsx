import React, { PureComponent } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import loader from './loader';

const styles = StyleSheet.create({
  ImageContent: {
    flex: 1,
    backgroundColor: '#EEEEEE',
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

function setImageSize(image: { width: number, height: number }, layout: { width: number, height: number }) {
  let { height, width } = layout;

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
  height = Math.floor(image.height * ratio);
  return { width, height };
}

export default class LazyImage extends PureComponent<Props, State> {

  state = { path: undefined, width: 0, height: 0, percent: 0 };
  layout = { width: 0, height: 0 };

  async componentDidMount() {
    this.layout = { width: 0, height: 0 };
    const image = await loader(this.props.source.uri, this.beginDownload);
    if (image) {
      const { path, width, height } = image;
      let layout;
      if (width && height) {
        layout = { width, height };
      }
      this.beginDownload(path, layout);
    }
  }

  beginDownload = (path: string, layout?: { width: number, height: number }) => {
    if (layout) {
      const { width, height } = setImageSize(layout, this.layout);
      this.setState({ path, width, height });
    } else {
      this.setState({ path });
    }
  }

  onLayout = ({ nativeEvent }: any) => {
    const { width, height } = nativeEvent.layout;
    this.layout.width = width;
    this.layout.height = height;
  }

  render() {
    const { path, width, height } = this.state;
    if (path && width && height) {
      return (
        <Image
          style={[styles.ImageContent, { width, height }]}
          source={{ uri: this.state.path }}
          resizeMode="contain"
        />
      );
    }
    return <View style={styles.ImageContent} onLayout={this.onLayout} />;
  }
}
