import React, { PureComponent } from 'react';
import { StyleSheet, Image, View } from 'react-native';

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
  width?: number;
  height?: number;
}

export default class LazyImage extends PureComponent<Props, State> {

  state = { width: undefined, height: undefined };

  componentDidMount() {
    Image.prefetch(this.props.source.uri);
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
    const { source } = this.props;
    if (this.state.width === null) {
      return <View style={styles.ImageContent} onLayout={this.onLayout} />;
    }
    return (
      <Image
        style={this.state}
        source={source}
        resizeMode="contain"
      />
    );
  }
}
