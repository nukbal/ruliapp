import { createSelector } from 'reselect';
import { Platform, StatusBar } from 'react-native';
import { createAction, ActionsUnion } from '../utils/createAction';
import theme from '../styles';

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

const SET_MODE = 'theme/SET_MODE';

export const Actions = {
  setMode: (mode: themeMode) => createAction(SET_MODE, mode),
};
export type Actions = ActionsUnion<typeof Actions>;

export const getThemeMode = (state: any) => state.theme as themeMode;
export const getTheme = createSelector([getThemeMode], (mode) => theme[mode]);

export default function reducer(state: themeMode = 'black', action: Actions) {
  switch (action.type) {
    case SET_MODE: {
      if (Platform.OS === 'ios') {
        StatusBar.setBarStyle(
          ['black', 'dark'].indexOf(action.payload) > -1 ? 'light-content' : 'dark-content',
        );
      }
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
