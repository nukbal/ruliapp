import loadHtml, { INode, querySelectorAll, querySelector } from './htmlParser';
import parseComment from './parseComment';

function formatPostHeader(parent: INode) {
  const record: any = {};
  let cursor;
  cursor = querySelector(parent, 'div.user_view img.profile_img_m');
  if (cursor && cursor.attrs) record.userImage = cursor.attrs.src;

  cursor = querySelector(parent, 'div.user_view div.user_info span.level strong text');
  if (cursor) record.userLevel = cursor.value;

  return record;
}

function findContext(current: INode, key: string, style?: any): ContentRecord | undefined {
  const tagName = current.tagName;

  switch (tagName) {
    case 'text': {
      if (!current.value) return;
      if (style) return { key, type: 'text', content: current.value, style };
      return { key, type: 'text', content: current.value };
    }
    case 'img': {
      if (!current.attrs || !current.attrs.src) return;
      if (style) return { key, type: 'image', content: current.attrs.src, style };
      return { key, type: 'image', content: current.attrs.src };
    }
    case 'p': {
      const rows = rowSelector(current, ['img', 'text']);
      if (!rows) return;
      const hasStyle = current.attrs && current.attrs.style;

      for (let i = 0, len = rows.length; i < len; i ++) {
        const value = findContext(rows[i], `${key}_0`, hasStyle && current.attrs!.style);
        if (value) return value;
      }
    }
    case 'blockquote': {
      if (!current.childNodes) return;
      const res = [];
      for (let i = 0, len = current.childNodes.length; i < len; i += 1) {
        const temp = findContext(current.childNodes[i], `${key}_${i}`);
        if (temp) res.push(temp);
      }
      if (res.length) {
        if (current.attrs && current.attrs.style) {
          return { key, type: 'block', content: res, style: current.attrs.style };
        } else {
          return { key, type: 'block', content: res };
        }
      }
    }
  }
  return;
}

function rowSelector(root: INode, pattern: string[]): INode[] | undefined {
  let res: INode[] = [];

  if (pattern.indexOf(root.tagName) > -1) return [root];
  else if (root.childNodes) {
    let cursor;
    for (let i = 0, len = root.childNodes.length; i < len; i += 1) {
      cursor = rowSelector(root.childNodes[i], pattern);
      if (cursor) {
        res = res.concat(cursor);
      }
    }
    return res;
  }
}

function formatPostContents(parent: INode, prefix: string): ContentRecord | ContentRecord[] | undefined {
  let res: ContentRecord[] = [];
  const rows = rowSelector(parent, ['p', 'blockquote']);
  if (!rows) return;

  const rowLen = rows.length;
  for (let i = 0; i < rowLen; i += 1) {
    const current = rows[i];
    const key = `${prefix}_${i}`;
    const value = findContext(current, key);
    if (value) res.push(value);
  }


  return res;
}


export default function parsePost(htmlString: string) {
  const startIndex = htmlString.indexOf('<!-- board_main start');
  const endIndex = htmlString.indexOf('<!-- board_main end', startIndex);
  const html = htmlString.substring(startIndex, endIndex);
  const Nodes = loadHtml(html);
  const res: any = {};

  const headerNode = querySelector(Nodes, 'div.board_main div.board_main_top');
  if (headerNode) {
    res.header = formatPostHeader(headerNode);
  }

  const mainNode = querySelector(Nodes, 'div.board_main div.board_main_view');
  if (mainNode) {
    const source = querySelector(mainNode, 'a');
    if (source && source.attrs) res.source = source.attrs.href;
  } else return;
  
  const contentNode = querySelector(mainNode, 'div.view_content');
  if (contentNode) {
    res.contents = formatPostContents(contentNode, '');
  }

  return res;
}
