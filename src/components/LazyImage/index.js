import React, { Component } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

import Indicator from './ImageLoadingIndicator';
import { darkBarkground } from '../../styles/color';

const styles = StyleSheet.create({
  ImageContent: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: darkBarkground,
    width: null,
    height: null,
  },
  ImagePlaceholder: {
    borderRadius: 6,
    flex: 1,
    backgroundColor: darkBarkground,
    justifyContent: 'center',
  },
});

export default class LazyImage extends Component {
  state = {
    isReady: false,
    width: undefined,
    height: 150,
    progress: 0,
  }

  componentDidMount() {
    this.layout = { width: 0, height: 150 };
    Image.prefetch(this.props.source);
  }

  shouldComponentUpdate(props, state) {
    return this.state.isReady !== state.isReady
      || this.state.height !== state.height
      || this.state.width !== state.width;
  }

  onLayout = ({ nativeEvent }) => {
    this.layout.width = nativeEvent.layout.width;
    this.layout.height = nativeEvent.layout.height;
  }

  onLoad = ({ nativeEvent }) => {
    const { fitScreen } = this.props;
    const w = nativeEvent.source.width;
    const h = nativeEvent.source.height;

    let height;
    let width = undefined;
    if (fitScreen) {
      const ratio = this.layout.width / w;
      height = Math.floor(h * ratio);
    } else {
      let ratio;
      if (this.layout.width > w) {
        const half = this.layout.width / 2;
        ratio = half > w ? (half / w) : 1;
      } else {
        ratio = this.layout.width / w;
      }
      height = Math.floor(h * ratio);
      width = this.layout.width < w ? this.layout.width : w;
    }
    this.setState({ height, width });
  }

  onLoadEnd = () => {
    this.setState({
      isReady: true,
    });
  }

  onError = () => {
    console.log(this.props.source.uri);
  }

  layout = { width: 0, height: 150 };

  render() {
    const { source, resizeMode } = this.props;
    const { isReady, height, width } = this.state;
    return (
      <View onLayout={this.onLayout} style={[styles.ImagePlaceholder, { height, width }]}>
        <Image
          style={styles.ImageContent}
          onLoad={this.onLoad}
          onLoadEnd={this.onLoadEnd}
          onError={this.onError}
          source={source}
        />
      </View>
    );
  }
}

