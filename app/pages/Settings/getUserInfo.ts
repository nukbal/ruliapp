import parser, { querySelector } from '../../utils/htmlParser';

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

    const Node = parser(html);
    const name = querySelector(Node, '.profile_img');
    console.log(name);

    return {};
  } catch (e) {
    throw new Error('로그인 정보 취득에 실패하였습니다.');
  }
}
