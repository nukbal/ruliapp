import { loadHtml } from './commonUtils';

const parseCommentRow = ($) => (_, item) => {
  const id = item.attribs.id.replace('ct_', '');
  const userElem = $('.user', item);
  const user = {
    name: userElem.find('.nick').text().trim(),
    id: userElem.find('span.member_srl').text().trim().replace('|', ''),
  };
  const like = $('button.btn_like', item).text().trim();
  const dislike = $('button.btn_dislike', item).text().trim();
  const time = $('span.time', item).text().replace(' |', '');
  const comment = $('td.comment span.text', item).text().trim();
  const isChild = $(item).hasClass('child');
  const isBest = $(item).has('.icon_best').length > 0;
  const image = $('td.comment img', item).length > 0 ? $('td.comment img', item).attr('src') : null;

  return {
    id,
    key: id,
    user,
    like,
    dislike,
    time,
    isChild,
    comment,
    image,
    isBest
  }
}

export const parseComment = (htmlString) => {
  const $ = loadHtml(htmlString);
  const bestCommentList = $('table.comment_table.best tr').map(parseCommentRow($)).get();
  const commentList = $('table.comment_table:not(.best) tr').map(parseCommentRow($)).get();

  return {
    commentList,
    bestCommentList,
  }
}

export const parseDetail = (htmlString) => {
  const contentStartIndex = htmlString.indexOf('<div class="board_main"');
  const contentEndIndex = htmlString.indexOf('<!-- board_main end');
  const html = htmlString.substring(contentStartIndex, contentEndIndex);
  const $ = loadHtml(html);

  const reference = $('div.source_url a').attr('href');
  const contents = $('div.board_main_view .view_content')[0].childNodes.map((item, i) => {
    if (item.type === 'tag' && item.name === 'br') return;

    let content;
    let type;
    if (item.type === 'tag' && (item.name === 'p' || item.name === 'div')) {
      const _$ = $(item);
      const text = _$.text().trim();
      const isImg = _$.has('img').length === 1;
      const isEmbeded = _$.has('iframe').length === 1;
      if ((!isImg && !isEmbeded) && (text === '<br />' || text === '' || text === '&nbsp;')) return;
  
      if (isEmbeded) {
        type = 'embeded';
        content = $('iframe', item).attr('src');
      } else if (isImg) {
        type = 'image';
        content = $('img', item).attr('src');
      } else {
        type = 'text';
        content = text;
      }
    } else if (item.type === 'tag' && item.name == 'img'){
      type = 'image';
      content = item.attribs.src;
    } else if (item.type === 'tag' && item.name == 'iframe') {
      type = 'embeded';
      content = item.attribs.src;
    } else if (item.type === 'tag') {
      type = 'text';
      content = $(item).text().trim();
    } else if (item.type === 'text') {
      const text = item.data.trim();
      if (text) {
        type = 'text';
        content = item.data.trim();
      } else {
        return;
      }
    }

    return {
      type,
      key: `${i}`,
      content,
    };
  }).filter(item => item);

  const likes = $('span.like_value').text();
  const dislikes = $('span.dislike_value').text();
  const comments = $('div.comment_count strong.reply_count').text().trim();

  const commentStartIndex = htmlString.indexOf('<div class="board_bottom"');
  const commentEndIndex = htmlString.indexOf('<!-- board_bottom end');
  const commentHtml = htmlString.substring(commentStartIndex, commentEndIndex);
  const { commentList, bestCommentList } = parseComment(commentHtml);

  return {
    contents,
    reference,
    comments,
    likes,
    dislikes,
    commentList,
    bestCommentList,
  }
}


export const parseBoardList = (htmlString, page) => {
  const startIndex = htmlString.indexOf('<table class="board_list_table"');
  const endIndex = htmlString.indexOf('</table>');
  const html = htmlString.substring(startIndex, endIndex);
  const $ = loadHtml(html);

  const title = $('head title').text().replace('루리웹', '').replace('|', '').trim()

  const items = $('table.board_list_table tbody tr').map((_, row) => {
    const link = $('td.subject a' ,row).attr('href').replace('http://bbs.ruliweb.com/', '');
    const id = link.substring(link.lastIndexOf('/') + 1, link.length);
    const prefix = link.substring(0, link.indexOf('/'));
    const boardId = link.substring(link.indexOf('board/') + 6, link.indexOf('/read'));
    return {
      id,
      key: `${prefix}_${boardId}_${id}`,
      prefix,
      boardId,
      type: $('td.divsn a', row).text().trim(),
      title: $('td.subject a', row).text().trim(),
      comments: $('td.subject span.num_reply span.num', row).text().trim(),
      author: $('td.writer a', row).text().trim(),
      likes: $('td.recomd', row).text().trim(),
      views: $('td.hit', row).text().trim(),
      times: $('td.time', row).text().trim(),
    };
  }).get();

  return {
    title,
    items,
    page,
  }
}
