// import entities from 'entities';

export interface INode {
  tagName: string;
  attrs?: { [key: string]: any };
  id?: string;
  className?: string[];
  value?: string;
  childNodes?: INode[];
}

const kBlockElements = {
  div: true,
  p: true,
  // ul: true,
  // ol: true,
  li: true,
  // table: true,
  // tr: true,
  td: true,
  section: true,
  br: true
};

const kMarkupPattern = /<!--[^]*?(?=-->)-->|<(\/?)([a-z][a-z0-9]*)\s*([^>]*?)(\/?)>/gi;
const kAttributePattern = /\b(id|class)\s*=\s*("([^"]+)"|'([^']+)'|(\S+))/ig;
const kSelfClosingElements = {
  meta: true,
  img: true,
  link: false,
  input: true,
  area: true,
  br: true,
  hr: true
};
const kElementsClosedByOpening = {
  li: { li: true },
  p: { p: true, div: true },
  td: { td: true, th: true },
  th: { td: true, th: true }
};
const kElementsClosedByClosing = {
  li: { ul: true, ol: true },
  a: { div: true },
  b: { div: true },
  i: { div: true },
  p: { div: true },
  td: { tr: true, table: true },
  th: { tr: true, table: true }
};
const kBlockTextElements = {
  script: true,
  noscript: true,
  style: true,
  pre: true
};

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
    if (attrs.id) _node.id = attrs.id;
    _node.className = attrs.class ? attrs.class.split(/\s+/) : [];
  }
  _node.childNodes = [];
  return _node;
}

function appendTextChild(parent: INode, raw?: string) {
  if (parent.childNodes && raw) {
    const text = raw.trim();
    if (text !== '' && !isWhitespace(text)) {
      parent.childNodes.push(TextNode(text));
    }
  }
  return parent;
}

function appendChild(parent: INode, child: INode) {
  if (parent.childNodes) parent.childNodes.push(child);
  return child;
}

export function querySelector(parent: INode, pattern: string) {
  
}

export function querySelectorAll(parent: INode, pattern: string) {

}

export default function parse(data: string): INode {
  const root = HTMLNode(undefined, {});
  let currentParent = root;
  const stack = [root];
  let lastTextPos = -1;

  for (let match, text; match = kMarkupPattern.exec(data); ) {
    if (lastTextPos > -1) {
      // if has content
      if (lastTextPos + match[0].length < kMarkupPattern.lastIndex) {
        text = data.substring(lastTextPos, kMarkupPattern.lastIndex - match[0].length);
        currentParent = appendTextChild(currentParent, text);
      }
    }
    lastTextPos = kMarkupPattern.lastIndex;
    if (match[0][1] ==   '!') continue;
    match[2] = match[2].toLowerCase();

    // not </ tags
    if (!match[1]) {
      const attrs: { [key: string]: any } = {};
      for (let attMatch; attMatch = kAttributePattern.exec(match[3]); ) {
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
      // @ts-ignore
      currentParent = appendChild(currentParent, HTMLNode(match[2], attrs));
      stack.push(currentParent);

      // @ts-ignore
      if (kBlockTextElements[match[2]]) {
        // a little test to find next </script> or </style> ...
        const closeMarkup = '</' + match[2] + '>';
        const index = data.indexOf(closeMarkup, kMarkupPattern.lastIndex);

        if (index == -1) {
          lastTextPos = kMarkupPattern.lastIndex = data.length + 1;
        } else {
          lastTextPos = kMarkupPattern.lastIndex = index + closeMarkup.length;
          // @ts-ignore
          match[1] = true;
        }
      }
    }
    // </ or /> or <br> etc.
    // @ts-ignore
    if (match[1] || match[4] || kSelfClosingElements[match[2]]) {
      while (true) {
        if (currentParent.tagName == match[2]) {
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
