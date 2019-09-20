import parser, { querySelector, querySelectorAll } from '../../utils/htmlParser';
import { AuthContext } from '../../AuthContext';

const config = {
  method: 'GET',
  credentials: 'include',
  headers: {
    Accept: 'text/html',
    'Content-Type': 'text/html',
    'Cache-Control': 'no-cache, no-store',
    Pragma: 'no-cache',
    'Accept-Encoding': 'gzip, deflate',
    'User-Agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1',
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
    const data: AuthContext['userInfo'] = {};
    const Node = parser(html);
    let cursor;

    cursor = querySelector(Node, 'profile_img');
    if (cursor) data.avatar = cursor.attrs!.src;

    cursor = querySelector(Node, 'nick_name info_value text');
    if (cursor) data.name = cursor.value!;

    cursor = querySelectorAll(Node, 'member_srl');
    if (cursor && cursor.length) {
      cursor = querySelector(cursor[1], 'info_value text');
      if (cursor) data.id = cursor.value!;
    }

    cursor = querySelector(Node, 'level info_value text');
    if (cursor) data.level = parseInt(cursor.value!, 10);

    cursor = querySelectorAll(Node, 'exp');
    if (cursor && cursor.length) {
      let cc = querySelector(cursor[0], 'info_value text');
      if (cc) data.expNow = cc.value!;

      cc = querySelector(cursor[1], 'info_value text');
      if (cc) data.expLeft = cc.value!;
    }

    cursor = querySelector(Node, 'attend info_value text');
    if (cursor) data.attends = parseInt(cursor.value!, 10);

    // cursor = querySelectorAll(Node, 'user_activity tr');
    // if (cursor && cursor.length) {
    //   let cc = querySelector(cursor[1], 'activity_value text');
    //   console.log(cc);
    // }

    return data;
  } catch (e) {
    throw new Error('로그인 정보 취득에 실패하였습니다.');
  }
}
