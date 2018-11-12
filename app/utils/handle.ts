
export default function handle(promise: Promise<any>) {
  let isCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (val: any) => {
        if (isCanceled) { val = undefined; } else { resolve(val); }
      },
      (error: any) => {
        if (isCanceled) { error = undefined; } else { reject(error); }
      }
    );
  });

  return { promise: wrappedPromise, cancel: () => { isCanceled = true; } }
}
