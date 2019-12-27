import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as colors from 'styles/static';
import Text from './Text';

interface Props {
  name?: string;
  color: string;
  disabled?: boolean;
  children: string;
  onPress: () => void;
}

export default function Button({ children, name, color, onPress, disabled }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      {name && <Icon name={name} style={styles.icon} size={colors.fontSize[600]} color={colors.white} />}
      <Text style={[styles.buttonText]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minWidth: 175,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 6,
    margin: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: colors.fontSize[200],
    fontWeight: 'bold',
    paddingVertical: 8,
  },
  icon: {
    marginRight: 6,
  },
});
