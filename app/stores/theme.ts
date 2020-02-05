import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import darkTheme from '../styles/dark';
import lightTheme from '../styles/light';
import { RootState } from './index';

interface ColorType {
  400: string;
  500: string;
  600: string;
  700: string;
}

interface GrayType extends ColorType {
  50: string;
  75: string;
  100: string;
  200: string;
  300: string;
  800: string;
  900: string;
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: false,
  reducers: {
    setDarkMode(_, action: PayloadAction<boolean>) {
      return action.payload;
    },
  },
});
export const getThemeMode = (state: RootState) => state.theme;
export const getTheme = createSelector(getThemeMode, (mode) => mode ? darkTheme : lightTheme);

export const { setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
