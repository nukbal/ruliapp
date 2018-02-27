import React, { PureComponent } from 'react';
import LottieView from 'lottie-react-native';
import AnimatedJson from '../../assets/loader.json';

export default class ImageLoadingIndicator extends PureComponent {
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
