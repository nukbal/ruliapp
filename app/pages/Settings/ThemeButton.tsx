import React, { useState, useMemo } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';

import { getTheme, getThemeMode, Actions } from 'app/stores/theme';
import BottomSheet from 'app/components/BottomSheet';

import { styles } from './Settings';

const icons = ['brightness-1', 'brightness-2', 'brightness-4', 'brightness-5'];

export default function ThemeButton() {
  const dispatch = useDispatch();
  const mode = useSelector(getThemeMode);
  const theme = useSelector(getTheme);

  const [show, setShow] = useState(false);
  const toggleMenu = () => setShow(!show);
  const currentMode = useMemo(() => {
    if (mode === 'black') return '블랙';
    if (mode === 'dark') return '다크';
    if (mode === 'light') return '라이트';
    return '화이트';
  }, [mode]);

  const onPress = (name: any) => () => {
    dispatch(Actions.setMode(name));
    setShow(false);
  };

  return (
    <>
      <TouchableHighlight
        style={styles.item}
        underlayColor={theme.gray[300]}
        onPress={toggleMenu}
      >
        <>
          <View style={styles.itemHeader}>
            <Icons name="filter-hdr" size={20} color={theme.gray[800]} style={styles.iconStyle} />
            <Text style={[styles.itemText, { color: theme.gray[800] }]}>
              테마
            </Text>
          </View>
          <Text style={[styles.itemText, { color: theme.gray[800] }]}>{currentMode}</Text>
        </>
      </TouchableHighlight>
      <BottomSheet show={show} onClose={toggleMenu}>
        {['black', 'dark', 'light', 'white'].map((name, i) => (
          <TouchableHighlight
            key={name}
            style={[styles.item, mode === name ? { backgroundColor: theme.gray[400] } : undefined]}
            underlayColor={theme.gray[300]}
            onPress={onPress(name)}
          >
            <View style={styles.itemHeader}>
              <Icons name={icons[i]} size={20} color={theme.gray[800]} style={styles.iconStyle} />
              <Text style={[styles.itemText, { color: theme.gray[800] }]}>
                {name}
              </Text>
            </View>
          </TouchableHighlight>
        ))}
      </BottomSheet>
    </>
  );
}
