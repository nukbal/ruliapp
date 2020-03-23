import React from 'react';
import { Switch } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { getTheme, getThemeMode, setDarkMode } from 'stores/theme';
import ListItem from 'components/ListItem';

export default function ThemeButton() {
  const dispatch = useDispatch();
  const mode = useSelector(getThemeMode);
  const theme = useSelector(getTheme);
  const onChange = (value: boolean) => dispatch(setDarkMode(value));

  return (
    <ListItem
      name="filter-hdr"
      right={(
        <Switch
          value={mode}
          onValueChange={onChange}
          trackColor={{
            false: theme.gray[100],
            true: theme.primary[700],
          }}
          accessibilityLabel="다크모드"
        />
      )}
    >
      다크모드
    </ListItem>
  );
}
