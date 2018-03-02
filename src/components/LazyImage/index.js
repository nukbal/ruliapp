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

  componentWillMount() {
    Image.prefetch(this.props.source);
  }

  shouldComponentUpdate(props, state) {
    return this.state.isReady !== state.isReady
      || this.state.height !== state.height
      || this.state.width !== state.width;
  }

  onLoad = (e) => {
    const { fitScreen } = this.props;
    const w = e.nativeEvent.source.width;
    const h = e.nativeEvent.source.height;

    const CURRENT_SCREEN_SIZE = Dimensions.get('window');
    let height;
    let width = undefined;
    if (fitScreen) {
      const ratio = CURRENT_SCREEN_SIZE.width / w;
      height = Math.floor(h * ratio);
    } else {
      const ratio = CURRENT_SCREEN_SIZE.width > w ? 1 : (CURRENT_SCREEN_SIZE.width / w);
      height = Math.floor(h * ratio);
      width = CURRENT_SCREEN_SIZE.width < w ? CURRENT_SCREEN_SIZE.width : w;
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

  render() {
    const { source, resizeMode } = this.props;
    const { isReady, height, width } = this.state;
    return (
      <View style={[styles.ImagePlaceholder, { height, width }]}>
        {/* {isReady === false && <Indicator />} */}
        <Image
          style={[styles.ImageContent, { height, width }]}
          onLoad={this.onLoad}
          onLoadEnd={this.onLoadEnd}
          onError={this.onError}
          source={source}
        />
      </View>
    );
  }
}

