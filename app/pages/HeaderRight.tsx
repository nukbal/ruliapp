import React from 'react';
import { Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import Icons from 'react-native-vector-icons/MaterialIcons';

import { getTheme } from 'stores/theme';

let marginRight: number | undefined;
if (Platform.OS !== 'ios') {
  marginRight = 8;
}

export default function HeaderRight({ onPress, name }: any) {
  const theme = useSelector(getTheme);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ marginRight }}
      accessible
      accessibilityRole="imagebutton"
    >
      <Icons
        name={name}
        size={24}
        color={theme.gray[800]}
      />
    </TouchableOpacity>
  );
}
