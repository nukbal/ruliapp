import loadHtml, { INode, querySelectorAll, querySelector } from './htmlParser';


function formatBoardRow(node: INode): BoardRecord | undefined {
  const record = {};

  if (!node.childNodes) return;
  const td = node.childNodes[0];

  if (!td.childNodes) return;
 
  const titleDiv = td.childNodes[0];
  const infoDiv = td.childNodes[1];

  if (!titleDiv || !infoDiv) return;
  if (!titleDiv.childNodes || !infoDiv.childNodes) return;

  const temp = querySelector(titleDiv, 'span.subject_link text');
  console.log(temp);

  for (let i = 0, len = titleDiv.childNodes.length; i < len; i += 1) {
    const current = titleDiv.childNodes[i];
    if (!current.q || !current.childNodes) continue;
    if (current.q.indexOf('cate_label') > -1) {
      // @ts-ignore
      record.categoryName = current.childNodes[0].value;
    } else if (current.q.indexOf('subject_link') > -1) {
      // @ts-ignore
      record.title = current.childNodes[0].value;
    } else if (current.q.indexOf('num_reply') > -1) {
      const num = querySelector(current, 'span.num');
      // @ts-ignore
      if (num) record.commentNum = num.value;
    }
  }

  console.log(titleDiv);
  console.log(infoDiv);

  // const result = {};
  // const subject = nodes.querySelector('td.subject a');
  // const link = subject.attributes.href.replace('http://bbs.ruliweb.com/', '');

  // result.id = link.substring(link.lastIndexOf('/') + 1, link.length);
  // result.title = subject.rawText.trim();
  // result.prefix = link.substring(0, link.indexOf('/'));
  // result.boardId = link.substring(link.indexOf('board/') + 6, link.indexOf('/read'));

  // const comments = nodes.querySelector('span.num');
  // if (comments) result.comments = comments.text;
  // result.author = nodes.querySelector('td.writer').text;
  // result.likes = nodes.querySelector('td.recomd').text;
  // result.views = nodes.querySelector('td.hit').text;
  // result.times = nodes.querySelector('td.time').text;

  // result.key = `${result.prefix}_${result.boardId}_${result.id}`;
  // return result;
  return record;
}


export default function parseBoardList (htmlString: string): { title: string, data: BoardRecord[] } {
  const title = '';
  const startIndex = htmlString.indexOf('<table class="board_list_table"');
  const endIndex = htmlString.indexOf('</table>');
  const html = htmlString.substring(startIndex, endIndex);
  const Nodes = loadHtml(html);

  const boardNodes = querySelectorAll(Nodes, 'table.board_list_table tbody tr');
  if (!boardNodes) return { title, data: []};

  const data = [];

  for (let i = 0; i < boardNodes.length; i += 1) {
    if (i === 0) {
      const temp = formatBoardRow(boardNodes[i]);
      if (temp) data.push(temp);
    }
  }

  return {
    title,
    data,
  }
}
