import React, { useContext } from 'react';
import { Text as Warpper, TextProps } from 'react-native';
import ThemeContext from 'app/ThemeContext';
import { fontSize } from 'app/styles/static';

interface Props extends TextProps {
  color?: 'gray' | 'red' | 'primary';
  shade?: 50 | 75 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  size?: keyof typeof fontSize;
  style?: any[];
  children: string | number;
}

export default function Text({
  children, color = 'gray', shade = 700, size = 100, style = [],
  ...rest
}: Props) {
  const { theme } = useContext(ThemeContext);
  return (
    <Warpper
      style={[{
        color: theme[color][shade],
        fontSize: fontSize[size],
      }, ...style]}
      {...rest}
    >
      {children}
    </Warpper>
  );
}
