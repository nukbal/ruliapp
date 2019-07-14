import styled from 'styled-components/native';

export default styled.View<{ width?: string, size?: number }>`
  height: ${({ size }) => size || 15};
  flex: 1;
  ${({ width }) => (width ? { width } : undefined)}
  background-color: #dedede;
  border-radius: 2;
  opacity: 0.25;
  margin-bottom: 8;
`;
