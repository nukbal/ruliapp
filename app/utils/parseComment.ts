import loadHtml, { INode, querySelectorAll, querySelector } from './htmlParser';

function formatComment(node: INode): CommentRecord | undefined {
  // @ts-ignore
  const record: CommentRecord = {};
  if (!node.q) return;
  let cursor;

  record.key = node.q.substring(0, node.q.indexOf(' '));

  const textNode = querySelector(node, 'div.text_wrapper');
  if (!textNode) return;

  cursor = querySelector(textNode, 'span.text');
  // @ts-ignore
  if (cursor && cursor.childNodes) record.content = (cursor.childNodes[0] ? cursor.childNodes[0].value : '');

  cursor = querySelector(textNode, 'img.comment_img');
  if (cursor) console.log(cursor.attrs);
  if (cursor && cursor.attrs) record.image = cursor.attrs.src;

  const userInfo = querySelector(node, 'div.user');
  if (userInfo) {
    cursor = querySelector(userInfo, 'input.member_srl');
    if (cursor && cursor.attrs) record.userId = cursor.attrs.value;

    cursor = querySelector(userInfo, 'strong.nick text');
    if (cursor) record.userName = cursor.value;

    cursor = querySelector(userInfo, 'span.ip text');
    if (cursor && cursor.value) record.userIp = cursor.value.replace('| ', '');

    cursor = querySelector(userInfo, 'span.time text');
    if (cursor && cursor.value) record.time = cursor.value.replace('| ', '');
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

  const data = [];

  if (commentNodes) {
    for (let i = 0; i < commentNodes.length; i += 1) {
      const temp = formatComment(commentNodes[i]);
      if (temp) data.push(temp);
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
        data.push(temp);
      }
    }
  }

  return data;
}
