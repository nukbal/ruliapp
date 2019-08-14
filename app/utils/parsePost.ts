import loadHtml, { INode, querySelector } from './htmlParser';
import parseComment from './parseComment';
import formatText from './formatText';

interface HeaderType {
  name: string;
  id: string;
  level?: number;
  experience?: number;
  age?: number;
  image?: string;
}

export function parseTitle(html: string) {
  const startIdx = (html.indexOf('<title>') + 7);
  const endIdx = html.indexOf('</title', startIdx);
  const str = html.substring(startIdx, endIdx);
  return str.substring(0, str.indexOf(' | '));
}

export function parsePostUser(parent: INode): HeaderType {
  const record: any = {};
  let cursor;
  const userInfo = querySelector(parent, 'div.user_info');

  if (userInfo) {
    cursor = querySelector(userInfo, 'img.profile_img_m');
    if (cursor && cursor.attrs) record.image = cursor.attrs.src;

    cursor = querySelector(userInfo, 'a.nick strong text');
    if (cursor && cursor.value) record.name = cursor.value;

    cursor = querySelector(userInfo, 'input#member_srl');
    if (cursor && cursor.attrs) record.id = cursor.attrs.value;

    cursor = querySelector(userInfo, 'span.level strong text');
    if (cursor && cursor.value) record.level = parseInt(cursor.value, 10);

    cursor = querySelector(userInfo, 'span.exp_text strong text');
    if (cursor && cursor.value) record.experience = parseInt(cursor.value.replace('%', ''), 10);
  }

  return record;
}

export function rowSelector(root: INode, pattern: string[]): INode[] | undefined {
  let res: INode[] = [];

  if (pattern.indexOf(root.tagName) > -1) return [root];
  if (root.childNodes) {
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

export function findContext(
  current: INode, key: string, style?: any,
): ContentRecord | ContentRecord[] | undefined {
  const { tagName } = current;

  switch (tagName) {
    case 'text': {
      if (!current.value) return;
      const value = formatText(current.value);
      if (value === 'GIF') return;

      if (style) return { key, type: 'text', content: value, style };
      return { key, type: 'text', content: value };
    }
    case 'img': {
      if (!current.attrs || !current.attrs.src) return;
      let url = current.attrs.src;
      if (url.indexOf('//') === 0) {
        url = `https://${url.substring(2, url.length)}`;
      }
      url = url.replace('ruliweb.com/mo', 'ruliweb.net/ori');

      if (style) return { key, type: 'image', content: url, style };
      return { key, type: 'image', content: url };
    }
    case 'iframe': {
      if (!current.attrs || !current.attrs.src) return;
      return { key, type: 'object', content: current.attrs.src };
    }
    case 'video': {
      if (!current.attrs || !current.attrs.src) return;
      let url = current.attrs.src;
      if (url.indexOf('//') === 0) {
        url = `https://${url.substring(2, url.length)}`;
      }
      return { key, type: 'video', content: url };
    }
    case 'p': {
      const rows = rowSelector(current, ['img', 'text', 'iframe', 'video']);
      if (!rows) return;
      const hasStyle = current.attrs && current.attrs.style;

      let arr: ContentRecord[] = [];

      for (let i = 0, len = rows.length; i < len; i += 1) {
        const value = findContext(rows[i], `${key}_${i}`, hasStyle && current.attrs!.style);
        if (value) {
          if (Array.isArray(value)) {
            arr = arr.concat(value);
          } else {
            arr.push(value);
          }
        }
      }
      return arr.length > 1 ? arr : arr[0];
    }
    default:
  }
}

export function parsePostContents(
  parent: INode, prefix: string,
): ContentRecord | ContentRecord[] | undefined {
  let res: ContentRecord[] = [];
  const rows = rowSelector(parent, ['p']);
  if (!rows) return;

  const rowLen = rows.length;
  for (let i = 0; i < rowLen; i += 1) {
    const current = rows[i];
    const key = `${prefix}_${i}`;
    const value = findContext(current, key);
    if (value) {
      if (Array.isArray(value)) {
        res = res.concat(value);
      } else res.push(value);
    }
  }

  return res;
}

interface PostType {
  subject: string;
  user: ReturnType<typeof parsePostUser>;
  source?: string;
  contents: ContentRecord[];
  comments: CommentRecord[];
}


export default function parsePost(htmlString: string, prefix: string = ''): PostType | undefined {
  const startIndex = htmlString.indexOf('<!-- board_main start');
  const endIndex = htmlString.indexOf('<!-- board_main end', startIndex);
  let html = htmlString.substring(startIndex, endIndex);
  if (!html) {
    throw new Error('failed to parse html string: cannnot found content section');
  }

  const Nodes = loadHtml(html);
  const res: any = {};

  res.subject = parseTitle(htmlString);
  if (!res.subject) return;

  const headerNode = querySelector(Nodes, 'div.board_main div.board_main_top');
  if (headerNode) {
    res.user = parsePostUser(headerNode);
  }

  const mainNode = querySelector(Nodes, 'div.board_main div.board_main_view');
  if (mainNode) {
    const source = querySelector(mainNode, 'div.source_url a');
    if (source && source.attrs) res.source = source.attrs.href;
  } else return;

  const contentNode = querySelector(mainNode, 'div.view_content');
  if (contentNode) {
    res.contents = parsePostContents(contentNode, prefix);
  } else return;

  const cmtStartIdx = htmlString.indexOf('<!-- board_bottom start', endIndex);
  const cmtEndIdx = htmlString.indexOf('<!-- board_bottom end', cmtStartIdx);
  html = htmlString.substring(cmtStartIdx, cmtEndIdx);
  const comments = parseComment(html);
  res.comments = comments || [];

  return res;
}
