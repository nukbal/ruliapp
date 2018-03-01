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
    height: 150,
    progress: 0,
  }

  componentWillMount() {
    Image.prefetch(this.props.source);
  }

  shouldComponentUpdate(props, state) {
    return this.state.isReady !== state.isReady
      || this.state.height !== state.height;
  }

  onLoad = (e) => {
    const w = e.nativeEvent.source.width;
    const h = e.nativeEvent.source.height;

    const CURRENT_SCREEN_SIZE = Dimensions.get('window');
    const ratio = CURRENT_SCREEN_SIZE.width / w;
    const height = Math.floor(h * ratio);
    this.setState({ height });
  }

  onLoadEnd = () => {
    this.setState({
      isReady: true,
    });
  }

  render() {
    const { source, resizeMode } = this.props;
    const { isReady, height } = this.state;
    return (
      <View style={[styles.ImagePlaceholder, { height }]}>
        {isReady === false && <Indicator />}
        <Image
          style={styles.ImageContent}
          onLoad={this.onLoad}
          onLoadEnd={this.onLoadEnd}
          source={source}
        />
      </View>
    );
  }
}

