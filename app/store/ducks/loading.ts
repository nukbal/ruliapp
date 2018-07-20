import { createSelector } from 'reselect';
import { createAction, ActionsUnion } from '../helpers';

/* Actions */

export const SHOW_FULL_LOADING = 'SHOW_FULL_LOADING';
export const HIDE_FULL_LOADING = 'HIDE_FULL_LOADING';
export const SHOW_LOADING = 'SHOW_LOADING';
export const HIDE_LOADING = 'HIDE_LOADING';

export const Actions = {
  showFullLoading: () => createAction(SHOW_FULL_LOADING),
  hideFullLoading: () => createAction(HIDE_FULL_LOADING),
  showLoading: () => createAction(SHOW_LOADING),
  hideLoading: () => createAction(HIDE_LOADING),
}
export type Actions = ActionsUnion<typeof Actions>;


/* Selectors */

export const getLoadingState = state => state.loading;

export const isFullLoading = createSelector(
  [getLoadingState],
  (state) => state.isFullLoading,
);

export const isLoading = createSelector(
  [getLoadingState],
  (state) => state.isLoading,
);

/* Reducer */

export type LoadingState = {
  readonly isFullLoading: boolean;
  readonly isLoading: boolean;
}

const initState: LoadingState = {
  isFullLoading: true,
  isLoading: false,
}

export default function reducer(state = initState, action: Actions): LoadingState {
  switch (action.type) {
    case SHOW_FULL_LOADING:
      return { ...state, isFullLoading: true };
    case HIDE_FULL_LOADING:
      return { ...state, isFullLoading: false };
    case SHOW_LOADING:
      return { ...state, isLoading: true };
    case HIDE_LOADING:
      return { ...state, isLoading: false };
    default:
      return state;
  }
}
