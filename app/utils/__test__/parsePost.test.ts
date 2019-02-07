import parser from '../parsePost';

describe('html parser', () => {
  it('reference only', () => {
    const html = `
    <title>test title | board name</title>
    <!-- board_main start -->
      <div class="board_main">
        <div class="board_main_top">
          <div class="user_view">
            <div class="row">
              <input type="hidden" class="article_id" value="2152642">
              <input type="hidden" class="article_url" value="http://m.ruliweb.com/news/board/1004/read/2152642">
              <input type="hidden" class="bbs_url" value="http://m.ruliweb.com/news/board/1004">
              <input id="reply_count" type="hidden" value="20">
              <h4 class="subject">
                <strong><span class="subject_text text_large">test title</span></strong>
              </h4>
            </div>
            <div class="row">
              <div class="col">
                <div class="user_info">
                  <div class="profile_img_m_wrapper">
                    <img id="profile_img_m" class="profile_img_m" width="75" height="75" alt="profile_img_m" src="https://img.ruliweb.com/img/2016/icon/ruliweb_icon_144_144.png">
                  </div>
                  <div class="info_wrapper">
                    <div class="row">
                      <a class="nick" href="http://m.ruliweb.com/news/board/1004?search_type=member_srl&amp;search_key=1076219" tabindex="-1">
                        <strong>Post User</strong>
                        <input type="hidden" id="member_srl" value="1076219">
                      </a>
                      <span class="text_bar"> | </span>
                      <span>
                        추천
                        <span class="like">17</span>
                        <span class="text_bar"> | </span>
                        조회 6168
                      </span>
                      <span>
                        일시 <span class="regdate">2019.01.31 (19:05:25)</span>
                        <span class="text_bar"> | </span>
                        <span>IP : 61.78.***.***</span>
                      </span>
                    </div>
                    <div class="row">
                      <a class="text_gray" href="http://m.ruliweb.com/news/board/1004?search_type=member_srl&amp;search_key=1076219" tabindex="-1"><strong>작성글</strong></a>
                      <span class="text_bar"> | </span>
                      <a class="text_gray" href="javascript:void(0);" onclick="app.open_message(1076219);"><strong>쪽지</strong></a>
                      <span>출석 2796일</span>
                      <span class="text_bar"> | </span>
                      <span class="level">&nbsp;LV. <strong>100</strong>&nbsp;</span>
                      <span class="text_bar"> | </span>
                      <span>
                        Exp. <span class="exp_text"><strong>68%</strong></span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="board_main_view">
          <div class="source_url">원본출처<span class="text_bar"> | </span><a href="http://path/to/reference" target="_blank">http://path/to/reference</a></div>
          <div class="view_content">
            <div class="row">
              <p>.</p>
            </div>
          </div>
          <div class="row">
            <div class="view_bottom">
              <div class="like_wrapper">
                <div class="like">
                  <br>
                  <span class="like_value">17</span>
                  <i class="icon icon-thumbs-up-alt"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <!-- board_main end -->
    `;
    const data = parser(html, '');
    expect(data).toEqual({
      comments: [],
      contents: [
        { type: 'text', key: '_0_0', order: 0, content: '.' },
      ],
      source: 'http://path/to/reference',
      subject: 'test title',
      user: {
        experience: 68,
        id: '1076219',
        image: 'https://img.ruliweb.com/img/2016/icon/ruliweb_icon_144_144.png',
        level: 100,
        name: 'Post User',
      }
    });
  });

  it('normal pattern', () => {
    const html = `
    <title>test title | board name</title>
    <!-- board_main start -->
      <div class="board_main">
        <div class="board_main_top">
          <div class="user_view">
            <div class="row">
              <input type="hidden" class="article_id" value="2152642">
              <input type="hidden" class="article_url" value="http://m.ruliweb.com/news/board/1004/read/2152642">
              <input type="hidden" class="bbs_url" value="http://m.ruliweb.com/news/board/1004">
              <input id="reply_count" type="hidden" value="20">
              <h4 class="subject">
                <strong><span class="subject_text text_large">test title</span></strong>
              </h4>
            </div>
            <div class="row">
              <div class="col">
                <div class="user_info">
                  <div class="profile_img_m_wrapper">
                    <img id="profile_img_m" class="profile_img_m" width="75" height="75" alt="profile_img_m" src="https://img.ruliweb.com/img/2016/icon/ruliweb_icon_144_144.png">
                  </div>
                  <div class="info_wrapper">
                    <div class="row">
                      <a class="nick" href="http://m.ruliweb.com/news/board/1004?search_type=member_srl&amp;search_key=1076219" tabindex="-1">
                        <strong>Post User</strong>
                        <input type="hidden" id="member_srl" value="1076219">
                      </a>
                      <span class="text_bar"> | </span>
                      <span>
                        추천
                        <span class="like">17</span>
                        <span class="text_bar"> | </span>
                        조회 6168
                      </span>
                      <span>
                        일시 <span class="regdate">2019.01.31 (19:05:25)</span>
                        <span class="text_bar"> | </span>
                        <span>IP : 61.78.***.***</span>
                      </span>
                    </div>
                    <div class="row">
                      <a class="text_gray" href="http://m.ruliweb.com/news/board/1004?search_type=member_srl&amp;search_key=1076219" tabindex="-1"><strong>작성글</strong></a>
                      <span class="text_bar"> | </span>
                      <a class="text_gray" href="javascript:void(0);" onclick="app.open_message(1076219);"><strong>쪽지</strong></a>
                      <span>출석 2796일</span>
                      <span class="text_bar"> | </span>
                      <span class="level">&nbsp;LV. <strong>100</strong>&nbsp;</span>
                      <span class="text_bar"> | </span>
                      <span>
                        Exp. <span class="exp_text"><strong>68%</strong></span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="board_main_view">
          <div class="source_url">원본출처<span class="text_bar"> | </span><a href="http://path/to/reference" target="_blank">http://path/to/reference</a></div>
          <div class="view_content">
					<div class="row">
						<p style="text-size-adjust: none; box-sizing: border-box; margin-bottom: 5px; line-" noto="" sans="" kr",="" 나눔고딕,="" "nanum="" gothic",="" "malgun="" 맑은고딕,="" 굴림,="" 돋움,="" dotum,="" sans-serif;="" font-size:="" 14px;="" background-color:="" #ffffff;"="">paragraph 1</p>
            <p style="text-size-adjust: none; box-sizing: border-box; margin-bottom: 5px; line-" noto="" sans="" kr",="" 나눔고딕,="" "nanum="" gothic",="" "malgun="" 맑은고딕,="" 굴림,="" 돋움,="" dotum,="" sans-serif;="" font-size:="" 14px;="" background-color:="" #ffffff;"=""><br style="text-size-adjust: none; box-sizing: border-box;"></p>
            <p style="text-size-adjust: none; box-sizing: border-box; margin-bottom: 5px; line-" noto="" sans="" kr",="" 나눔고딕,="" "nanum="" gothic",="" "malgun="" 맑은고딕,="" 굴림,="" 돋움,="" dotum,="" sans-serif;="" font-size:="" 14px;="" background-color:="" #ffffff;"="">문장 2</p>
            <p style="text-size-adjust: none; box-sizing: border-box; margin-bottom: 5px; line-" noto="" sans="" kr",="" 나눔고딕,="" "nanum="" gothic",="" "malgun="" 맑은고딕,="" 굴림,="" 돋움,="" dotum,="" sans-serif;="" font-size:="" 14px;="" background-color:="" #ffffff;"="">
              <br style="text-size-adjust: none; box-sizing: border-box;">
              문장 3-1
              <br style="text-size-adjust: none; box-sizing: border-box;">
              <br style="text-size-adjust: none; box-sizing: border-box;">
              문장 3-2&nbsp;
            </p>
            <p style="text-size-adjust: none; box-sizing: border-box; margin-bottom: 5px; line-" noto="" sans="" kr",="" 나눔고딕,="" "nanum="" gothic",="" "malgun="" 맑은고딕,="" 굴림,="" 돋움,="" dotum,="" sans-serif;="" font-size:="" 14px;="" background-color:="" #ffffff;"="">
              문장 4&nbsp;
            </p>
            <p style="text-size-adjust: none; box-sizing: border-box; line-" noto="" sans="" kr",="" 나눔고딕,="" "nanum="" gothic",="" "malgun="" 맑은고딕,="" 굴림,="" 돋움,="" dotum,="" sans-serif;="" font-size:="" 14px;="" background-color:="" #ffffff;"="">
              <img alt="" src="https://path/to/image.jpg" class="fr-fic fr-dii" style="text-size-adjust: none; box-sizing: border-box; border-radius: 2px; position: relative; max-">
              <br style="text-size-adjust: none; box-sizing: border-box;">
              이미지 설명문
              <br style="text-size-adjust: none; box-sizing: border-box;">
              <br style="text-size-adjust: none; box-sizing: border-box;">
              추가 문장
            </p>
					</div>
				</div>
          <div class="row">
            <div class="view_bottom">
              <div class="like_wrapper">
                <div class="like">
                  <br>
                  <span class="like_value">17</span>
                  <i class="icon icon-thumbs-up-alt"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <!-- board_main end -->
    `;
    const data = parser(html, '');
    expect(data).toEqual({
      comments: [],
      contents: [
        { type: 'text', key: '_0_0', order: 0, content: 'paragraph 1' },
        { type: 'text', key: '_2_0', order: 1, content: '문장 2' },
        { type: 'text', key: '_3_0', order: 2, content: '문장 3-1' },
        { type: 'text', key: '_3_1', order: 3, content: '문장 3-2 ' },
        { type: 'text', key: '_4_0', order: 4, content: '문장 4 ' },
        { type: 'image', key: '_5_0', order: 5, content: 'https://path/to/image.jpg' },
        { type: 'text', key: '_5_1', order: 6, content: '이미지 설명문' },
        { type: 'text', key: '_5_2', order: 7, content: '추가 문장' },
      ],
      source: 'http://path/to/reference',
      subject: 'test title',
      user: {
        experience: 68,
        id: '1076219',
        image: 'https://img.ruliweb.com/img/2016/icon/ruliweb_icon_144_144.png',
        level: 100,
        name: 'Post User',
      }
    });
  });
});
