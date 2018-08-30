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

export default class LazyImage extends PureComponent<Props, State> {

  state = { path: undefined, width: 0, height: 0, percent: 0 };

  async componentDidMount() {
    this.layout = { width: 0, height: 0 };
    await loader(this.props.source.uri, this.beginDownload);
  }

  beginDownload = (path: string) => {
    this.setState({ path });
  }

  onLayout = ({ nativeEvent }: any) => {
    const { width, height } = nativeEvent.layout;
    this.layout.width = width;
    this.layout.height = height;
    Image.getSize(this.props.source.uri, this.setImageSize, () => {});
  }

  setImageSize = (w: number, h: number) => {
    let { height, width } = this.layout;

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
    this.setState({ width, height });
  }

  layout = { width: 0, height: 0 };

  render() {
    const { path, width, height } = this.state;
    if (path) {
      return (
        <Image
          style={{ width, height }}
          source={{ uri: this.state.path }}
          resizeMode="contain"
        />
      );
    }
    return <View style={styles.ImageContent} onLayout={this.onLayout} />;
  }
}
