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
    marginBottom: 8,
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
    const CURRENT_SCREEN_SIZE = Dimensions.get('window');
    Image.getSize(this.props.source.uri, (w, h) => {
      const ratio = CURRENT_SCREEN_SIZE.width / w;
      const height = Math.floor(h * ratio) - 4;
      this.setState({ height });
    });
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
    const { isReady, height } = this.state;
    return (
      <View style={[styles.ImagePlaceholder, { height }]}>
        {isReady === false && <Indicator />}
        <Image
          ref={(ref) => { this.image = ref; }}
          style={styles.ImageContent}
          onLoadEnd={this.onLoadEnd}
          source={source}
        />
      </View>
    );
  }
}

