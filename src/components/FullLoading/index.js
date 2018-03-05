import React, { PureComponent } from 'react';
import LottieView from 'lottie-react-native';
import { View, StyleSheet } from 'react-native';
import AnimatedJson from '../../assets/empty_status.json';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 350,
  }
});

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
      <View style={styles.container}>
        <LottieView
          ref={animation => {
            this.animation = animation;
          }}
          source={AnimatedJson}
        />
      </View>
    );
  }
}
