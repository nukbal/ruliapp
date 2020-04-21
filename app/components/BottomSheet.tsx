import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Modal, Dimensions, LayoutChangeEvent } from 'react-native';
import A, { Easing } from 'react-native-reanimated';
import { useSelector } from 'react-redux';

import { getTheme } from 'stores/theme';

const {
  Value,
  timing,
} = A;

const config = {
  duration: 250,
  easing: Easing.bezier(0.50, 0, 1, 1),
};

interface Props {
  show: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}

export default function BottomSheet({ show, children, onClose }: Props) {
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
      return () => {
        done = true;
      };
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
      <A.View
        onTouchEnd={onClose}
        style={[
          StyleSheet.absoluteFill,
          styles.backdrop,
          { backgroundColor: theme.gray[50], opacity },
        ]}
      />
      <A.View
        style={[
          styles.content,
          // @ts-ignore
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
      </A.View>
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
    padding: 8,
    paddingBottom: 16,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    justifyContent: 'flex-end',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 650,
  },
});
