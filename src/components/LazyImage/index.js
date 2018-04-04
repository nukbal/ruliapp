import React, { PureComponent } from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import Lightbox from 'react-native-lightbox';
import { darkBarkground } from '../../styles/color';

const styles = StyleSheet.create({
  ImageContent: {
    flex: 1,
  },
  placeholder: {
    height: 250,
    ...StyleSheet.absoluteFillObject,
  }
});

export default class LazyImage extends PureComponent {

  state = { width: null, height: 250 };

  componentDidMount() {
    this.layout = { width: 0, height: 0 };
  }

  onLayout = ({ nativeEvent }) => {
    const { width, height } = nativeEvent.layout;
    this.layout.width = width;
    this.layout.height = height;
  }

  onLoad = ({ nativeEvent }) => {
    if (!nativeEvent.width || !nativeEvent.height) {
      Image.getSize(this.props.source.uri, (width, height) => {
        this.setImageSize({ width, height });
      });
      return;
    }
    this.setImageSize(nativeEvent);
  }

  setImageSize = (layout) => {
    const w = layout.width;
    const h = layout.height;

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

  render() {
    const { navigator, source } = this.props;
    return (
      <FastImage
        style={[styles.ImageContent, this.state]}
        source={source}
        onLoad={this.onLoad}
        onLayout={this.onLayout}
        resizeMode="contain"
      />
    );
  }
}
