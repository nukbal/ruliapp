
export default function mergeArray(arr1: string[], arr2: string[]) {
  const firstIdx = arr1.indexOf(arr2[0]);
  // append
  if (firstIdx > -1) {
    const oldArr = arr1.splice(firstIdx);
    return [...oldArr, ...arr2];

  // stack
  } else {
    const idx = arr2.indexOf(arr1[0]);
    if (idx > -1) {
      const oldArr = arr2.splice(idx);
      return [...arr2, ...oldArr];

    // first array is not founded, append array as default
    } else {
      return [...arr1, ...arr2];
    }
  }
}
