import React, { memo, useState, useEffect, useRef } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  LayoutChangeEvent,
  Dimensions,
  Platform,
  Keyboard,
} from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useSelector } from 'react-redux';
import { getTheme } from 'stores/theme';
import { fontSize } from 'styles/static';

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
  duration: 150,
  easing: Easing.bezier(0.50, 0, 1, 1),
};
const BUTTON_WIDTH = 60;

function run(value: any, toValue: number) {
  return timing(value, { ...config, toValue: new Value(toValue) });
}

function SearchBar({
  keyboardType, returnKeyType,
  onChange, onSubmit, onFocus, onBlur, onCancel,
}: Props) {
  const theme = useSelector(getTheme);
  const [text, setText] = useState('');
  const [focus, setFocus] = useState(false);
  const [width, setWidth] = useState(Dimensions.get('window').width);
  const ref = useRef<TextInput>(null);
  const [value] = useState(new Value(0));

  useEffect(() => {
    if (Platform.OS === 'android') {
      const sub = Keyboard.addListener('keyboardDidHide', () => {
        if (ref.current) ref.current.blur();
      });
      return () => {
        sub.remove();
      };
    }
  }, []);

  // debounce input update to parent
  useEffect(() => {
    if (onChange) {
      const timeout = setTimeout(() => onChange(text), 500);
      return () => { clearTimeout(timeout); };
    }
  }, [text, onChange]);

  const handleFocus = () => {
    run(value, 1).start();
    setFocus(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setFocus(false);
    run(value, 0).start(({ finished }) => {
      if (finished) {
        if (onBlur) onBlur();
      }
    });
  };

  const handleCancel = () => {
    setText('');
    if (onCancel) onCancel();
    run(value, 0).start();
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit(text);
    handleBlur();
  };

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => setWidth(nativeEvent.layout.width);

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Animated.View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.gray[100],
            width: value.interpolate({
              inputRange: [0, 1],
              outputRange: [width, width - BUTTON_WIDTH],
            }),
          },
        ]}
      >
        <Icon name="search" size={fontSize[300]} color={theme.gray[700]} style={styles.searchIcon} />
        <TextInput
          ref={ref}
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
        {focus && !!text.length && (
          <Icon
            name="cancel"
            size={fontSize[300]}
            color={theme.gray[700]}
            style={styles.clearIcon}
          />
        )}
      </Animated.View>
      <Animated.Text
        onPress={handleCancel}
        style={[
          styles.cancelText,
          {
            color: theme.primary[600],
            transform: [{
              translateX: value.interpolate({
                inputRange: [0, 1],
                outputRange: [BUTTON_WIDTH, 0],
              }),
            }],
          },
        ]}
      >
        Cancel
      </Animated.Text>
    </View>
  );
}
export default memo(SearchBar);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 400,
    margin: 8,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Platform.OS === 'android' ? 4 : 8,
    paddingLeft: 32,
    borderRadius: 8,
  },
  searchIcon: {
    position: 'absolute',
    left: 8,
    top: 8,
  },
  clearIcon: {
    position: 'absolute',
    right: 8,
    top: 8,
    zIndex: 10,
  },
  textInput: {
    flex: 1,
    width: '100%',
    margin: 0,
    padding: 0,
    fontSize: fontSize[100],
  },
  cancelText: {
    width: BUTTON_WIDTH,
    fontSize: fontSize[200],
    textAlign: 'center',
  },
});
