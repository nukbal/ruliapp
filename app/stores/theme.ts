import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import theme from '../styles';
import { RootState } from './index';

type themeMode = 'black' | 'dark' | 'light' | 'white';
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
  initialState: 'black' as themeMode,
  reducers: {
    setMode(_, action: PayloadAction<themeMode>) {
      return action.payload;
    },
  },
});
export const getThemeMode = (state: RootState) => state.theme;
export const getTheme = createSelector(getThemeMode, (mode) => theme[mode]);

export const { setMode } = themeSlice.actions;
export default themeSlice.reducer;
