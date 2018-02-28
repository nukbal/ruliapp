export function arrayToObject(array) {
  return array.reduce((prev, item, index) => {
    const result = prev;
    result[item.id] = item;
    return result;
  }, {})
}
