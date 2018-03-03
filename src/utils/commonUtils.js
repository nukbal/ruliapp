import cheerio from 'cheerio-without-node-native';

export function arrayToObject(array, key) {
  return array.reduce((prev, item, index) => {
    const result = prev;
    if (key) {
      result[item.key] = item;
    } else {
      result[item.id] = item;
    }
    return result;
  }, {})
}

export function mergeArray(arr1, arr2) {
  return [...new Set([].concat(arr1, arr2))];
}

export function loadHtml(htmlString) {
  return cheerio.load(htmlString, { normalizeWhitespace: true, });
}
