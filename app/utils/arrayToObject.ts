
export default function arrayToObject<T extends { key: string }>(array: T[]): { [key: string]: T } {
  return array.reduce((prev, item) => {
    const result: { [key: string]: T } = prev;
    result[item.key] = item;
    return result;
  }, {});
}
