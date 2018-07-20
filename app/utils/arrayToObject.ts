
export default function arrayToObject(array: any[], key?: string) {
  return array.reduce((prev, item) => {
    const result = prev;
    if (key) {
      result[item.key] = item;
    } else {
      result[item.id] = item;
    }
    return result;
  }, {})
}
