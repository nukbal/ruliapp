import React from 'react';
import {
  requireNativeComponent, TouchableWithoutFeedback,
  Platform, View, TouchableWithoutFeedbackProps,
} from 'react-native';

interface RNUIButtonProps extends TouchableWithoutFeedbackProps {
  pointerEnabled?: boolean;
  disabled?: boolean;
  children?: any;
}

const Button = (
  Platform.OS === 'ios'
    ? requireNativeComponent<RNUIButtonProps>('RNUIButton')
    : View
);

export default function NativeButton({ style, pointerEnabled, children, disabled, ...rest }: RNUIButtonProps) {
  return (
    <TouchableWithoutFeedback
      disabled={disabled}
      {...rest}
    >
      <Button
        style={style}
        disabled={disabled}
        pointerEnabled={pointerEnabled}
      >
        {children}
      </Button>
    </TouchableWithoutFeedback>
  );
}
