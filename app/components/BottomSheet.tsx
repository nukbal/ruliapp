import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, Modal, Dimensions, LayoutChangeEvent, TouchableWithoutFeedback } from 'react-native';
import Ani, { Easing } from 'react-native-reanimated';
import { useSelector } from 'react-redux';

import { getTheme } from 'app/stores/theme';

const {
  Value,
  timing,
} = Ani;

export default function BottomSheet({ show, children, onClose }: any) {
  const theme = useSelector(getTheme);
  const { width, height } = Dimensions.get('window');
  const [visible, setVisible] = useState(false);
  const [h, setHeight] = useState(0);
  const opacity = useRef(new Value(0));

  useEffect(() => {
    const config = {
      duration: 250,
      easing: Easing.bezier(0.50, 0, 1, 1),
    };

    if (show) {
      setVisible(true);
      opacity.current.setValue(new Value(0));
    }

    if (show && h) {
      timing(opacity.current, { ...config, toValue: new Value(0.65) }).start();
    } else if (h) {
      timing(opacity.current, { ...config, toValue: new Value(0) })
        .start(({ finished }) => {
          if (finished) setVisible(false);
        });
    }
  }, [show, h]);

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => setHeight(nativeEvent.layout.height), []);

  return (
    <Modal
      animationType="none"
      visible={visible}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      hardwareAccelerated
      transparent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Ani.View style={[styles.backdrop, { backgroundColor: theme.gray[50], width, height, opacity: opacity.current }]} />
      </TouchableWithoutFeedback>
      <Ani.View
        style={[
          styles.content,
          {
            backgroundColor: theme.gray[100],
            transform: [{
              translateY: opacity.current.interpolate({
                inputRange: [0, 0.65],
                outputRange: [h || height, 0],
              }),
            }],
          },
        ]}
        onLayout={onLayout}
      >
        {children}
      </Ani.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'black',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    justifyContent: 'flex-end',
  },
});
