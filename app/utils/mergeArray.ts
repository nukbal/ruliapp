
export default function mergeArray(arr1, arr2) {
  const oldArr = arr1.slice(0, arr1.indexOf(arr2[0]));
  return [...new Set([].concat(oldArr, arr2))];
}
