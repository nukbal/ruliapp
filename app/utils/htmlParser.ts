/* eslint-disable no-underscore-dangle, no-param-reassign, no-continue */
export interface INode {
  tagName: string;
  attrs?: { [key: string]: any };
  id?: string;
  /** query attributes (classname or id) */
  q?: string;
  value?: string;
  childNodes?: INode[];
  next?: INode;
  prev?: INode;
}

const kMarkupPattern = /<!--[^]*?(?=-->)-->|<(\/?)([a-z][a-z0-9]*)\s*([^>]*?)(\/?)>/gi;
const kAttributePattern = /\b(id|class|href|value|src)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/ig;
const kSelfClosingElements = {
  meta: true,
  img: true,
  link: false,
  input: true,
  area: true,
  br: true,
  hr: true,
};
const kElementsClosedByOpening = {
  li: { li: true },
  p: { p: true, div: true },
  td: { td: true, th: true },
  th: { td: true, th: true },
};
const kElementsClosedByClosing = {
  li: { ul: true, ol: true },
  a: { div: true },
  b: { div: true },
  i: { div: true },
  p: { div: true },
  td: { tr: true, table: true },
  th: { tr: true, table: true },
};
// const kBlockTextElements = {
//   script: true,
//   noscript: true,
//   style: true,
//   pre: true
// };

function isWhitespace(raw?: string) {
  if (!raw) return;
  return /^(\s|&nbsp;|\\n)*$/.test(raw);
}

function TextNode(raw: string): INode {
  return { tagName: 'text', value: raw };
}

function HTMLNode(name: string = '', attrs?: any) {
  const _node: INode = { tagName: name };
  if (attrs) {
    const queries = [];
    const rest = { ...attrs };
    const len = Object.keys(rest).length;
    if (attrs.id) {
      queries.push(attrs.id);
      delete rest.id;
    }
    if (attrs.class) {
      queries.push(attrs.class);
      delete rest.class;
    }
    if (len > 0) _node.attrs = rest;
    _node.q = queries.join(' ');
  }
  _node.childNodes = [];
  return _node;
}

function appendTextChild(parent: INode, raw?: string) {
  if (parent.childNodes && raw) {
    const text = raw.trim();
    if (text !== '' && !isWhitespace(text)) {
      const prevNode = parent.childNodes[parent.childNodes.length - 1];
      const child = TextNode(text);
      if (prevNode) {
        child.prev = prevNode;
        prevNode.next = child;
      }
      parent.childNodes.push(child);
    }
  }
  return parent;
}

function appendChild(parent: INode, child: INode) {
  if (parent.childNodes) {
    const prevNode = parent.childNodes[parent.childNodes.length - 1];
    if (prevNode) {
      child.prev = prevNode;
      prevNode.next = child;
    }
    parent.childNodes.push(child);
  } else {
    parent.childNodes = [child];
  }
  return child;
}

function isQueryContains(node: INode, arr: string[]) {
  const query = ' ' + node.tagName + ' ' + (node.q ? `${node.q} ` : '');
  for (let i = 0, len = arr.length; i < len; i += 1) {
    if (query.indexOf(' ' + arr[i] + ' ') === -1) return false;
  }
  return true;
}

function searchTree(node: INode, arr: string[]): INode | undefined {
  if (!node) return;

  const isMatch = isQueryContains(node, arr);
  if (isMatch) return node;
  if (node.childNodes) {
    let cursor;
    for (let i = 0, len = node.childNodes.length; i < len; i += 1) {
      cursor = searchTree(node.childNodes[i], arr);
      if (cursor) break;
    }
    return cursor;
  }
}

function findMatchNode(root: INode, pattern: string, all?: boolean) {
  const arr = pattern.split(' ');
  let node: any = root;
  if (!node.childNodes || !node.childNodes.length) return;
  // eslint-disable-next-line prefer-destructuring
  if (!node.tagName) node = node.childNodes[0];

  const arrLen = arr.length;
  let cursor = node;
  for (let z = 0; z < arrLen; z += 1) {
    const current = arr[z].split(/[\.|\#]/);
    const isLast = (z === arrLen - 1);

    cursor = searchTree(cursor, current);

    if (isLast && all) {
      const res = [];
      while (cursor) {
        if (isQueryContains(cursor, current)) res.push(cursor);
        cursor = cursor.next;
      }
      return res;
    }
    if (isLast) {
      return cursor;
    }
  }

  return node;
}

export function querySelector(parent: INode, pattern: string): INode | undefined {
  // @ts-ignore
  return findMatchNode(parent, pattern);
}

export function querySelectorAll(parent: INode, pattern: string): INode[] | undefined {
  // @ts-ignore
  return findMatchNode(parent, pattern, true);
}

export default function parse(data: string): INode {
  const root = HTMLNode(undefined, {});
  let currentParent = root;
  const stack = [root];
  let lastTextPos = -1;

  // eslint-disable-next-line no-cond-assign
  for (let match, text; match = kMarkupPattern.exec(data);) {
    if (lastTextPos > -1) {
      // if has content
      if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
        text = data.substring(lastTextPos, kMarkupPattern.lastIndex - match[0].length);
        currentParent = appendTextChild(currentParent, text);
      }
    }
    lastTextPos = kMarkupPattern.lastIndex;
    if (match[0][1] === '!') continue;
    match[2] = match[2].toLowerCase();

    // not </ tags
    if (!match[1]) {
      const attrs: { [key: string]: any } = {};
      // eslint-disable-next-line no-cond-assign
      for (let attMatch; attMatch = kAttributePattern.exec(match[3]);) {
        attrs[attMatch[1]] = attMatch[3] || attMatch[4] || attMatch[5];
      }
      // @ts-ignore
      if (!match[4] && kElementsClosedByOpening[currentParent.tagName]) {
        // @ts-ignore
        if (kElementsClosedByOpening[currentParent.tagName][match[2]]) {
          stack.pop();
          currentParent = stack[stack.length - 1];
        }
      }
      currentParent = appendChild(currentParent, HTMLNode(match[2], attrs));
      stack.push(currentParent);
    }
    // </ or /> or <br> etc.
    // @ts-ignore
    if (match[1] || match[4] || kSelfClosingElements[match[2]]) {
      while (true) {
        if (currentParent.tagName === match[2]) {
          stack.pop();
          currentParent = stack[stack.length - 1];
          break;
        } else {
          // Trying to close current tag, and move on
          // @ts-ignore
          if (kElementsClosedByClosing[currentParent.tagName]) {
            // @ts-ignore
            if (kElementsClosedByClosing[currentParent.tagName][match[2]]) {
              stack.pop();
              currentParent = stack[stack.length - 1];
              continue;
            }
          }
          // Use aggressive strategy to handle unmatching markups.
          break;
        }
      }
    }
  }

  return root;
}
