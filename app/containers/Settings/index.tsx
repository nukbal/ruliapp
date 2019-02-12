import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView, NavigationScreenProp, NavigationEventCallback } from 'react-navigation';
import styles from './styles';
import ImageCache from './ImageCache';
import PostCache from './postCache';

interface Props {
  navigation: NavigationScreenProp<any, { title: string, key: string }>;
}

export default class Setting extends Component<Props> {
  state = { show: true };
  listener: any;
  listener2: any;

  componentDidMount() {
    this.listener = this.props.navigation.addListener('didFocus', this._handleEvent);
    this.listener2 = this.props.navigation.addListener('willBlur', this._handleEvent);
  }

  componentWillUnmount() {
    this.listener.remove();
    this.listener2.remove();
  }

  shouldComponentUpdate(_: Props, state: { show: boolean }) {
    return this.state.show !== state.show;
  }

  _handleEvent: NavigationEventCallback = (evt) => {
    this.setState({ show: evt.type === 'didFocus' });
  }

  render() {
    if (!this.state.show) return null;
    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.headerText}>게시판</Text>
        </View>
        <ImageCache />
        <PostCache />
      </SafeAreaView>
    );
  }
}
