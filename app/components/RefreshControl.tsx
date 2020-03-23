import React from 'react';
import { RefreshControl as Wrapper } from 'react-native';
import { useSelector } from 'react-redux';

import { getTheme } from 'stores/theme';

interface Props {
  refreshing: boolean;
  onRefresh: () => void;
}

export default function RefreshControl({ refreshing, onRefresh }: Props) {
  const theme = useSelector(getTheme);
  return (
    <Wrapper
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={theme.primary[500]}
    />
  );
}
