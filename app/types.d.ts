
/** Flux Standars Action */
// declare interface FSA<T extends string> {
//   type: T;
// }
// declare interface FSA<T extends string, P> {
//   type: T;
//   payload: P;
// }
declare interface FSA<T extends string, P = undefined, M = undefined> {
  type: T;
  payload: P;
  meta: M;
  error?: boolean;
}
