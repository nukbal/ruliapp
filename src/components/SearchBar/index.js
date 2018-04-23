import React, { PureComponent } from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 51,
    padding: 8,
    flexWrap: 'wrap', 
    flexDirection:'row',
    alignItems: 'center'
  },
  inputWrapper: {
    flex: 10,
    flexWrap: 'wrap', 
    alignItems: 'flex-start',
    flexDirection:'row',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  textInput: {
    flex: 1,
    paddingLeft: 8,
  },
  filter: {
    flex: 2,
    paddingTop: 8,
    paddingBottom: 8,
    flexWrap: 'wrap', 
    alignItems: 'flex-start',
    flexDirection:'row',
    justifyContent: 'center',
  }
});

export default class SearchInput extends PureComponent {
  state = {
    width: null,
    value : '',
    isFocused: false,
  }

  onLayout = ({ nativeEvent }) => {
    this.width = nativeEvent.layout.width - 16;
    this.setState({width: new Animated.Value(this.width) });
  }

  onChangeText = (value) => {
    this.setState({ value });
    if (this.props.onChange) this.props.onChange(value);
  }

  onFocus = () => {
    Animated.timing(this.state.width, {
      toValue: 0.8 * this.width,
      duration: 500,
    }).start(() => this.setState({ isFocused: true }));
  }

  onBlur = () => {
    Animated.timing(this.state.width, {
      toValue: this.width,
      duration: 500,
    }).start(() => this.setState({ isFocused: false }));
  }

  onCancel = () => {
    Animated.timing(this.state.width, {
      toValue: this.width,
      duration: 500,
    }).start(() => {
      this.setState({ isFocused: false, value: '' }); }
    );
  }
  
  onClear = () => {
    this.setState({ value: '' });
  }

  element = null
  width = null

  render() {
    const { value, isFocused, width } = this.state;
    return(
      <View style={styles.container} onLayout={this.onLayout}>
        <Animated.View style={[styles.inputWrapper, { width }]}>
          <Ionicons name="ios-search" size={17} />
          <TextInput
            ref={(ref) => { this.element = ref; }}
            style={styles.textInput}
            placeholder="검색하기"
            autoCapitalize="none"
            clearButtonMode="while-editing"
            value={value}
            onChangeText={this.onChangeText}
            onFocus={this.onFocus}
          />
        </Animated.View>
        {isFocused && (
          <TouchableOpacity style={styles.filter} onPress={this.onCancel}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
