import HTMLParser from 'fast-html-parser';

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

export function throttle(callback, delay) {
  let isThrottled = false, args, context;

  function wrapper() {
    if (isThrottled) {
      args = arguments;
      context = this;
      return;
    }

    isThrottled = true;
    callback.apply(this, arguments);
    
    setTimeout(() => {
      isThrottled = false;
      if (args) {
        wrapper.apply(context, args);
        args = context = null;
      }
    }, delay);
  }

  return wrapper;
}

export function mergeArray(arr1, arr2) {
  const oldArr = arr1.slice(0, arr1.indexOf(arr2[0]));
  return [...new Set([].concat(oldArr, arr2))];
}

export function loadHtml(htmlString) {
  return HTMLParser.parse(htmlString).removeWhitespace();
}

export function hashCode(str) {
  let hash = 0, i, chr;
  const length = str.length;
  if (length === 0) return hash;
  for (i = 0; i < length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}
