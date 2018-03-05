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

// http://davidwalsh.name/javascript-debounce-function
export function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

export const throttle = (func, limit) => {
  let lastFunc
  let lastRan
  return function() {
    const context = this
    const args = arguments
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
};

export function mergeArray(arr1, arr2) {
  return [...new Set([].concat(arr1, arr2))];
}

export function loadHtml(htmlString) {
  return cheerio.load(htmlString, { normalizeWhitespace: true, });
}
