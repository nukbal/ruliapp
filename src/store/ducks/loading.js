import { createSelector } from 'reselect';

export const actionType = {
  SHOW_FULL_LOADING: 'SHOW_FULL_LOADING',
  HIDE_FULL_LOADING: 'HIDE_FULL_LOADING',
  SHOW_LOADING: 'SHOW_LOADING',
  HIDE_LOADING: 'HIDE_LOADING',
}

export function showFullLoading() {
  return { type: actionType.SHOW_FULL_LOADING };
}

export function hideFullLoading() {
  return { type: actionType.HIDE_FULL_LOADING };
}

export function showLoading() {
  return { type: actionType.SHOW_LOADING };
}

export function hideLoading() {
  return { type: actionType.HIDE_LOADING };
}

export const getLoadingState = state => state.loading;

export const isFullLoading = createSelector(
  [getLoadingState],
  (state) => state.isFullLoading,
);

export const isLoading = createSelector(
  [getLoadingState],
  (state) => state.isLoading,
);

const initState = {
  isFullLoading: true,
  isLoading: false,
}

const actionHandler = {
  [actionType.SHOW_FULL_LOADING]: (state) => ({ isFullLoading: true, isLoading: state.isLoading  }),
  [actionType.HIDE_FULL_LOADING]: (state) => ({ isFullLoading: false, isLoading: state.isLoading  }),
  [actionType.SHOW_LOADING]: (state) => ({ isFullLoading: state.isFullLoading, isLoading: true  }),
  [actionType.HIDE_LOADING]: (state) => ({ isFullLoading: state.isFullLoading, isLoading: false  }),
};

export default function reducer(state = initState, action = {}) {
  const handler = actionHandler[action.type];
  return handler ? handler(state, action) : state;
}
