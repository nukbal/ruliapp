import loadHtml, { INode, querySelectorAll, querySelector } from './htmlParser';
import parseComment from './parseComment';

interface HeaderType {
  subject: string;
  userName: string;
  userId: string;
  level?: number;
  exp?: number;
  age?: number;
  image?: string;
}

function formatPostHeader(parent: INode): HeaderType {
  const record: any = {};
  let cursor;
  const userInfo = querySelector(parent, 'div.user_view div.user_info');

  if (userInfo) {
    cursor = querySelector(userInfo, 'img.profile_img_m');
    if (cursor && cursor.attrs) record.image = cursor.attrs.src;
  
    cursor = querySelector(userInfo, 'span.level strong text');
    if (cursor) record.level = cursor.value;
  }

  cursor = querySelector(parent, 'div.user_view h4.subject span text');
  if (cursor) record.subject = cursor.value;

  return record;
}

function findContext(current: INode, key: string, style?: any): ContentRecord | undefined {
  const tagName = current.tagName;

  switch (tagName) {
    case 'text': {
      if (!current.value) return;
      const value = current.value.replace('&nbsp;', '');
      if (style) return { key, type: 'text', content: value, style };
      return { key, type: 'text', content: value };
    }
    case 'img': {
      if (!current.attrs || !current.attrs.src) return;
      let url = current.attrs.src;
      if (url.indexOf('//') === 0) {
        url = 'http://' + url.substring(2, url.length);
      }
      if (style) return { key, type: 'image', content: url, style };
      return { key, type: 'image', content: url };
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

interface PostType {
  header: ReturnType<typeof formatPostHeader>;
  source?: string;
  contents: ContentRecord[];
  comments: CommentRecord[];
}


export default function parsePost(htmlString: string): PostType | undefined {
  const startIndex = htmlString.indexOf('<!-- board_main start');
  const endIndex = htmlString.indexOf('<!-- board_main end', startIndex);
  let html = htmlString.substring(startIndex, endIndex);
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
  } else return;

  const cmtStartIdx = htmlString.indexOf('<!-- board_bottom start', endIndex);
  const cmtEndIdx = htmlString.indexOf('<!-- board_bottom end', cmtStartIdx);
  html = htmlString.substring(cmtStartIdx, cmtEndIdx);
  const comments = parseComment(html);
  res.comments = comments || [];

  return res;
}
