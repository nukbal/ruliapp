import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Image from 'react-native-fast-image';

import Indicator from './ImageLoadingIndicator';
import { debounce } from '../../utils/commonUtils';
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
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      width: undefined,
      height: 300,
      progress: 0,
    };
  }

  shouldComponentUpdate(props, state) {
    return this.state.isReady !== state.isReady
      || this.state.height !== state.height
      || this.state.width !== state.width;
  }

  onLayout = ({ nativeEvent }) => {
    const { fitScreen } = this.props;
    const w = nativeEvent.layout.width;
    const h = nativeEvent.layout.height;

    const SCREEN_SIZE = Dimensions.get('window')

    let height;
    let width = undefined;
    if (fitScreen) {
      const ratio = SCREEN_SIZE.width / w;
      height = Math.floor(h * ratio);
    } else {
      let ratio;
      if (SCREEN_SIZE.width > w) {
        const half = SCREEN_SIZE.width / 2;
        ratio = half > w ? (half / w) : 1;
      } else {
        ratio = SCREEN_SIZE.width / w;
      }
      height = Math.floor(h * ratio);
      width = SCREEN_SIZE.width < w ? SCREEN_SIZE.width : w;
    }
    this.setState({ height, width });
  }

  onProgress = ({ nativeEvent }) => {
    const { loaded, total } = nativeEvent;
    debounce(() => {
      const progress = Math.round((loaded / total) * 100);
      console.log(`${this.props.source.uri} : ${progress}%`);
      this.setState({ progress }); 
    }, 1000);
  }

  onLoadEnd = () => {
    this.setState({
      progress: 100,
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
        <Image
          style={styles.ImageContent}
          onLoadEnd={this.onLoadEnd}
          onProgress={this.onProgress}
          onError={this.onError}
          source={source}
        />
      </View>
    );
  }
}

