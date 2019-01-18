import { ActionCreatorsMapObject } from 'redux';

export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>;

export function createAction<T extends string>(type: T): FSA<T>;
export function createAction<T extends string, P>(type: T, payload: P): FSA<T, P>;
export function createAction<T extends string, P, M>(type: T, payload: P, meta: M): FSA<T, P, M>;
export function createAction<T extends string, P, M>(type: T, payload?: P, meta?: M) {
  const result = { type };
  // @ts-ignore
  if (payload !== undefined) result.payload = payload;
  // @ts-ignore
  if (meta !== undefined) result.meta = meta;
  return result;
}
