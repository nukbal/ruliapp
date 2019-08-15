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
          <tr class="comment_element normal child" id="ct_999999">
            <td class="is_child">
					    <i class="icon_reply icon-mail-reply icon-rotate-180"></i>
				    </td>
				<td class="comment">
				  <div class="text_wrapper">
					  <span class="p_nick">테스트유저 2</span>
							<br>
							<span class="text">비추 덧덧글 테스트....
줄바꿈 테스트</span>
					</div>

					<div class="user row">
						<div class="user_inner_wrapper">
							<input type="hidden" class="member_srl" value="123458">
							<strong class="nick">테스트유저3</strong>
              <span class="ip"> | 111.111.***.*** </span>
              <span class="time"> | 19.01.31 20:02</span>
						</div>
					</div>
					<div class="control row">
						<div class="col col_4">
              <button class="btn_reply" value="999999">
                <i class="icon-level-up icon-rotate-90"></i> 답글
              </button>
            </div>
            <div class="col col_8">
          		<span class="control_box">
                <button class="btn_dislike r_col col_4" value="999999">
                  <i class="icon icon-thumbs-down-alt"></i>
                  <span class="num">10</span>
                </button>
                <button class="btn_like r_col col_4" value="999999">
                  <i class="icon icon-thumbs-up-alt"></i>
                  <span class="num">1</span>
                </button>
                <button class="btn_report r_col col_4" value="999999">신고</button>
              </span>
						</div>
					</div>
				</td>
      </tr>
      <tr class="comment_element normal parent">
          <td class="comment" colspan="2">
              <div class="text_wrapper">
                  <br>
                  <span style="color: #aaa;">삭제된 댓글입니다.</span>
                  <br><br>
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
    expect(data).toHaveLength(4);
    expect(data[0]).toEqual({
      content: '덧글 내용 1',
      dislike: 10,
      key: 'ct_1111111',
      likes: 34,
      time: new Date('2019-01-31T10:12:00.000Z'),
      user: {
        id: '123456',
        ip: '111.111.***.***',
        name: '테스트 유저1'
      },
    });
    expect(data[2]).toEqual({
      content: '비추 덧덧글 테스트....\n줄바꿈 테스트',
      dislike: 10,
      key: 'ct_999999',
      child: 'ct_111112',
      reply: '테스트유저 2',
      likes: 1,
      time: new Date('2019-01-31T11:02:00.000Z'),
      user: {
        id: '123458',
        ip: '111.111.***.***',
        name: '테스트유저3'
      },
    });
    expect(data[3]).toEqual({
      key: 'comment_element',
      isDeleted: true,
      content: '',
      likes: 0,
      dislike: 0,
      user: {
        id: '',
        name: ''
      },
    });
  });

  it('with video', () => {
    const html = `
      <div class="board_bottom">
      <div class="comment_container">
        <div class="comment_wrapper theme_default">
          <div class="comment_count_wrapper row">
            <table class="comment_table">
              <tbody>
              <tr class="comment_element normal parent" id="ct_123123">
								<td class="comment" colspan="2">
                  <div class="text_wrapper">
                    <span class="inline_block relative gifct">
                      <video autoplay="" loop="" muted="" playsinline="" src="//i2.ruliweb.com/cmt/17/09/28/123123123.mp4"></video>
                    </span>
									  <span class="text">덧글 내용123</span>
					        </div>
                  <div class="user row">
                    <div class="user_inner_wrapper">
                      <input type="hidden" class="member_srl" value="999999">
                      <strong class="nick">유저</strong>
                      <span class="ip"> | 111.222.***.*** </span>
                      <span class="time"> | 19.08.15 15:27</span>
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
    expect(data).toEqual([
      {
        key: 'ct_123123',
        time: new Date('2019-08-15T06:27:00.000Z'),
        content: '덧글 내용123',
        image: 'https://i2.ruliweb.com/cmt/17/09/28/123123123.mp4',
        likes: 0,
        dislike: 0,
        user: {
          id: '999999',
          name: '유저',
          ip: '111.222.***.***',
        },
      }
    ]);
  })
});
