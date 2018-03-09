import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { darkBarkground } from '../../styles/color';
import { getImageConfigByUrl, addImageCache } from '../../store/ducks/cache';

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

export class LazyImage extends PureComponent {

  componentDidMount() {
    const { source } = this.props;
    this.props.request(source.uri);
  }

  onLayout = ({ nativeEvent }) => {
    this.layout.width = nativeEvent.layout.width;
    this.layout.height = nativeEvent.layout.height;
  }

  layout = { width: 0, height: 250 };

  render() {
    const { isReady, path, progress, width, height } = this.props;
    return (
      <View onLayout={this.onLayout} style={[styles.ImagePlaceholder, { height: this.layout.height }]}>
        {isReady && (
          <Image
            style={styles.ImageContent}
            source={{ uri: path, isStatic: true }}
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

function mapDispatchToProps(dispatch) {
  return {
    request: bindActionCreators(addImageCache, dispatch),
  };
}

function mapStateToProps(state, props) {
  const { source } = props;
  const config = getImageConfigByUrl(source.uri)(state);
  return config;
}

export default connect(mapStateToProps, mapDispatchToProps)(LazyImage);
