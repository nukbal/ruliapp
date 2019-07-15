import React, { useRef } from 'react';
import { SafeAreaView, View } from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

const MAX_HEIGHT = 100;
const MIN_HEIGHT = 45;
const DISTANCE = MAX_HEIGHT - MIN_HEIGHT;

export default function AnimatedContent({ title, children }: any) {
  const scrollY = useRef(new Animated.Value(0));

  const headerHeight = scrollY.current.interpolate({
    inputRange: [0, DISTANCE],
    outputRange: [MAX_HEIGHT, MIN_HEIGHT],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const headerOpacity = scrollY.current.interpolate({
    inputRange: [-10, 0, DISTANCE],
    outputRange: [1, 0.8, 0],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const headerTrans = scrollY.current.interpolate({
    inputRange: [0, DISTANCE],
    outputRange: [0, -50],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const miniTrans = scrollY.current.interpolate({
    inputRange: [-10, 0, DISTANCE],
    outputRange: [5, 0, 0],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const miniOpacity = scrollY.current.interpolate({
    inputRange: [0, DISTANCE / 2],
    outputRange: [0, 1],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  return (
    <Wrapper>
      <Scroll
        scrollEventThrottle={15}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY.current } } }],
        )}
        style={{ marginTop: headerHeight }}
        removeClippedSubviews={false}
      >
        <View style={{ flex: 1 }}>{children}</View>
      </Scroll>
      <Container style={{ height: headerHeight }}>
        <Header style={{ opacity: headerOpacity, transform: [{ translateY: headerTrans }] }}>
          <Title numberOfLines={2}>{title}</Title>
        </Header>
        <MiniHeader style={{ opacity: miniOpacity, transform: [{ translateY: miniTrans }] }}>
          <MiniTitle numberOfLines={1}>{title}</MiniTitle>
        </MiniHeader>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const Scroll = styled(Animated.ScrollView)`
  flex: 1;
`;

const Container = styled(Animated.View)`
  position: absolute;
  align-items: flex-end;
  flex-direction: row;
  background-color: transparent;
  top: 0;
  left: 0;
  right: 0;
`;

const Header = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 8;
  padding-right: 8;
  padding-top: 8;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
`;

const Title = styled.Text`
  font-size: 26;
  font-weight: bold;
  color: ${({ theme }: any) => theme.primary};
`;

const MiniHeader = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${MIN_HEIGHT};
  align-items: flex-start;
  justify-content: center;
  padding-left: 8;
`;

const MiniTitle = styled.Text`
  font-size: 20;
  font-weight: bold;
  color: ${({ theme }: any) => theme.primary};
`;
