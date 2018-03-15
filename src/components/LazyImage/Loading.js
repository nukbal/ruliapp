import React, { PureComponent } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import AnimatedJson from '../../assets/loader.json';
import { primaryOpacity } from '../../styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 250,
    backgroundColor: primaryOpacity,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    color: 'white',
    top: 0,
    left: 0,
  }
});

export default class ImageLoading extends PureComponent {
  componentDidMount() {
    this.animation.play();
  }

  componentWillUnmount() {
    if(this.animation) this.animation.reset();
  }

  animation = null;

  render() {
    return (
      <View style={styles.container}>
        <LottieView ref={(ref) => { this.animation = ref; }} source={AnimatedJson} />
        <Text style={styles.progressText}>{this.props.progress}</Text>
      </View>
    );
  }
}
