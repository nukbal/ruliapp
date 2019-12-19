import parser, { querySelector, querySelectorAll } from 'utils/htmlParser';
import { UserState } from 'stores/user';
import { USER_AGENT } from 'config/constants';

const config = {
  method: 'GET',
  credentials: 'include',
  headers: {
    Accept: 'text/html',
    'Content-Type': 'text/html',
    'Cache-Control': 'no-cache, no-store',
    Pragma: 'no-cache',
    'Accept-Encoding': 'gzip, deflate',
    'User-Agent': USER_AGENT,
  },
};

export default async function getUserInfo() {
  try {
    // @ts-ignore
    const res = await fetch('https://bbs.ruliweb.com/member/mypage', config);
    if (res.status !== 200) {
      throw new Error('비로그인 상태입니다.');
    }

    let html = await res.text();
    let startIdx = html.indexOf('<div id="mypage"');
    startIdx = html.indexOf('<div class="left_area_top"', startIdx);
    const endIdx = html.indexOf('</table>', startIdx);

    html = html.substring(startIdx, endIdx);
    html += '</table></div>';

    // @ts-ignore
    const data: UserState['userInfo'] = {};
    const Node = parser(html);
    let cursor;

    cursor = querySelectorAll(Node, '.member_srl .info_value text');
    if (cursor && cursor.length) {
      data.id = cursor[1].value!;
    } else {
      throw new Error('비로그인 상태입니다.');
    }

    cursor = querySelector(Node, '.profile_img');
    if (cursor) data.avatar = cursor.attrs!.src;

    cursor = querySelector(Node, '.nick_name .info_value text');
    if (cursor) data.name = cursor.value!;

    cursor = querySelector(Node, '.level .info_value text');
    if (cursor) data.level = parseInt(cursor.value!, 10);

    cursor = querySelectorAll(Node, '.exp .info_value text');
    if (cursor && cursor.length) {
      data.expNow = cursor[0].value!;
      data.expLeft = cursor[1].value!;
    }

    cursor = querySelector(Node, '.attend .info_value text');
    if (cursor) data.attends = parseInt(cursor.value!, 10);

    cursor = querySelectorAll(Node, '.user_activity .activity_value text');
    if (cursor && cursor.length) {
      data.postCount = parseInt(cursor[0].value!, 10);
      data.postDelCount = parseInt(cursor[1].value!, 10);
      data.commentCount = parseInt(cursor[2].value!, 10);
      data.commentDelCount = parseInt(cursor[3].value!, 10);
      data.likeCount = parseInt(cursor[4].value!, 10);
    }

    return data;
  } catch (e) {
    throw new Error('로그인 정보 취득에 실패하였습니다.');
  }
}
