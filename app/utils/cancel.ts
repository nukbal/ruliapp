/* eslint-disable no-confusing-arrow */

export default function promiseWrapper<T = any>(promise: Promise<T>) {
  let hasCanceled = false;
  const wrapped = new Promise<T>((res, rej) => {
    promise.then(
      (val) => hasCanceled ? rej(new Error('promise canceled')) : res(val),
      (error) => hasCanceled ? rej(new Error('promise canceled')) : rej(error),
    );
  });
  return {
    promise: wrapped,
    cancel: () => { hasCanceled = true; },
  };
}
