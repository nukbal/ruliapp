import React, { useState, useEffect, useRef } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  LayoutChangeEvent,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useSelector } from 'react-redux';
import { getTheme } from 'app/stores/theme';

interface Props {
  keyboardType?: '' | 'default';
  returnKeyType?: '' | 'search';
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onCancel?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const {
  Value,
  timing,
} = Animated;

const config = {
  duration: 250,
  easing: Easing.bezier(0.50, 0, 1, 1),
};
const BUTTON_WIDTH = 68;

function run(value: any, toValue: number) {
  return timing(value, { ...config, toValue: new Value(toValue) });
}

export default function SearchBar({
  keyboardType, returnKeyType,
  onChange, onSubmit, onFocus, onBlur, onCancel,
}: Props) {
  const theme = useSelector(getTheme);
  const [text, setText] = useState('');
  const [width, setWidth] = useState(Dimensions.get('window').width - 16);
  const value = useRef(new Value(0));

  // debounce input update to parent
  useEffect(() => {
    if (onChange) {
      const timeout = setTimeout(() => onChange(text), 500);
      return () => { clearTimeout(timeout); };
    }
  }, [text, onChange]);

  const handleFocus = () => {
    run(value.current, 1).start();
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    run(value.current, 0).start(({ finished }) => {
      if (finished && onBlur) onBlur();
    });
  };

  const handleCancel = () => {
    setText('');
    if (onCancel) onCancel();
    run(value.current, 0).start();
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit(text);
    handleBlur();
  };

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => setWidth(nativeEvent.layout.width - 16);

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Animated.View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.gray[100],
            width: value.current.interpolate({
              inputRange: [0, 1],
              outputRange: [width, width - BUTTON_WIDTH],
            }),
          },
        ]}
      >
        <Icon name="search" size={18} color={theme.gray[700]} style={styles.searchIcon} />
        <TextInput
          style={[styles.textInput, { color: theme.gray[800] }]}
          placeholder="검색하기"
          placeholderTextColor={theme.gray[700]}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType={returnKeyType || 'search'}
          keyboardType={keyboardType || 'default'}
        />
      </Animated.View>
      <TouchableOpacity style={styles.filter} onPress={handleCancel}>
        <Animated.Text
          style={[
            styles.cancelText,
            {
              color: theme.primary[600],
              transform: [{
                translateX: value.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: [BUTTON_WIDTH, 0],
                }),
              }],
            },
          ]}
        >
          Cancel
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 400,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: Platform.OS === 'android' ? 0 : 8,
    paddingLeft: 32,
    borderRadius: 8,
  },
  searchIcon: {
    position: 'absolute',
    left: Platform.OS === 'android' ? 12 : 8,
    top: Platform.OS === 'android' ? 12 : 8,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
  },
  filter: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelText: {
    width: BUTTON_WIDTH,
    fontSize: 17,
    textAlign: 'center',
  },
});
