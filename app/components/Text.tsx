import React from 'react';
import { Text as Warpper, TextProps, TextInput, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { getTheme } from 'stores/theme';
import { fontSize } from 'styles/static';

interface Props extends TextProps {
  color?: 'gray' | 'red' | 'primary';
  shade?: 50 | 75 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  size?: keyof typeof fontSize;
  style?: any[];
  children: React.ReactNode;
}

export default function Text({
  children, color = 'gray', shade = 700, size = 100, style = [],
  ...rest
}: Props) {
  const theme = useSelector(getTheme);
  const textStyle = [{
    // @ts-ignore
    color: theme[color][shade],
    fontSize: fontSize[size],
    lineHeight: fontSize[size] * 1.5,
  }, ...style];

  // if (Platform.OS === 'ios' && rest.selectable) {
  //   return (
  //     <TextInput
  //       style={textStyle}
  //       editable={false}
  //       multiline
  //       scrollEnabled={false}
  //       value={String(children)}
  //       accessibilityLabel={rest.accessibilityLabel}
  //       accessibilityRole={rest.accessibilityRole}
  //       numberOfLines={rest.numberOfLines}
  //       onLayout={rest.onLayout}
  //       onMagicTap={rest.onMagicTap}
  //       testID={rest.testID}
  //       selectionColor={rest.selectionColor}
  //     />
  //   );
  // }
  return (
    <Warpper
      style={textStyle}
      {...rest}
    >
      {children}
    </Warpper>
  );
}
