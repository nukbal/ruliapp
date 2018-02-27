import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import Indicator from './ImageLoadingIndicator';
import { darkBarkground } from '../../styles/color';

const styles = StyleSheet.create({
  ImageContent: {
    flex: 1,
    borderRadius: 3,
    backgroundColor: darkBarkground,
  },
  ImagePlaceholder: {
    marginBottom: 8,
    flex: 1,
    backgroundColor: darkBarkground,
    justifyContent: 'center',
    width: null,
    height: null,
  },
});

export default class LazyImage extends Component {
  state = {
    isReady: false,
    progress: 0,
  }

  shouldComponentUpdate(props, state) {
    return this.state.isReady !== state.isReady;
  }

  onLoadEnd = () => {
    this.setState({
      isReady: true,
    });
  }

  image = null

  render() {
    const { source, resizeMode } = this.props;
    const { isReady } = this.state;
    return (
      <View style={styles.ImagePlaceholder}>
        {isReady === false && <Indicator />}
        <Image
          style={styles.ImageContent}
          onLoadEnd={this.onLoadEnd}
          source={source}
          resizeMode="cover"
        />
      </View>
    );
  }
}

