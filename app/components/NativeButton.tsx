import React from 'react';
import {
  requireNativeComponent, ViewProps,
  Platform, TouchableWithoutFeedback, View, TouchableWithoutFeedbackProps,
} from 'react-native';

interface RNUIButtonProps extends ViewProps {
  pointerEnabled?: boolean;
  disabled?: boolean;
  children?: any;
}

const Button = (
  Platform.OS === 'ios'
    ? requireNativeComponent<RNUIButtonProps>('RNUIButton')
    : View
);

type Props = RNUIButtonProps & TouchableWithoutFeedbackProps;

export default function NativeButton({ disabled, style, pointerEnabled, children, ...rest }: Props) {
  return (
    <TouchableWithoutFeedback
      {...rest}
      disabled={disabled}
    >
      <Button
        disabled={disabled}
        style={style}
        pointerEnabled={pointerEnabled}
      >
        {children}
      </Button>
    </TouchableWithoutFeedback>
  );
}
