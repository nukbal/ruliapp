import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Image, Platform } from 'react-native';
import Lightbox from 'react-native-lightbox';
import { darkBarkground } from '../../styles/color';
import Loading from './Loading';

const FILE_PREFIX = Platform.OS === "ios" ? "" : "file://";

const styles = StyleSheet.create({
  ImageContent: {
    flex: 1,
    borderRadius: 3,
    backgroundColor: darkBarkground,
    width: null,
    height: null,
  },
  ImagePlaceholder: {
    borderRadius: 3,
    flex: 1,
    height: 250,
    backgroundColor: darkBarkground,
    justifyContent: 'center',
  },
});

export default class LazyImage extends PureComponent {
  static getDerivedStateFromProps (nextProps, prevState) {
    const w = nextProps.width;
    const h = nextProps.height;
    const { maxWidth } = nextProps;
    if (!(w && h)) {
      return prevState;
    }
  
    let height;
    let width = undefined;
    if (nextProps.fitScreen || maxWidth <= w) {
      const ratio = maxWidth / w;
      height = Math.floor(h * ratio);
      width = maxWidth;
    } else {
      let ratio;
      const half = maxWidth / 2;
      if (half > w) {
        ratio = half / w;
        width = half;
      } else {
        ratio = 1;
        width = w;
      }
      height = Math.floor(h * ratio);
    }
    return { width, height };
  }

  state = { width: null, height: 250 };

  componentDidMount() {
    const { source, id } = this.props;
    this.props.request(source.uri, id);
  }

  render() {
    const { isReady, path, progress, navigator } = this.props;
    return (
      <Lightbox navigator={navigator}>
        {isReady ? (
          <Image
            style={[styles.ImageContent, this.state]}
            source={{ uri: path, isStatic: true }}
          />
        ) : (
          <Loading progress={progress} />
        )}
      </Lightbox>
    );
  }
}
