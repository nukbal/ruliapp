import React, { useMemo, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { getTheme } from 'app/stores/theme';

interface Props {
  progress?: number;
  color?: string;
  width?: number;
  height?: number;
  indetermate?: boolean;
}

const {
  Value,
  Clock,
  block,
  set,
  cond,
  timing,
  startClock,
  stopClock,
  clockRunning,
  interpolate,
} = Animated;

function runLoading(indetermate: boolean, width: number, size: number) {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };
  const config = {
    duration: 1000,
    toValue: 1,
    easing: Easing.linear,
  };
  const ratio = width / 100;

  return block([
    cond(
      new Value(Number(indetermate)),
      [
        startClock(clock),
        timing(clock, state, config),
        cond(state.finished, [
          stopClock(clock),
          set(state.finished, 0),
          set(state.time, 0),
          set(state.position, 0),
          set(state.frameTime, 0),
          startClock(clock),
        ]),
      ],
      [
        stopClock(clock),
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, 0),
        set(state.frameTime, 0),
      ],
    ),
    interpolate(state.position, {
      inputRange: [0, 0.5, 1],
      outputRange: [0, width - (size * ratio), 0],
    }),
  ]);
}

function runProgress(value: number, cache: number, width: number) {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    position: new Value(cache),
    time: new Value(0),
    frameTime: new Value(0),
  };
  const config = {
    duration: 200,
    toValue: value,
    easing: Easing.linear,
  };

  return block([
    cond(clockRunning(clock), [
      set(state.finished, 0),
      set(state.position, cache),
      set(state.time, 0),
      set(state.frameTime, 0),
    ]),
    startClock(clock),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    interpolate(state.position, {
      inputRange: [0, 1],
      outputRange: [0, width],
    }),
  ]);
}

export default function ProgressBar({
  progress = 0, indetermate = false, color = 'red', width = 100, height = 6,
}: Props) {
  const theme = useSelector(getTheme);
  const cache = useRef(progress);
  const transX = useMemo(() => runLoading(indetermate, width, progress), [indetermate, width, progress]);
  let size = useMemo(() => runProgress(progress, cache.current, width), [width, progress]);
  if (indetermate) size = new Value(0.1 * width);

  useEffect(() => {
    cache.current = progress;
  }, [progress]);

  return (
    <View style={[styles.container, { width, borderRadius: height, backgroundColor: theme.gray[200] }]}>
      <Animated.View
        style={[
          { borderRadius: height, height },
          {
            backgroundColor: color,
            width: size,
            transform: [
              { translateX: transX },
            ],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
