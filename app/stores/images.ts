import { createAction, ActionsUnion } from './helpers';

const LOAD = 'image/LOAD';
const REMOVE = 'image/REMOVE';
const CLEAR = 'image/CLEAR';

export const Actions = {
  load: (url: string) => createAction(LOAD, url),
  remove: (url: string) => createAction(REMOVE, url),
  clear: () => createAction(CLEAR),
};
export type Actions = ActionsUnion<typeof Actions>;

