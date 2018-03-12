import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Image, Platform } from 'react-native';
import { darkBarkground } from '../../styles/color';

const FILE_PREFIX = Platform.OS === "ios" ? "" : "file://";

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
    height: 250,
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

export default class LazyImage extends PureComponent {

  state = { width: null, height: null };

  componentDidMount() {
    const { source, id } = this.props;
    this.props.request(source.uri, id);
  }

  componentDidUpdate(props) {
    if (this.props.width !== props.width && this.props.height !== props.height) {
      this.getSize();
    }
  }

  onLayout = ({ nativeEvent }) => {
    const { width, height } = nativeEvent.layout;
    if (!height) {
      this.setState({ width, height: 250 });
    } else {
      this.setState({ width, height });
    }
  }

  getSize = () => {
    const SCREEN_SIZE = this.state;
    const w = this.props.width;
    const h = this.props.height;
    if (!(w && h)) {
      return;
    }
  
    let height;
    let width = undefined;
    if (this.props.fitScreen) {
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
    this.setState({ width, height });
  }

  render() {
    const { isReady, path, progress } = this.props;
    return (
      <View onLayout={this.onLayout} style={[styles.ImagePlaceholder, this.state]}>
        {isReady ? (
          <Image
            style={styles.ImageContent}
            source={{ uri: path, isStatic: true }}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.overlay}>
            <Text style={{ color: 'white', fontSize: 24 }}>{progress}</Text>
          </View>
        )}
      </View>
    );
  }
}
