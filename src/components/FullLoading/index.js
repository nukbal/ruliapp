import React, { Component } from 'react';
import { Animated } from 'react-native';
import LottieView from 'lottie-react-native';

export default class FullLoading extends Component {
  state = {
    progress: new Animated.Value(0),
  }

  componentDidMount() {
    this.runAnimation();
  }

  runAnimation() {
    this.state.progress.setValue(0);
    Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 5000,
    }).start(() => this.runAnimation());
  }

  render() {
    return (
      <LottieView
        source={require('../../assets/empty_status.json')}
        progress={this.state.progress}
      />
    );
  }
}
