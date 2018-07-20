import { ActionCreatorsMapObject } from 'redux';

export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>

export function createAction<T extends string>(type: T): FSA<T>
export function createAction<T extends string, P>(type: T, payload: P): FSA<T, P>
export function createAction<T extends string, P, M>(type: T, payload: P, meta: M): FSA<T, P, M>
export function createAction<T extends string, P, M>(type: T, payload?: P, meta?: M) {
  let result = { type };
  // @ts-ignore
  if (payload) result.payload = payload;
  // @ts-ignore
  if (meta) result.meta = meta;
  return result;
}
