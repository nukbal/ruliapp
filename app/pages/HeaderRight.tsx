import React from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';
import Icons from 'react-native-vector-icons/MaterialIcons';

import { getTheme } from 'app/stores/theme';

let marginRight: number | undefined;
if (Platform.OS !== 'ios') {
  marginRight = 8;
}

export default function HeaderRight({ onPress, name }: any) {
  const theme = useSelector(getTheme);
  return (
    <Icons
      onPress={onPress}
      style={{ marginRight }}
      name={name}
      size={24}
      color={theme.gray[800]}
    />
  );
}
