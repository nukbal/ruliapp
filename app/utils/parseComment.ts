import loadHtml, { INode, querySelectorAll, querySelector } from './htmlParser';
import parseDate from './parseDate';
import formatText from './formatText';

function formatComment(node: INode): CommentRecord | undefined {
  // @ts-ignore
  const record: CommentRecord = {};
  record.user = { id: '', name: '' };

  if (!node.q) return;
  let cursor;

  record.key = node.q.substring(0, node.q.indexOf(' '));
  if (node.q.indexOf('child') > -1) {
    let current = node.prev;
    while (current) {
      if (current.q && current.q.indexOf('parent') > -1) {
        record.child = current.q.substring(0, node.q.indexOf(' '));
        break;
      }
      current = current.prev;
    }
  }

  const textNode = querySelector(node, 'div.text_wrapper');
  if (!textNode) return;

  cursor = querySelector(textNode, 'span.text');
  // @ts-ignore
  if (cursor && cursor.childNodes) record.content = formatText(cursor.childNodes[0] ? cursor.childNodes[0].value : '');

  cursor = querySelector(textNode, 'img.comment_img');
  if (cursor && cursor.attrs) record.image = cursor.attrs.src;

  const userInfo = querySelector(node, 'div.user');
  if (userInfo) {
    cursor = querySelector(userInfo, 'input.member_srl');
    if (cursor && cursor.attrs) record.user.id = cursor.attrs.value;
    else return;

    cursor = querySelector(userInfo, 'strong.nick text');
    if (cursor && cursor.value) record.user.name = cursor.value;

    cursor = querySelector(userInfo, 'span.ip text');
    if (cursor && cursor.value) record.user.ip = cursor.value.replace('| ', '');

    cursor = querySelector(userInfo, 'span.time text');
    if (cursor && cursor.value) {
      const dateStr = cursor.value.replace('| ', '').trim();
      record.time = parseDate(dateStr);
    }
  }

  cursor = querySelector(node, 'button.btn_dislike');
  if (cursor) {
    const dislike = querySelector(cursor, 'span.num text');
    if (dislike) record.dislike = dislike.value;
  }

  cursor = querySelector(node, 'button.btn_like');
  if (cursor) {
    const like = querySelector(cursor, 'span.num text');
    if (like) record.likes = like.value;
  }

  return record;
}

export default function parseComment(htmlString: string) {
  const startIndex = htmlString.indexOf('<table class="comment_table best"');
  const endIndex = htmlString.indexOf('</table>', startIndex);
  let html = htmlString.substring(startIndex, endIndex);
  let Nodes = loadHtml(html);
  let commentNodes = querySelectorAll(Nodes, 'table.comment_table tr.comment_element');

  let data = [];
  const best = [];
  const keylist = [];

  if (commentNodes) {
    for (let i = 0; i < commentNodes.length; i += 1) {
      const temp = formatComment(commentNodes[i]);
      if (temp) {
        best.push(temp);
        keylist.push(temp.key);
      }
    }
  }

  const normalIdx = htmlString.indexOf('<table class="comment_table', endIndex);
  html = htmlString.substring(normalIdx, htmlString.indexOf('</table>', normalIdx));
  Nodes = loadHtml(html);
  commentNodes = querySelectorAll(Nodes, 'table.comment_table tr.comment_element');

  if (commentNodes) {
    for (let i = 0; i < commentNodes.length; i += 1) {
      const temp = formatComment(commentNodes[i]);
      if (temp) {
        if (keylist.indexOf(temp.key) > -1) {
          best.splice(keylist.indexOf(temp.key), 1);
          keylist.splice(keylist.indexOf(temp.key), 1);
        }
        data.push(temp);
      }
    }
  }

  if (best.length) {
    data = data.concat(best);
  }

  return data;
}