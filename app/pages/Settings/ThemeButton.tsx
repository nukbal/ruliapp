import React, { useState, useMemo } from 'react';
import { Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { getTheme, getThemeMode, setMode } from 'app/stores/theme';
import BottomSheet from 'app/components/BottomSheet';
import ListItem, { listStyles } from 'app/components/ListItem';

const icons = ['brightness-1', 'brightness-2', 'brightness-4', 'brightness-5'];
function getLabelText(mode: string) {
  if (mode === 'black') return '블랙';
  if (mode === 'dark') return '다크';
  if (mode === 'light') return '라이트';
  return '화이트';
}

export default function ThemeButton() {
  const dispatch = useDispatch();
  const mode = useSelector(getThemeMode);
  const theme = useSelector(getTheme);

  const [show, setShow] = useState(false);
  const toggleMenu = () => setShow(!show);
  const currentMode = useMemo(() => getLabelText(mode), [mode]);

  const onPress = (name: any) => () => {
    dispatch(setMode(name));
    setShow(false);
  };

  return (
    <>
      <ListItem
        name="filter-hdr"
        onPress={toggleMenu}
        right={<Text style={[listStyles.itemText, { color: theme.gray[800] }]}>{currentMode}</Text>}
      >
        테마
      </ListItem>
      <BottomSheet show={show} onClose={toggleMenu}>
        {['black', 'dark', 'light', 'white'].map((name, i) => (
          <ListItem
            key={name}
            name={icons[i]}
            style={mode === name ? { backgroundColor: theme.gray[400] } : undefined}
            onPress={onPress(name)}
          >
            {getLabelText(name)}
          </ListItem>
        ))}
      </BottomSheet>
    </>
  );
}
