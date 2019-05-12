import React, { useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
} from 'react-native';
import { animated, useSpring } from 'react-spring/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { primary } from '../../../styles/color';

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
    flexWrap: 'wrap', 
    alignItems: 'flex-start',
    flexDirection:'row',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e5e5e5',
  },
  textInput: {
    flex: 1,
    paddingLeft: 8,
  },
  filter: {
    flexWrap: 'wrap', 
    alignItems: 'flex-start',
    flexDirection:'row',
    justifyContent: 'center',
  },
  cancelText: {
    color: primary,
    width: 65,
    fontSize: 17,
    padding: 8,
    textAlign: 'center',
  }
});

const AnimatedView = animated(View);
const AnimatedTextInput = animated(TextInput);

interface Props {
  keyboardType?: '' | 'default';
  returnKeyType?: '' | 'search';
  onChange?: (value: string) => void;
  onSubmit: (value: string) => void;
}

function SearchBar({ keyboardType, returnKeyType, onChange, onSubmit }: Props) {
  const [value, setValue] = useState('');
  const [isFocus, setFocus] = useState(false);

  const onChangeText = (val: string) => {
    setValue(val);
    if (onChange) onChange(val);
  };

  const onFocus = () => {

  };

  const _onSubmit = () => {

  };

  const s = useSpring({
    from: { width: 0 },
    to: isFocus ? {} : { width: 0 },
  });

  return (
    <View style={styles.container}>
      <AnimatedView style={[styles.inputWrapper, { width: this.inputAnimated }]}>
        <Icon name="search" size={17} color="#8E8E93" />
        <AnimatedTextInput
          style={[styles.textInput, { width: this.inputAnimated }]}
          placeholder="검색하기"
          placeholderTextColor="#8E8E93"
          autoCapitalize="none"
          clearButtonMode="while-editing"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={_onSubmit}
          onFocus={onFocus}
          returnKeyType={returnKeyType || 'search'}
          keyboardType={keyboardType || 'default'}
        />
      </AnimatedView>
      { isFocus && (
        <AnimatedView style={{ left: this.cancelAnimated }}>
          <TouchableOpacity style={styles.filter} onPress={this.onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </AnimatedView>
      ) }
    </View>
  );
}

// export default class SearchInput extends PureComponent<Props> {
//   state = {
//     value : '',
//     isFocused: false,
//   }

//   componentDidMount() {
//     const { width } = Dimensions.get('window');
//     this.width = width - 16;
//     this.inputAnimated = new Animated.Value(this.width);

//     this.cancelWidth = 65;
//     this.cancelAnimated = new Animated.Value(this.cancelWidth);
//   }

//   onChangeText = (value: string) => {
//     this.setState({ value });
//     if (this.props.onChange) this.props.onChange(value);
//   }

//   onFocus = () => {
//     if (this.inputAnimated && this.cancelAnimated) {
//       // @ts-ignore
//       Animated.parallel([
//         Animated.timing(this.inputAnimated, {
//           toValue: this.width - this.cancelWidth - 4,
//           duration: 200,
//         }).start(),
//         Animated.timing(this.cancelAnimated, {
//           toValue: 0,
//           duration: 200,
//         }).start(() => this.setState({ isFocused: true })),
//       ]);
//     }
//   }

//   onBlur = () => {
//     this.dismiss(() => this.setState({ isFocused: false }));
//   }

//   onCancel = () => {
//     this.dismiss(() => this.setState({ isFocused: false, value: '' }));
//   }

//   dismiss = (callback: () => void) => {
//     if (this.inputAnimated && this.cancelAnimated) {
//       // @ts-ignore
//       Animated.parallel([
//         Animated.timing(this.inputAnimated, {
//           toValue: this.width,
//           duration: 200,
//         }).start(),
//         Animated.timing(this.cancelAnimated, {
//           toValue: this.cancelWidth,
//           duration: 200,
//         }).start(callback),
//       ]);
//     }
//   }

//   onSubmit = () => {
//     if (this.props.onSubmit) {
//       this.props.onSubmit(this.state.value);
//     }
//     this.onBlur();
//   }
  
//   onClear = () => {
//     this.setState({ value: '' });
//   }

//   width: number = 0
//   cancelWidth: number = 0

//   inputAnimated: Animated.Value | undefined
//   cancelAnimated: Animated.Value | undefined

//   render() {
//     const { value, isFocused } = this.state;
//     return(
//       <View style={styles.container}>
//         <Animated.View style={[styles.inputWrapper, { width: this.inputAnimated }]}>
//           <Icon name="search" size={17} color="#8E8E93" />
//           <AnimatedTextInput
//             style={[styles.textInput, { width: this.inputAnimated }]}
//             placeholder="검색하기"
//             placeholderTextColor="#8E8E93"
//             autoCapitalize="none"
//             clearButtonMode="while-editing"
//             value={value}
//             onChangeText={this.onChangeText}
//             onSubmitEditing={this.onSubmit}
//             onFocus={this.onFocus}
//             returnKeyType={this.props.returnKeyType || 'search'}
//             keyboardType={this.props.keyboardType || 'default'}
//           />
//         </Animated.View>
//         { isFocused && (
//           <Animated.View style={{ left: this.cancelAnimated }}>
//             <TouchableOpacity style={styles.filter} onPress={this.onCancel}>
//               <Text style={styles.cancelText}>Cancel</Text>
//             </TouchableOpacity>
//           </Animated.View>
//         ) }
//       </View>
//     );
//   }
// }
