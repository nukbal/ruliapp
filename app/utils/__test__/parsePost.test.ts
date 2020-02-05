import parser from '../parsePost';

describe('html parser', () => {
  it('full pattern', () => {
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
						<p style="text-align: center;">
							<b>굵은 글씨 </b>
							<span style="font-size: 18px; font-family:" 맑은="" 고딕",="" "malgun="" gothic";"="">
								<b>
									<span style="font-size: 18px; color: #ff0000;">빨간 글씨</span>
								</b>
							</span>
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
			key: '',
      comments: [],
      contents: [
				{ type: 'reference', key: 'source', content: 'http://path/to/reference' },
        { type: 'text', key: '_0_0', content: 'paragraph 1 문장 2' },
				{ type: 'text', key: '_0_2', content: '문장 3-1 문장 3-2 ' },
				{ type: 'text', key: '_0_4', content: '문장 4 ' },
				{ type: 'image', key: '_0_5', content: 'https://path/to/image.jpg' },
				{ type: 'text', key: '_0_6', content: '이미지 설명문 추가 문장' },
				{ type: 'text', key: '_0_8', content: '굵은 글씨 빨간 글씨' },
      ],
			subject: 'test title',
			likes: 17,
			commentSize: 20,
			views: 6168,
      user: {
        experience: 68,
        id: '1076219',
        image: 'https://img.ruliweb.com/img/2016/icon/ruliweb_icon_144_144.png',
        level: 100,
        name: 'Post User',
      }
    });
	});

  it('pattern-1: reference only', () => {
    const html = `
    <title>test title | board name</title>
		<!-- board_main start -->
		<div class="board_main">
			<div class="board_main_top"></div>
      <div class="board_main_view">
        <div class="source_url">
          원본출처
          <span class="text_bar"> | </span>
          <a href="http://path/to/reference" target="_blank">http://path/to/reference</a>
        </div>
        <!-- ADOP SEO Tag S-->
				<div class="view_content">
					<div class="row">
            <p style="text-align: center;">&nbsp;</p>
            <p style="text-align: center;">.</p>
            <p style="text-align: center;">&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
					</div>
				</div>
			</div>
		</div><!-- board_main end -->
    `;
    const data = parser(html, '');
    expect(data).toEqual({
			key: '',
      comments: [],
      contents: [
				{ type: 'reference', key: 'source', content: 'http://path/to/reference' },
        { type: 'text', key: '_0_0', content: '.' },
      ],
      subject: 'test title',
      user: {}
    });
  });


  it('pattern-2: with gif animation', () => {
    const html = `
    <title>git animation test | board name</title>
    <!-- board_main start -->
		<div class="board_main">
			<div class="board_main_top"></div>
			<div class="board_main_view">
				<div class="view_content">
					<div class="row">
						<p style="text-align: center;">
              <span class="inline_block relative gifct">
                <video autoplay loop muted playsinline src="//i3.ruliweb.com/ori/19/03/28/169c279261e417ce4.mp4"></video>
                <span class="img_load_mp4 btn_light clickable col" data-link="//i3.ruliweb.com/ori/19/03/28/169c279261e417ce4.gif">GIF</span>
              </span>
            </p>
						<p>&nbsp;</p>
            <p>&nbsp;</p>
					</div>
				</div>
        <div class="row">
					<div class="view_bottom">
						<div class="like_wrapper">
							<div class="like">
								<span class="like_value">23</span>
							</div>
              <div class="dislike">
								<span class="dislike_value">0</span>
							</div>
            </div>
					</div>
				</div>
			</div>
		</div><!-- board_main end -->
    `;
    const data = parser(html, '');
    expect(data).toEqual({
			key: '',
      comments: [],
      contents: [
        { type: 'video', key: '_0_0', content: 'https://i3.ruliweb.com/ori/19/03/28/169c279261e417ce4.mp4' },
      ],
      subject: 'git animation test',
			likes: 23,
			dislikes: 0,
      user: {}
    });
	})
	
	it('pattern-3: multiple images on single paragraph', () => {
		const html = `
		<title>test | ruliapp</title>
		<!-- board_main start -->
		<div class="board_main_top"></div>
		<div class="board_main_view">
			<div class="view_content">
				<div class="row">
					<p></p>
					<p style="text-align: center;">
						<a href="http://image/path/1"><img src="http://image/path/1" /></a>
						<br /><br />
						<a href="http://image/path/2"><img src="http://image/path/2" /></a>
						<br />
						<a href="http://image/path/3"><img src="http://image/path/3" /></a>
						<a href="http://image/path/4"><img src="http://image/path/4" /></a>
						<a href="http://image/path/5"><img src="http://image/path/5" /></a>
					</p>
					<p>&nbsp;</p>
					<p>&nbsp;</p>
				</div>
			</div>
		</div>
		<!-- board_main end -->
		`;
    const data = parser(html, '');
    expect(data).toEqual({
			key: '',
      comments: [],
      contents: [
        { type: 'image', key: '_0_0', content: 'http://image/path/1' },
        { type: 'image', key: '_0_1', content: 'http://image/path/2' },
        { type: 'image', key: '_0_2', content: 'http://image/path/3' },
        { type: 'image', key: '_0_3', content: 'http://image/path/4' },
        { type: 'image', key: '_0_4', content: 'http://image/path/5' },
			],
      subject: 'test',
      user: {},
    });
	})
	
	it('pattern-4: content with WYSIWYG editor (se?)', () => {
		const html = `
		<title>test | ruliapp</title>
		<!-- board_main start -->
		<div class="board_main_top"></div>
		<div class="board_main_view">
			<div class="view_content">
				<div class="row">
					<div>
						<p><img src="http://image/path" alt="" /></p>
						<p></p>
						<div class="se_component se_paragraph default">
							<div class="se_sectionArea">
								<div class="se_editArea">
									<div class="se_viewArea">
										<div class="se_editView">
											<div class="se_textView">
												<p class="se_textarea">
													some text!
													<br>
													additional text!
													<br>
													<span lang="EN-US">(</span>
													日本語
													<span lang="EN-US">)</span>
													<br>
													with some
													<span lang="JP">にほん</span>
													<span>&nbsp;</span>
												</p>
											</div>
										</div>
									</div>
								</div>
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
			key: '',
      comments: [],
      contents: [
        { type: 'image', key: '_0_0', content: 'http://image/path' },
        { type: 'text', key: '_0_1', content: 'some text!' },
				{ type: 'text', key: '_0_2', content: 'additional text!' },
				{ type: 'text', key: '_0_3', content: '(日本語)' },
				{ type: 'text', key: '_0_4', content: 'with someにほん' },
			],
      subject: 'test',
      user: {},
    });
	});

	it('pattern-5: merging line breaks', () => {
		const html = `
			<title>test | ruliapp</title>
			<!-- board_main start -->
			<div class="board_main_top"></div>
			<div class="board_main_view">
				<div class="view_content">
					<div class="row">
						<div>
							<p style="text-align: center;">
								<a class="img_load_m">
									<img class="lazy_read" src="//image/path">
								</a>
							</p>
							<p style="text-align: center;">&nbsp;</p>
							<h1 style="text-align: center;">
								text
								with
								line-break
							</h1>
						</div>
						<br>
					</div>
				</div>
			</div>
			<!-- board_main end -->
		`;
    const data = parser(html, '');
    expect(data).toEqual({
			key: '',
      comments: [],
      contents: [
        { type: 'image', key: '_0_0', content: 'https://image/path' },
        { type: 'text', key: '_0_1', content: 'text with line-break' },
			],
      subject: 'test',
      user: {},
    });
	});

	it('pattern-6: line breaks with br tag', () => {
		const html = `
			<title>test | ruliapp</title>
			<!-- board_main start -->
			<div class="board_main_top"></div>
			<div class="board_main_view">
				<div class="view_content">
					<div class="row">
						<div>
							<p style="text-align: center;">
								<a class="img_load_m">
									<img class="lazy_read" src="//image/path">
								</a>
							</p>
							<p style="text-align: center;">&nbsp;</p>
							<h1 style="text-align: center;">
								text<br>
								with<br>
								line-break
							</h1>
						</div>
						<br>
					</div>
				</div>
			</div>
			<!-- board_main end -->
		`;
    const data = parser(html, '');
    expect(data).toEqual({
			key: '',
      comments: [],
      contents: [
        { type: 'image', key: '_0_0', content: 'https://image/path' },
        { type: 'text', key: '_0_1', content: 'text\nwith\nline-break' },
			],
      subject: 'test',
      user: {},
    });
	});

	it('pattern-7: with a tag link', () => {
		const html = `
			<title>test | ruliapp</title>
			<!-- board_main start -->
			<div class="board_main_top"></div>
			<div class="board_main_view">
				<div class="view_content">
					<div class="row">
						<div>
							<p style="text-align: center;">
								<a class="img_load_m">
									<img class="lazy_read" src="//image/path">
								</a>
							</p>
              <p style="text-align: center;">&nbsp;</p>
              <a href="https://link/path">https://link/path</a>
						</div>
						<br>
					</div>
				</div>
			</div>
			<!-- board_main end -->
		`;
    const data = parser(html, '');
    expect(data).toEqual({
			key: '',
      comments: [],
      contents: [
        { type: 'image', key: '_0_0', content: 'https://image/path' },
        { type: 'link', key: '_0_1', content: 'https://link/path' },
			],
      subject: 'test',
      user: {},
    });
	});

	it('pattern-8: bottom tag is in the view_content', () => {
		const html = `
		<title>test | ruliapp</title>
<!-- board_main start -->
<div class="board_main_top"></div>
<div class="board_main_view">
  <div class="view_content">
    <div class="row">
      <div>
        <p style="text-align: center;">
          <embed src="https://twitter.com/i/videos/tweet/1217008470907445249"
            frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen autostart="0" autoplay="0">
          <br>
        </p>
        <p style="text-align: center;">
          <span>some test</span>
        </p>
      </div>
      <br>
    </div>
  </div>
			<div class="board_main_bottom">
				<div class="row">
					<div class="share_wrapper row">
						<ul>
							<li class="col">
								<div class="sns_desc">share</div>
							</li>
							<li class="col">
								<div class="sns_desc">url copy</div>
							</li>
							<li class="col">
								<div class="sns_desc">facebook</div>
							</li>
							<li class="col">
								<div class="sns_desc">twitter</div>
								</a>
							</li>
							<li class="col">
								<div class="sns_desc">naver</div>
							</li>
							<li class="col">
								<div class="sns_desc">kakao</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div><!-- board_main end --> 
		`;
    const data = parser(html, '');
    expect(data).toEqual({
			key: '',
      comments: [],
      contents: [
        { type: 'text', key: '_0_0', content: 'some test' },
			],
      subject: 'test',
      user: {},
    });
	})
});
