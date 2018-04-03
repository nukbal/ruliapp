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

    const userNode = item.children[1].children[1];
    const commentNode = item.children[3];
  
    row.id = item.attribs.id.replace('ct_', '');
    row.isChild = item.attribs.class.indexOf('child') !== -1;

    for (let j = 0, clen = commentNode.children[1].children.length; j < clen; j++) {
      const cItem = commentNode.children[1].children[j];
      if (cItem.name === 'span' && cItem.attribs.class === 'text' && cItem.children.length) {
        if (cItem.children[0].type === 'text') {
          row.comment = cItem.children[0].data.trim();
        } else {
          row.comment = cItem.children[0].children[0].data;
        }
      } else if (cItem.name === 'img') {
        row.image = cItem.attribs.src;
      } else if (cItem.name === 'span' && cItem.attribs.class === 'icon_best') {
        row.isBest = true;
      }
    }
    
    if (row.isChild) {
      row.user = {
        name: userNode.children[3].children[1].children[0].children[0].data.trim(),
        id: userNode.children[5].attribs.value,
      };
      const infoNode = commentNode.children[1].children[commentNode.children[1].children.length - 2];
      row.time = infoNode.children[3].children[0].data.trim();
      row.like = infoNode.children[11].children[5].children[0].data.trim();
      row.dislike = infoNode.children[15].children[5].children[0].data.trim();

    } else {
      row.user = {
        name: userNode.children[1].children[1].children[0].children[0].data.trim(),
        id: userNode.children[3].attribs.value,
      };

      const infoNode = item.children[5].children[1];
      row.time = infoNode.children[1].children[0].data.trim();
      row.like = infoNode.children[3].children[3].children[0].data.trim();
      row.dislike = infoNode.children[5].children[3].children[0].data.trim();
    }

    row.key = row.id;
  
    result.push(row);
  }
  return result;
}

const formatContentNode = (item, key) => {
  let type;
  let content;
  if (item.type === 'tag') {
    if (item.name === 'img') {
      type = 'image';
      content = item.attribs.src;
    } else if (item.name === 'iframe') {
      type = 'embed';
      content = item.attribs.src;
    } else if (item.name === 'a' && item.children[0].name === 'img') {
      type = 'image';
      content = item.children[0].attribs.src;
    } else if (item.name === 'a') {
      type = 'link';
      content = item.attribs.href;
    } else if (['b', 'strong', 'span'].indexOf(item.name) !== -1 && item.children.length) {
      const child = item.children[0];
      if (child.type === 'text') {
        const text = child.data && child.data.trim();
        if (text) {
          type = 'text';
          content = text;
        }
      } else if (child.children.length && child.children[0].type === 'text') {
        const text = child.children[0].data && child.children[0].data.trim();
        if (text) {
          type = 'text';
          content = text;
        }
      }
    }
  } else if (item.type === 'text') {
    const text = item.data.trim();
    if (text) {
      type = 'text';
      content = text;
    }
  }

  if (type && content) {
    return { type, key, content };
  }
}

export const parseComment = (htmlString) => {
  const $ = loadHtml(htmlString);
  const bestCommentList = parseCommentRow($('table.comment_table.best tr'));
  const commentList = parseCommentRow($('table.comment_table:not(.best) tr'));
  return {
    commentList,
    bestCommentList,
  }
}

export const parseDetail = (htmlString) => {
  const title = extractTitle(htmlString);
  const contentStartIndex = htmlString.indexOf('<div class="view_content"');
  const contentEndIndex = htmlString.indexOf('<div class="notice_read_bottom');
  let html = htmlString.substring(contentStartIndex, contentEndIndex);
  html = html.replace('&nbsp;', '').replace('<p></p>', '');
  const $ = loadHtml(html);

  let _node = $('.view_content');

  if (_node.find('.view_content').length > 0) {
    _node = _node.find('.view_content');
  }

  const contentsNodes = _node[0].childNodes;
  const contentsLength = contentsNodes.length;

  const contents = [];
  for (let i = 0; i < contentsLength; i++) {
    const item = contentsNodes[i];
    let result;
    if (item.type === 'tag' && item.name === 'br') continue;

    if (item.type === 'tag' && (item.name === 'p' || item.name === 'div')) {
      for (let j = 0, len = item.children.length; j < len; j++) {
        const child = item.children[j];
        if (child.type === 'tag' && child.name === 'br') continue;

        let childResult = formatContentNode(child, `${i}_${j}`);
        if (childResult) contents.push(childResult);
      }
    } else {
      result = formatContentNode(item, `${i}`);
    }

    if (result) contents.push(result);
  }

  const reference = $('div.source_url a').attr('href');
  if (reference) contents.unshift({ type: 'reference', key: 'ref', content: reference });

  const likes = $('span.like_value').text();
  const dislikes = $('span.dislike_value').text();
  const comments = $('div.comment_count strong.reply_count').text().trim();

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
  const length = nodes.children.length;
  const result = {};
  for (let i = 0; i < length; i++) {
    const item = nodes.children[i];
    if (item.type !== 'tag') continue;

    if (['board_name', 'divsn'].indexOf(item.attribs.class) !== -1) {
      result.type = item.children[0].data;
    } else if (item.attribs.class.indexOf('subject') !== -1) {
      let subject = item.children[1];
      let comment = item.children[3];
      if (subject.attribs.class === 'relative') {
        subject = item.children[1].children[1];
        let flag = true;
        for (let j = 0, len = item.children[1].children.length; j < len; j++) {
          if (item.children[1].children[j].name === 'span') {
            comment = item.children[1].children[j];
            flag = false;
            break;
          }
        }
        if (flag) comment = null;
      }
      const link = subject.attribs.href.replace('http://bbs.ruliweb.com/', '');
      const id = link.substring(link.lastIndexOf('/') + 1, link.length);
      const prefix = link.substring(0, link.indexOf('/'));
      const boardId = link.substring(link.indexOf('board/') + 6, link.indexOf('/read'));
  
      result.title = subject.children[0].data;
      if (comment) {
        result.comments = comment.children[1].children[0].data;
      } else {
        result.comments = 0;
      }
      result.prefix = prefix;
      result.boardId = boardId;
      result.id = id;
    } else if (item.attribs.class.indexOf('writer') !== -1) {
      result.author = item.children[0].data.trim();
    } else if (item.attribs.class.indexOf('recomd') !== -1) {
      result.likes = item.children[0].data.trim();
    } else if (item.attribs.class.indexOf('hit') !== -1) {
      result.views = item.children[0].data.trim();
    } else if (item.attribs.class.indexOf('time') !== -1) {
      result.times = item.children[0].data.trim();
    } else if (item.attribs.class.indexOf('id') !== -1) {
      result.id = item.children[0].data.trim();
    }
  }

  result.key = `${result.prefix}_${result.boardId}_${result.id}`;
  return result;
}


export const parseBoardList = (htmlString, page) => {
  const title = extractTitle(htmlString);
  const startIndex = htmlString.indexOf('<table class="board_list_table"');
  const endIndex = htmlString.indexOf('</table>');
  const html = htmlString.substring(startIndex, endIndex);
  const $ = loadHtml(html);

  const boardNodes = $('table.board_list_table tbody tr:not(.notice)');
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
