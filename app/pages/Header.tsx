import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  position: absolute;
  justify-content: space-between;
  background-color: white;
  background-color: transparent;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 45;
  padding-left: 5;
`;

const Title = styled.Text`
  font-size: 30;
  color: ${({ theme }: any) => theme.primary};
`;

interface Props {
  back?: () => void;
  label: string;
}

export default function Header({ back, label }: Props) {
  return (
    <Container>
      <Title>{label}</Title>
    </Container>
  );
}
