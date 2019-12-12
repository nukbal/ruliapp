import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Modal, Dimensions, LayoutChangeEvent, TouchableWithoutFeedback, View } from 'react-native';
import Ani, { Easing } from 'react-native-reanimated';
import { useSelector } from 'react-redux';

import { getTheme } from 'app/stores/theme';

const {
  Value,
  timing,
} = Ani;

const config = {
  duration: 250,
  easing: Easing.bezier(0.50, 0, 1, 1),
};

export default function BottomSheet({ show, children, onClose }: any) {
  const theme = useSelector(getTheme);
  const [visible, setVisible] = useState(false);
  const [h, setHeight] = useState(Dimensions.get('window').height);
  const [opacity] = useState(new Value(0));

  useEffect(() => {
    if (show) {
      opacity.setValue(new Value(0));
      setVisible(true);
      timing(opacity, { ...config, toValue: new Value(0.65) }).start();
    } else {
      let done = false;
      timing(opacity, { ...config, toValue: new Value(0) })
        .start(({ finished }) => {
          if (finished && !done) {
            done = true;
            setVisible(false);
          }
        });
    }
  }, [show, opacity]);

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => setHeight(nativeEvent.layout.height), []);

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
      presentationStyle="overFullScreen"
      transparent
    >
      <Ani.View
        onTouchEnd={onClose}
        style={[
          StyleSheet.absoluteFill,
          styles.backdrop,
          { backgroundColor: theme.gray[50], opacity },
        ]}
      />
      <Ani.View
        style={[
          styles.content,
          {
            backgroundColor: theme.gray[100],
            transform: [{
              translateY: opacity.interpolate({
                inputRange: [0, 0.65],
                outputRange: [h, 0],
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
