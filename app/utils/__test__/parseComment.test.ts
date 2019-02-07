import parser from '../parseComment';

describe('html parser', () => {
  it('no comment', () => {
    const html = `
    <div class="board_bottom">
    <div class="comment_container">
      <div class="comment_wrapper theme_default">
        <div class="comment_count_wrapper row">
          <div class="comment_count col col_2">
            <span class="comment_title">댓글</span>
            <span class="num_txt">
              <strong class="reply_count">0</strong>
            </span>
          </div>
        </div>
        <div class="comment_disable">
          <strong>
            <div class="text_center" onclick="app.go_login('댓글', event);">댓글은 로그인 후 이용 가능합니다.</div>
          </strong>
        </div>
      </div>
    </div>
    </div>
    `;
    const data = parser(html);
    expect(data).toHaveLength(0);
  });

  it('works', () => {
    const html = `
    <div class="board_bottom">
    <div class="comment_container">
      <div class="comment_wrapper theme_default">
        <div class="comment_count_wrapper row">
          <div class="comment_count col col_2">
            <span class="comment_title">댓글</span>
            <span class="num_txt">
              <strong class="reply_count">0</strong>
            </span>
          </div>
        </div>
        <div class="comment_disable">
        </div>
      </div>
      <div class="comment_count_wrapper row">
      <div class="comment_view best row">
      <table class="comment_table best">
      <tbody>
        <tr class="comment_element parent best first" id="ct_1111111">
          <td class="comment">
              <div class="text_wrapper">
                <span class="icon_best">BEST</span>
                <span class="text">덧글 내용 1</span>
              </div>
              <div class="user row">
                <div class="user_inner_wrapper">
                  <input type="hidden" class="member_srl" value="123456">
                  <strong class="nick">테스트 유저1</strong>
                  <span class="ip"> | 111.111.***.*** </span>
                  <span class="time"> | 19.01.31 19:12</span>
                </div>
              </div>
              <div class="row">
                <div class="r_col col_6">
                  <span class="control_box">
                    <button class="btn_dislike r_col col_4" value="1111111">
                      <span class="num">10</span>
                    </button>
                    <button class="btn_like r_col col_4" value="1111111">
                      <span class="num">34</span>
                    </button>
                    <button class="btn_report r_col col_4" value="1111111">신고</button>
                  </span>
                </div>
              </div>
            </td>
          </tr>
          <tr class="comment_element parent best" id="ct_111112">
            <td class="comment">
              <div class="text_wrapper">
                  <span class="icon_best">BEST</span>
                  <span class="text">덧글 내용 123</span>
              </div>
              <div class="user row">
                <div class="user_inner_wrapper">
                  <input type="hidden" class="member_srl" value="123457">
                  <strong class="nick">테스트유저 2</strong>
                  <span class="ip"> | 111.111.***.*** </span>
                  <span class="time"> | 19.01.31 19:19</span>
                </div>
              </div>
              <div class="row">
                <div class="r_col col_6">
                  <span class="control_box">
                    <button class="btn_dislike r_col col_4" value="111112">
                      <span class="num">4</span>
                    </button>
                    <button class="btn_like r_col col_4" value="111112">
                      <span class="num">30</span>
                    </button>
                    <button class="btn_report r_col col_4" value="111112">신고</button>
                  </span>
                </div>                
              </div>
            </td>
          </tr>
      </tbody>
      </table>
      </div>
      </div>
    </div>
    </div>
    `;
    const data = parser(html);
    expect(data).toHaveLength(2);
    expect(data[0]).toEqual({
      content: '덧글 내용 1',
      dislike: 10,
      key: 'ct_1111111',
      likes: 34,
      time: new Date('2019-01-31T19:12:00.000Z'),
      user: {
        id: '123456',
        ip: '111.111.***.***',
        name: '테스트 유저1'
      },
    });
  });
});
