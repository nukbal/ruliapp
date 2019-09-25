
declare interface FSA<T extends string, P = undefined> {
  type: T;
  payload: P;
}

interface ActionCreator<A> {
  (...args: any[]): A
}

interface ActionCreatorsMapObject<A = any> {
  [key: string]: ActionCreator<A>
}

export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>;

export function createAction<T extends string>(type: T): FSA<T>;
export function createAction<T extends string, P>(type: T, payload: P): FSA<T, P>;
export function createAction<T extends string, P>(type: T, payload?: P) {
  const result = { type, payload };
  if (!result.payload) delete result.payload;
  return result;
}
