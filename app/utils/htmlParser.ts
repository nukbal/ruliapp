/* eslint-disable no-param-reassign, no-continue, prefer-destructuring, no-cond-assign */
export interface INode {
  tagName: string;
  attrs?: { [key: string]: any };
  value?: string;
  parent?: INode;
  childNodes: INode[];
}

const kMarkupPattern = /<!--[^]*?(?=-->)-->|<(\/?)([a-z][-.0-9_a-z]*)\s*([^>]*?)(\/?)>/ig;
const kAttributePattern = /(^|\s)(id|class|href|src|value|style)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/ig;
const kSelfClosingElements = {
  area: true,
  base: true,
  br: true,
  col: true,
  hr: true,
  img: true,
  input: true,
  link: true,
  meta: true,
  source: true,
};
const kElementsClosedByOpening = {
  li: { li: true },
  p: { p: true, div: true },
  b: { div: true },
  td: { td: true, th: true },
  th: { td: true, th: true },
  h1: { h1: true },
  h2: { h2: true },
  h3: { h3: true },
  h4: { h4: true },
  h5: { h5: true },
  h6: { h6: true },
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

function isWhitespace(raw?: string) {
  if (!raw) return;
  return /^(\s|&nbsp;|\\n)*$/.test(raw);
}

function TextNode(raw: string): INode {
  const value = raw
    .split('\n')
    .map((str) => str.trim())
    .join(' ');
  return { tagName: 'text', value, childNodes: [] };
}

function HTMLNode(name: string = 'root', attrs: { [key: string]: any }) {
  const _node: INode = { tagName: name, childNodes: [] };
  if (Object.keys(attrs).length) _node.attrs = attrs;
  return _node;
}

function appendChild(parent: INode, childNodes: INode) {
  childNodes.parent = parent;
  parent.childNodes.push(childNodes);
  return childNodes;
}

function isQueryContains(node: INode, arr: string) {
  let query = ` ${node.tagName} `;

  if (node.attrs) {
    if (node.attrs.class) query += ` .${node.attrs.class.split(' ').join(' .')} `;
    if (node.attrs.id) query += ` #${node.attrs.id} `;
  }
  // console.log(query, '<contains>', arr);
  return query.indexOf(` ${arr} `) > -1;
}

function findMatchNode(node: INode, pattern: string, all?: boolean): INode[] | null {
  if (!node) return null;
  if (!node.childNodes.length) return null;
  const arr = pattern.split(' ');
  const res: INode[] = [];
  const stack: Array<{ 0: INode, 1: 0 | 1, 2: boolean }> = [];
  let arrIdx = 0;
  for (let i = 0; i < node.childNodes.length; i++) {
    stack.push([node.childNodes[i], 0, false]);
    while (stack.length) {
      const cur = stack[stack.length - 1];
      const el = cur[0];
      if (cur[1] === 0) {
        if (cur[2] = isQueryContains(el, arr[arrIdx])) {
          arrIdx++;
          // if matched all
          if (arrIdx === arr.length) {
            res.push(el);
            if (all) {
              arrIdx--;
              stack.pop();
              continue;
            } else break;
          }
        }
      }
      if (cur[1] < el.childNodes.length) {
        stack.push([el.childNodes[cur[1]++], 0, false]);
      } else {
        if (cur[2]) arrIdx--;
        stack.pop();
      }
    }
    if (res.length && !all) break;
  }
  return res;
}

export function querySelector(parent: INode, pattern: string): INode | null {
  const nodes = findMatchNode(parent, pattern);
  return nodes ? nodes[0] : null;
}

export function querySelectorAll(parent: INode, pattern: string): INode[] | null {
  return findMatchNode(parent, pattern, true);
}

export default function parse(data: string): INode {
  const root = HTMLNode(undefined, {});
  let currentParent = root;
  const stack = [root];
  let lastTextPos = -1;

  for (let match; match = kMarkupPattern.exec(data);) {
    if (lastTextPos > -1) {
      // if has content
      if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
        const text = data
          .substring(lastTextPos, kMarkupPattern.lastIndex - match[0].length)
          .trim();
        if (text && !isWhitespace(text)) appendChild(currentParent, TextNode(text));
      }
    }
    lastTextPos = kMarkupPattern.lastIndex;
    // skip comment
    if (match[0][1] === '!') continue;
    match[2] = match[2].toLowerCase();

    // current cursor is not an closing tag
    if (!match[1]) {
      const attrs: { [key: string]: any } = {};
      for (let attMatch; attMatch = kAttributePattern.exec(match[3]);) {
        attrs[attMatch[2]] = attMatch[4] || attMatch[5] || attMatch[6];
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
