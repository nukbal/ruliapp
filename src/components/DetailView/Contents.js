import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { listItem, primary } from '../../styles/color';

import LazyImage from '../../containers/LazyImage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: listItem,
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 4,
    paddingBottom: 4,
    margin: 0,
  },
  text: {
    marginBottom: 6,
    color: 'black',
    justifyContent: 'flex-start',
  },
});

export default class ContentItem extends PureComponent {
  state = {
    width: 0,
    height: 0,
    visible: false,
  }

  componentDidMount() {
    this.layout = { width: 0, height: 0 };
  }

  onLayout = ({ nativeEvent }) => {
    const { width, height } = nativeEvent.layout;
    this.layout.width = width;
    this.layout.height = height;
    this.setState({ width, height });
  }

  getElement = () => {
    const { type, content } = this.props;
    const width = this.state.width - 32;
    if (type === 'embeded') {
      return <Text style={styles.text}>{content}</Text>;
    } else if (type === 'image') {
      return <LazyImage source={{ uri: content }} fitScreen maxWidth={width} />
    } else {
      return <Text style={styles.text}>{content}</Text>;
    }
  }

  setVisible = (visible) => {
    if (this.state.visible !== visible) {
      this.setState({ visible });
    }
  }

  render() {
    const { visible } = this.state;
    return (
      <View onLayout={this.onLayout} style={styles.container}>
        {this.getElement()}
      </View>
    );
  }
}
