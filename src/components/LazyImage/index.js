import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Image, Text } from 'react-native';
import fs from 'react-native-fs';

import { throttle } from '../../utils/commonUtils';
import { darkBarkground } from '../../styles/color';

const CACHE_DIR = fs.CachesDirectoryPath;

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
      url: null,
    };
    this.layout = { width: 0, height: 250 };
  }

  async componentDidMount() {
    const { source } = this.props;
    const filename = source.uri.substring(source.uri.lastIndexOf('/'), source.uri.length);
    const fileUrl = CACHE_DIR + filename;
    this.setState({ url: fileUrl });

    const isFileExists = await fs.exists(fileUrl);

    if (!isFileExists) {
      const { jobId } = fs.downloadFile({
        fromUrl: source.uri,
        toFile: fileUrl,
        progress: this.onProgress,
        begin: this.onStart,
        progressDivider: 1,
      });
      this.jobId = jobId;
    }
  }

  shouldComponentUpdate(props, state) {
    return this.state.height !== state.height
      || this.state.width !== state.width
      || this.state.progress !== state.progress
      || this.state.url !== state.url;
  }

  onStart = () => {
    const { fitScreen } = this.props;
    Image.getSize(this.state.url, (w, h) => {
      const SCREEN_SIZE = this.layout;
  
      let height;
      let width = undefined;
      if (fitScreen) {
        const ratio = SCREEN_SIZE.width / w;
        height = Math.floor(h * ratio);
        width = SCREEN_SIZE.width;
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
  }

  onProgress = ({ contentLength, bytesWritten }) => {
    this.updateProgress(bytesWritten, contentLength);
  }

  onLayout = ({ nativeEvent }) => {
    this.layout.width = nativeEvent.layout.width;
    this.layout.height = nativeEvent.layout.height;
  }

  onError = (err) => {
    console.log(this.props.source.uri);
    console.error(err);
  }

  updateProgress = throttle((loaded, total) => {
    const progress = Math.round((loaded / total) * 100);
    this.setState({ progress }); 
  }, 200);

  jobId = null;
  layout = { width: 0, height: 250 };

  render() {
    const { source, resizeMode } = this.props;
    const { height, width, progress, url } = this.state;
    return (
      <View onLayout={this.onLayout} style={[styles.ImagePlaceholder, { height, width }]}>
        {url && (
          <Image
            style={styles.ImageContent}
            source={{ uri: url, isStatic: true }}
            resizeMode="contain"
          />
        )}
        {progress !== null && progress !== 100 && (
          <View style={styles.overlay}>
            <Text style={{ color: 'white', fontSize: 24 }}>{progress}</Text>
          </View>
        )}
      </View>
    );
  }
}

