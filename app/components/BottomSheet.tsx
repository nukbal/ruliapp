import React, { useContext, useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, Modal, Dimensions, LayoutChangeEvent } from 'react-native';
import Ani, { Easing } from 'react-native-reanimated';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import ThemeContext from 'app/ThemeContext';

const {
  Value,
  timing,
} = Ani;

export default function BottomSheet({ show, children, onClose }: any) {
  const { theme } = useContext(ThemeContext);
  const { width, height } = Dimensions.get('window');
  const [visible, setVisible] = useState(false);
  const [h, setHeight] = useState(0);
  const opacity = useRef(new Value(0));

  useEffect(() => {
    const config = {
      duration: 250,
      easing: Easing.inOut(Easing.ease),
    };

    if (show) {
      setVisible(true);
      opacity.current.setValue(0);
    }

    if (show && h) {
      timing(opacity.current, { ...config, toValue: 0.65 }).start();
    } else if (h) {
      timing(opacity.current, { ...config, toValue: 0 })
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
      transparent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Ani.View style={[styles.backdrop, { width, height, opacity: opacity.current }]} />
      </TouchableWithoutFeedback>
      <Ani.View
        style={[
          styles.content,
          {
            backgroundColor: theme.backgroundLight,
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
