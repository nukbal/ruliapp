
export default function promiseWrapper<T = any>(promise: Promise<T>) {
  let hasCanceled_ = false;
  const wrapped = new Promise<T>((res, rej) => {
    promise.then(
      val => hasCanceled_ ? rej({ isCanceled: true }) : res(val),
      error => hasCanceled_ ? rej({ isCanceled: true }) : rej(error)
    );
  });
  return {
    promise: wrapped,
    cancel: () => { hasCanceled_ = true; }
  };
}
