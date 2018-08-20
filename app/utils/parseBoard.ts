import loadHtml, { INode, querySelectorAll, querySelector } from './htmlParser';

export function parseBoardUrl(href: string) {
  const res: any = {};
  const url = href.replace('http://m.ruliweb.com', '').replace('/', '');

  let cursor = url.indexOf('/board');
  res.prefix = url.substring(0, cursor);

  cursor = cursor + 7;

  // detect if the link is for post
  if (url.indexOf('/read/', cursor) > -1) {
    const startIdx = url.indexOf('/read/', cursor);
    res.boardId = url.substring(cursor, startIdx); 
    res.id = url.substring(startIdx + 6, url.length).replace('?', '');
    res.key = `${res.prefix}_${res.boardId}_${res.id}`;
  } else {
    const queryIdx = url.indexOf('?', cursor + 7);
    if (queryIdx > -1 && queryIdx !== url.length - 1) {
      const queryStr = url.substring(queryIdx + 1, url.length);
      res.param = queryStr.split('&')
        .filter(item => item)
        .map(item => item.split('='))
        .reduce((acc, cur) => {
          const res: any = acc;
          res[cur[0]] = cur[1];
          return res;
        }, {});

      res.boardId = url.substring(cursor, queryIdx).replace('/list', '');
    } else {
      res.boardId = url.substring(cursor, url.length);
    }
    res.key = `${res.prefix}_${res.boardId}`;
  }

  return res;
}

function formatBoardRow(node: INode): BoardRecord | undefined {
  // @ts-ignore
  const record: BoardRecord = {};

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
    record.link = parseBoardUrl(cursor.attrs.href!);
    const text = querySelector(cursor, 'text');
    if (text) record.subject = text.value!;
  } else return;

  // board category
  cursor = querySelector(titleDiv, 'a.cate_label text');
  const bracketRegex = new RegExp(/[\[|\]]/, 'g');
  if (cursor) {
    record.categoryName = cursor.value!.replace(bracketRegex, '');
  } else {
    cursor = querySelector(infoDiv, 'a.board_name text');
    if (cursor) record.categoryName = cursor.value!.replace(bracketRegex, '');
  }

  // count of comments
  cursor = querySelector(titleDiv, 'span.num text');
  if (cursor) record.comments = cursor.value;

  // author name
  cursor = querySelector(infoDiv, 'span.writer text');
  if (cursor) record.author = cursor.value!;

  // view counts
  cursor = querySelector(infoDiv, 'span.hit text');
  if (cursor) record.views = cursor.value!.replace('조회 ', '');

  // posted date/time
  cursor = querySelector(infoDiv, 'span.time text');
  if (cursor) record.date = cursor.value!.replace('날짜 ', '');

  cursor = querySelector(infoDiv, 'span.recomd text');
  if (cursor) record.likes = cursor.value!.replace('추천 ', '');

  return record;
}

export interface IParseBoard { 
  title: string;
  rows: BoardRecord[];
  notices: BoardRecord[];
}

export default function parseBoardList (htmlString: string): IParseBoard {
  const title = '';
  const startIndex = htmlString.indexOf('<table class="board_list_table"');
  const endIndex = htmlString.indexOf('</table>', startIndex);
  const html = htmlString.substring(startIndex, endIndex);
  const Nodes = loadHtml(html);

  const boardNodes = querySelectorAll(Nodes, 'table.board_list_table tr.table_body');
  if (!boardNodes) return { title, rows: [], notices: [] };

  const data = [];

  for (let i = 0; i < boardNodes.length; i += 1) {
    const temp = formatBoardRow(boardNodes[i]);
    if (temp) data.push(temp);
  }

  const rows = data.filter(item => !item.isNotice);
  const notices = data.filter(item => item.isNotice);

  return {
    title,
    notices,
    rows,
  }
}
