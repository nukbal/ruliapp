import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  keyboardType?: '' | 'default';
  returnKeyType?: '' | 'search';
  onChange: (value: string) => void;
  onSubmit: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
}

const {
  Value,
} = Animated;

export default function SearchBar({ keyboardType, returnKeyType, onChange, onSubmit }: Props) {
  const [value, setValue] = useState('');
  const aniValue = useRef(new Value(0));

  // debounce input update to parent
  useEffect(() => {
    const timeout = setTimeout(() => onChange(value), 500);
    return () => { clearTimeout(timeout); };
  }, [value, onChange]);

  const onFocus = useCallback(() => {

  }, []);

  const onCancel = useCallback(() => {

  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inputWrapper, { width: aniValue.current }]}>
        <Icon name="search" size={17} color="#8E8E93" />
        <TextInput
          style={styles.textInput}
          placeholder="검색하기"
          placeholderTextColor="#8E8E93"
          autoCapitalize="none"
          clearButtonMode="while-editing"
          value={value}
          onChangeText={setValue}
          onSubmitEditing={onSubmit}
          onFocus={onFocus}
          returnKeyType={returnKeyType || 'search'}
          keyboardType={keyboardType || 'default'}
        />
      </Animated.View>
      <TouchableOpacity style={[styles.filter, { transform: [] }]} onPress={onCancel}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 51,
    padding: 8,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  inputWrapper: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelText: {
    width: 65,
    fontSize: 17,
    padding: 8,
    textAlign: 'center',
  },
});
