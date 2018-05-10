import { loadHtml } from './commonUtils';

const extractTitle = (html) => {
  const regex = /<title>(.*?)<\/title>/g
  const str = html.match(regex).map(val => val.replace(/<\/?title>/g,''));
  return str.length ? str[0].substring(0, str[0].indexOf(' | ')) : '';
}

const parseCommentRow = (nodes) => {
  const result = [];
  for (let i = 0, len = nodes.length; i < len; i++) {
    const item = nodes[i];
    const row = {};

    const userNode = item.childNodes[1].childNodes[1];
    const commentNode = item.childNodes[3];
  
    row.id = item.attributes.id.replace('ct_', '');
    row.isChild = item.attributes.class.indexOf('child') !== -1;

    row.user = {
      name: item.querySelector('div.nick').text.trim(),
      id: item.querySelector('input.member_srl').attributes.value,
    };

    row.comment = item.querySelector('span.text').text;

    const image = item.querySelector('img');
    if (image) {
      row.image = image.attributes.src;
    }

    if (item.querySelector('span.icon_best')) {
      row.isBest = true;
    }

    row.time = item.querySelector('span.time').text.trim();
    row.like = item.querySelector('button.btn_like').text.trim();
    row.dislike = item.querySelector('button.btn_dislike').text.trim();
    row.key = row.id;
  
    result.push(row);
  }
  return result;
}

const formatContentNode = (item, key) => {
  let type;
  let content;
  if (item.tagName) {
    if (item.tagName === 'img') {
      type = 'image';
      content = item.attributes.src;
    } else if (item.tagName === 'iframe') {
      type = 'embed';
      content = item.attributes.src;
    } else if (item.tagName === 'a' && item.childNodes.length && item.childNodes[0].tagName === 'img') {
      type = 'image';
      content = item.childNodes[0].attributes.src;
    } else if (item.tagName === 'a') {
      type = 'link';
      content = item.attributes.href;
    } else if (['b', 'strong', 'span'].indexOf(item.tagName) !== -1 && item.childNodes.length) {
      const child = item.childNodes[0];
      if (child.tagName === 'text') {
        const text = child.data && child.data.trim();
        if (text) {
          type = 'text';
          content = text;
        }
      } else if (child.rawText) {
        type = 'text';
        content = child.rawText.replace('&nbsp;', '');
      }
    }
  } else if (item.rawText) {
    type = 'text';
    content = item.rawText.replace('&nbsp;', '');
  }

  if (type && content) {
    return { type, key, content };
  }
}

export const parseComment = (htmlString) => {
  const $ = loadHtml(htmlString);
  const bestCommentList = parseCommentRow($.querySelectorAll('table.comment_table.best tr'));
  const commentList = parseCommentRow($.querySelectorAll('.comment_view.normal tr'));
  return {
    commentList,
    bestCommentList,
  }
}

export const parseDetail = (htmlString) => {
  const title = extractTitle(htmlString);
  const contentStartIndex = htmlString.lastIndexOf('<div class="view_content"');
  const contentEndIndex = htmlString.lastIndexOf('<div class="notice_read_bottom');
  let html = htmlString.substring(contentStartIndex, contentEndIndex);
  const $ = loadHtml(html);

  let _node = $.querySelector('.view_content').removeWhitespace();

  const contentsNodes = _node.childNodes;
  const contentsLength = contentsNodes.length;

  const contents = [];
  for (let i = 0; i < contentsLength; i++) {
    const item = contentsNodes[i];
    let result;
    if (item.tagName === 'br') continue;

    if (item.tagName === 'p' || item.tagName === 'div') {
      for (let j = 0, len = item.childNodes.length; j < len; j++) {
        const child = item.childNodes[j];
        if (child.tagName === 'br') continue;

        let childResult = formatContentNode(child, `${i}_${j}`);
        if (childResult) contents.push(childResult);
      }
    } else {
      result = formatContentNode(item, `${i}`);
    }

    if (result) contents.push(result);
  }

  const reference = $.querySelector('div.source_url a');
  if (reference) contents.unshift({ type: 'reference', key: 'ref', content: reference });

  const likeIdx = htmlString.indexOf('class="like_value">');
  const likes = htmlString.substring(likeIdx + 19, htmlString.indexOf('<', likeIdx));

  const disIdx = htmlString.indexOf('class="dislike_value">', likeIdx);
  const dislikes = disIdx > 0 ? htmlString.substring(disIdx + 22, htmlString.indexOf('<', disIdx)) : null;

  const commentIdx = htmlString.indexOf('class="reply_count">', likeIdx);
  const comments = commentIdx > 0 ? htmlString.substring(commentIdx + 20, htmlString.indexOf('<', commentIdx)) : null;

  const commentStartIndex = htmlString.indexOf('<div class="board_bottom"');
  const commentEndIndex = htmlString.indexOf('<!-- board_bottom end');
  const commentHtml = htmlString.substring(commentStartIndex, commentEndIndex);
  const { commentList, bestCommentList } = parseComment(commentHtml);

  return {
    title,
    contents,
    reference,
    comments,
    likes,
    dislikes,
    commentList,
    bestCommentList,
  }
}


const formatBoardRow = (nodes) => {
  const length = nodes.childNodes.length;
  const result = {};
  const subject = nodes.querySelector('td.subject a');
  const link = subject.attributes.href.replace('http://bbs.ruliweb.com/', '');

  result.id = link.substring(link.lastIndexOf('/') + 1, link.length);
  result.title = subject.rawText.trim();
  result.prefix = link.substring(0, link.indexOf('/'));
  result.boardId = link.substring(link.indexOf('board/') + 6, link.indexOf('/read'));

  const comments = nodes.querySelector('span.num');
  if (comments) result.comments = comments.text;
  result.author = nodes.querySelector('td.writer').text;
  result.likes = nodes.querySelector('td.recomd').text;
  result.views = nodes.querySelector('td.hit').text;
  result.times = nodes.querySelector('td.time').text;

  result.key = `${result.prefix}_${result.boardId}_${result.id}`;
  return result;
}


export const parseBoardList = (htmlString, page) => {
  const title = extractTitle(htmlString);
  const startIndex = htmlString.indexOf('<table class="board_list_table"');
  const endIndex = htmlString.indexOf('</table>');
  const html = htmlString.substring(startIndex, endIndex);
  const $ = loadHtml(html);

  const boardNodes = $.querySelectorAll('table.board_list_table tbody tr');
  const length = boardNodes.length;
  const items = [];
  for(let i = 0; i < length; i++) {
    items.push(formatBoardRow(boardNodes[i]));
  }

  return {
    title,
    items,
    page,
  }
}
