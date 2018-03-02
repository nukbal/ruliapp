import cheerio from 'cheerio-without-node-native';

export function arrayToObject(array) {
  return array.reduce((prev, item, index) => {
    const result = prev;
    result[item.id] = item;
    return result;
  }, {})
}

export function loadHtml(htmlString) {
  return cheerio.load(htmlString, { normalizeWhitespace: true, });
}
