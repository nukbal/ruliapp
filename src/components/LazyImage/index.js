import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { darkBarkground } from '../../styles/color';

const styles = StyleSheet.create({
  ImageContent: {
    marginBottom: 8,
    flex: 1,
    backgroundColor: darkBarkground,
    width: null,
    height: null,
  },
  ImagePlaceholder: {
    marginBottom: 8,
    flex: 1,
    backgroundColor: darkBarkground,
    height: 150,
  }
});

export default class LazyImage extends Component {
  state = {
    isReady: false,
  }

  // shouldComponentUpdate(props, state) {
  //   return this.state.isReady !== state.isReady;
  // }

  onLoadEnd = () => {
    this.setState({
      isReady: true,
    });
  }

  image = null

  render() {
    return (
      <Image
        style={styles.ImageContent}
        onLoadEnd={this.onLoadEnd}
        {...this.props}
      />
    );
  }
}

