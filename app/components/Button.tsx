import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { fontSize } from 'styles/static';
import NativeButton from './NativeButton';
import Text from './Text';

interface Props {
  name?: string;
  backgroundColor?: string;
  disabled?: boolean;
  children?: string | number;
  style?: any[];
  onPress: () => void;
  size?: keyof typeof fontSize;
  pointerEnabled?: boolean;
}

export default function Button({
  children, name, onPress, disabled,
  backgroundColor = 'transparent', pointerEnabled = true, style = [],
  size = 600,
}: Props) {
  const { colors } = useTheme();
  return (
    <NativeButton
      style={[
        styles.button,
        { backgroundColor: disabled ? colors.disabled : backgroundColor },
        ...style,
      ]}
      disabled={disabled}
      onPress={onPress}
      hitSlop={{
        bottom: 2,
        top: 2,
        left: 2,
        right: 2,
      }}
      pointerEnabled={pointerEnabled}
    >
      {name && <Icon name={name} style={styles.icon} size={fontSize[size]} color={colors.text} />}
      {children && <Text style={[styles.buttonText, { color: colors.text }]}>{children}</Text>}
    </NativeButton>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    padding: 6,
  },
  buttonText: {
    fontWeight: 'bold',
    paddingVertical: 8,
  },
  icon: {
    marginRight: 6,
  },
});
