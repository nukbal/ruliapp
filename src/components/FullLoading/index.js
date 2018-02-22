import React, { PureComponent } from 'react';
import LottieView from 'lottie-react-native';
import AnimatedJson from '../../assets/empty_status.json';

export default class FullLoading extends PureComponent {
  componentDidMount() {
    this.animation.play();
  }

  componentWillUnmount() {
    if(this.animation) this.animation.reset();
  }

  animation = null;

  render() {
    return (
      <LottieView
        ref={animation => {
          this.animation = animation;
        }}
        source={AnimatedJson}
      />
    );
  }
}
