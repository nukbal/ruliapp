import React from 'react';
import {
  TouchableHighlight,
  View,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icons from 'react-native-vector-icons/MaterialIcons';

import Text from 'app/components/Text';
import { getTheme } from 'app/stores/theme';

interface Props {
  name: string;
  children: string;
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  right?: any;
  color?: 'gray' | 'red' | 'primary';
}

export default function ListItem({ name, children, onPress, style, right, color = 'gray' }: Props) {
  const theme = useSelector(getTheme);
  return (
    <TouchableHighlight
      style={[listStyles.item, style]}
      underlayColor={theme.gray[300]}
      onPress={onPress}
    >
      <>
        <View style={listStyles.itemHeader}>
          <Icons name={name} size={20} color={theme[color][700]} style={listStyles.iconStyle} />
          <Text style={[listStyles.itemText, { color: theme[color][700] }]}>
            {children}
          </Text>
        </View>
        {right}
      </>
    </TouchableHighlight>
  );
}

export const listStyles = StyleSheet.create({
  item: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    marginBottom: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconStyle: {
    paddingRight: 32,
  },
  itemText: {
    fontWeight: '500',
    alignItems: 'center',
  },
});
