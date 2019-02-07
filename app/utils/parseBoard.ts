import loadHtml, { INode, querySelectorAll, querySelector } from './htmlParser';
import parseDate from './parseDate';


function parseTitle(html: string) {
  const startIdx = (html.indexOf('<title>') + 7);
  const endIdx = html.indexOf('</title', startIdx);
  const str = html.substring(startIdx, endIdx);
  return str.substring(0, str.indexOf(' | '));
}

export function parseBoardUrl(href: string) {
  const url = href.replace('http://m.ruliweb.com', '').replace('/', '');

  let id = null;
  let cursor = url.indexOf('/board');
  let query = url;

  cursor = cursor + 7;

  const startIdx = url.indexOf('/read/', cursor);
  id = url.substring(startIdx + 6, url.length);
  if (id.indexOf('?') > 0) {
    id = id.substring(0, id.indexOf('?'));
  }
  if (query.indexOf('?') > 0) {
    query = query.substring(0, query.indexOf('?'));
  }

  return { id, url: query };
}

export function formatBoardRow(node: INode): PostRecord | undefined {
  // @ts-ignore
  const record: PostRecord = {};

  if (!node.childNodes) return;
  const td = node.childNodes[0];

  if (!td.childNodes) return;
 
  const titleDiv = td.childNodes[0];
  const infoDiv = td.childNodes[1];

  if (!titleDiv || !infoDiv) return;
  if (!titleDiv.childNodes || !infoDiv.childNodes) return;

  let cursor;

  if (node.q!.indexOf('notice') > -1) record.isNotice = true;

  // board title
  cursor = querySelector(titleDiv, 'a.subject_link');
  if (cursor && cursor.attrs) {
    const { id, url } = parseBoardUrl(cursor.attrs.href!);
    if (!id) return;
    record.key = id;
    record.url = url;

    const text = querySelector(cursor, 'text');
    if (text) record.subject = text.value!;
  } else return;

  // board category
  // cursor = querySelector(titleDiv, 'a.cate_label text');
  // const bracketRegex = new RegExp(/[\[|\]]/, 'g');
  // if (cursor) {
  //   record.categoryName = cursor.value!.replace(bracketRegex, '');
  // } else {
  //   cursor = querySelector(infoDiv, 'a.board_name text');
  //   if (cursor) record.categoryName = cursor.value!.replace(bracketRegex, '');
  // }

  // count of comments
  cursor = querySelector(titleDiv, 'span.num text');
  if (cursor && cursor.value) record.commentSize = parseInt(cursor.value);

  // author name
  cursor = querySelector(infoDiv, 'span.writer text');
  // @ts-ignore
  if (cursor) record.user = { name: cursor.value! };

  // view counts
  cursor = querySelector(infoDiv, 'span.hit text');
  if (cursor && cursor.value) record.views = parseInt(cursor.value.replace('조회 ', ''), 10);

  // posted date/time
  cursor = querySelector(infoDiv, 'span.time text');
  if (cursor && cursor.value) {
    const dateStr = cursor.value.replace('날짜 ', '');
    record.date = parseDate(dateStr);
  }

  cursor = querySelector(infoDiv, 'span.recomd text');
  if (cursor && cursor.value) record.likes = parseInt(cursor.value!.replace('추천 ', ''), 10);

  return record;
}

export interface IParseBoard { 
  title: string;
  rows: PostRecord[];
  notices: PostRecord[];
}

export default function parseBoardList (htmlString: string, key: string): IParseBoard {
  const title = parseTitle(htmlString);
  const startIndex = htmlString.indexOf('<table class="board_list_table"');
  const endIndex = htmlString.indexOf('</table>', startIndex);
  const html = htmlString.substring(startIndex, endIndex);
  const Nodes = loadHtml(html);

  const boardNodes = querySelectorAll(Nodes, 'table.board_list_table tr.table_body');
  if (!boardNodes) return { title, rows: [], notices: [] };

  const data = [];

  for (let i = 0; i < boardNodes.length; i += 1) {
    const temp = formatBoardRow(boardNodes[i]);
    if (temp) data.push({ ...temp, parent: key });
  }

  const rows = data.filter(item => !item.isNotice);
  const notices = data.filter(item => item.isNotice);

  return {
    title,
    notices,
    rows,
  }
}
