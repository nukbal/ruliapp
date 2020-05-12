import loadHtml, { INode, querySelectorAll, querySelector } from './htmlParser';
import parseDate from './parseDate';
import formatText from './formatText';

function formatComment(node: INode): CommentRecord | undefined {
  const record: CommentRecord = {
    key: '', content: [], user: { id: '', name: '' }, likes: 0, dislike: 0,
  };

  if (!node.attrs) return;

  let cursor;
  record.key = node.attrs.id || '';
  if (!record.key) {
    record.key = 'deleted';
    record.isDeleted = true;
    return record;
  }

  if (node.attrs.class.indexOf('child') > -1) {
    const replyNode = querySelector(node, '.p_nick text');
    if (replyNode) {
      record.reply = replyNode.value;
    }
  }

  const textNode = querySelector(node, '.text_wrapper');
  if (!textNode) return;

  cursor = querySelector(textNode, '.comment_img');
  if (!cursor) cursor = querySelector(textNode, 'video');
  if (cursor && cursor.attrs) {
    let url = cursor.attrs.src;
    if (url.indexOf('//') === 0) url = `https:${url}`;
    record.content.push({ type: 'image', value: url });
  }

  cursor = querySelector(textNode, '.text a');
  if (cursor && cursor.attrs) {
    if (cursor.attrs.href.indexOf('youtube.com') > -1) {
      record.content.push({ type: 'video', value: cursor.attrs.href });
    } else {
      record.content.push({ type: 'link', value: cursor.attrs.href });
    }
  }

  cursor = querySelector(textNode, '.text text');
  if (cursor && cursor.parent && cursor.parent.tagName !== 'a') {
    record.content.push({ type: 'text', value: formatText(cursor.value || '') });
  }

  const userInfo = querySelector(node, '.user');
  if (userInfo) {
    cursor = querySelector(userInfo, '.member_srl');
    if (cursor && cursor.attrs) record.user.id = cursor.attrs.value;
    else return;

    cursor = querySelector(userInfo, '.nick text');
    if (cursor && cursor.value) record.user.name = cursor.value;

    // cursor = querySelector(userInfo, '.ip text');
    // if (cursor && cursor.value) record.user.ip = cursor.value.replace('| ', '');

    cursor = querySelector(userInfo, '.time text');
    if (cursor && cursor.value) {
      const dateStr = cursor.value.replace('| ', '').trim();
      record.time = parseDate(dateStr);
    }
  }

  cursor = querySelector(node, '.btn_dislike');
  if (cursor) {
    const dislike = querySelector(cursor, '.num text');
    if (dislike && dislike.value) record.dislike = parseInt(dislike.value, 10);
  }

  cursor = querySelector(node, '.btn_like');
  if (cursor) {
    const like = querySelector(cursor, '.num text');
    if (like && like.value) record.likes = parseInt(like.value, 10);
  }

  return record;
}

export default function parseComment(htmlString: string) {
  const startIndex = htmlString.indexOf('<table class="comment_table best"');
  const endIndex = htmlString.indexOf('</table>', startIndex);
  let html = htmlString.substring(startIndex, endIndex);
  let Nodes = loadHtml(html);
  let commentNodes = querySelectorAll(Nodes, '.comment_table .comment_element');

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
  commentNodes = querySelectorAll(Nodes, '.comment_table .comment_element');

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
