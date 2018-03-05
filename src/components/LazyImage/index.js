import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Image, Text } from 'react-native';
import FastImage from 'react-native-fast-image';

import { throttle } from '../../utils/commonUtils';
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
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    ...StyleSheet.absoluteFillObject,
  },
});

export default class LazyImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: undefined,
      height: 250,
      progress: null,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      const { fitScreen } = this.props;
      Image.getSize(this.props.source, (w, h) => {
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
      });
    }, 0);
  }

  shouldComponentUpdate(props, state) {
    return this.state.height !== state.height
      || this.state.width !== state.width
      || this.state.progress !== state.progress;
  }

  onProgress = ({ nativeEvent }) => {
    const { loaded, total } = nativeEvent;
    this.updateProgress(loaded, total);
  }

  onError = (err) => {
    console.log(this.props.source.uri);
    console.error(err);
  }

  updateProgress = throttle((loaded, total) => {
    const progress = Math.round((loaded / total) * 100);
    this.setState({ progress }); 
  }, 200);

  render() {
    const { source, resizeMode } = this.props;
    const { height, width, progress } = this.state;
    return (
      <View style={[styles.ImagePlaceholder, { height, width }]}>
        <FastImage
          style={styles.ImageContent}
          onLoadEnd={this.onLoadEnd}
          onProgress={this.onProgress}
          onError={this.onError}
          source={source}
        />
        {progress !== null && progress !== 100 && (
          <View style={styles.overlay}>
            <Text style={{ color: 'white', fontSize: 24 }}>{progress}</Text>
          </View>
        )}
      </View>
    );
  }
}

