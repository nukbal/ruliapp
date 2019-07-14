import React, { useRef } from 'react';
import { SafeAreaView, Animated } from 'react-native';
// import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

const MAX_HEIGHT = 100;
const MIN_HEIGHT = 45;
const DISTANCE = MAX_HEIGHT - MIN_HEIGHT;

export default function AnimatedContent({ title, flat, ...rest }: any) {
  const scrollY = useRef(new Animated.Value(0));

  const headerHeight = scrollY.current.interpolate({
    inputRange: [0, DISTANCE],
    outputRange: [MAX_HEIGHT, MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.current.interpolate({
    inputRange: [-10, 0, DISTANCE],
    outputRange: [1, 0.8, 0],
    extrapolate: 'clamp',
  });

  const headerTrans = scrollY.current.interpolate({
    inputRange: [0, DISTANCE],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const miniTrans = scrollY.current.interpolate({
    inputRange: [-10, 0, DISTANCE],
    outputRange: [5, 0, 0],
    extrapolate: 'clamp',
  });

  const miniOpacity = scrollY.current.interpolate({
    inputRange: [0, DISTANCE / 2],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const List = flat ? Animated.FlatList : Animated.SectionList;

  return (
    <Wrapper>
      <List
        {...rest}
        scrollEventThrottle={15}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY.current } } }],
        )}
        style={{ marginTop: headerHeight }}
        scrollEnabled
      />
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
  bottom: 0;
  left: 0;
  margin-top: ${MAX_HEIGHT / 4};
  padding-left: 8;
  padding-right: 8;
  padding-bottom: 8;
  width: 100%;
`;

const Title = styled.Text`
  font-size: 30;
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
