import parser, { parseBoardUrl } from '../parseBoard';

describe('parsing board', () => {
  it('parse url', () => {
    expect(parseBoardUrl('http://m.ruliweb.com/family/4526/board/109995'))
      .toEqual({ id: 'family/4526/board/109995', url: 'family/4526/board/109995' });

    expect(parseBoardUrl('http://m.ruliweb.com/news/board/300009/list?&cate=118'))
      .toEqual({ id: 'news/board/300009', url: 'news/board/300009/list', params: { cate: '118' } });

    expect(parseBoardUrl('http://m.ruliweb.com/news/board/1004/read/2144237?'))
      .toEqual({ id: '2144237', url: 'news/board/1004/read/2144237', params: {} });

    expect(parseBoardUrl('http://m.ruliweb.com/news/board/1004/read/2144237'))
        .toEqual({ id: '2144237', url: 'news/board/1004/read/2144237' });
  });

  it('parse board - best', () => {
    const html = `
    <title>test board | test</title>
		<!-- board_main start -->
		<div class="board_main theme_default">
			<table class="board_list_table">
				<tbody>
										<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41712118">실존하는 살인 식물.JPG</a>
									<span class="num_reply"> (<span
												class="num">10</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									아키로프      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 14                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 2870                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 15:23									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41712112">사기당한 친구 명치 존나쌔게 후리기.JPG</a>
									<span class="num_reply"> (<span
												class="num">8</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									아키로프      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 7                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 990                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 15:23									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41712076">CGV 만우절 한정 콤보</a>
									<span class="num_reply"> (<span
												class="num">53</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									340456694      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 43                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 7129                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 15:19									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41712027">걸즈판처 _ 걸장판의 안치오</a>
									<span class="num_reply"> (<span
												class="num">13</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									토네르      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 17                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 3084                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 15:14									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41712012">심판자 "폴 스미스".jpg</a>
									<span class="num_reply"> (<span
												class="num">3</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									스라푸스      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 14                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 1275                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 15:13									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711994">탄산 먹은 고양이</a>
									<span class="num_reply"> (<span
												class="num">27</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									빵하나우유      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 38                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 8930                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 15:11									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711954">오버워치 디바 누나</a>
									<span class="num_reply"> (<span
												class="num">37</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									대단한놈      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 32                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 8519                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 15:08									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711951">운전 중에 발작을 일으킨 버스 기사.gif</a>
									<span class="num_reply"> (<span
												class="num">7</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									人生無想      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 6                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 675                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 15:08									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711930">골목식당 촬영 종료 당일 충무김밥집</a>
									<span class="num_reply"> (<span
												class="num">32</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									상류중류하류      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 71                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 13258                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 15:05									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711907">후방주의) 빈유 성애자들만 들어와라 .jpg</a>
									<span class="num_reply"> (<span
												class="num">11</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									수비범위는 9세부터12세까지      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 23                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 1891                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 15:04									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711895">신개념 휴지통.jpg</a>
									<span class="num_reply"> (<span
												class="num">51</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									Brit Marling      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 22                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 9365                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 15:03									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711881">[소녀전선] 4월 총기 매~/갈 그리는 연필센세</a>
									<span class="num_reply"> (<span
												class="num">36</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									뷀레레라럴      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 39                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 6242                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 15:01									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711854">닭수영.gif</a>
									<span class="num_reply"> (<span
												class="num">7</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									人生無想      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 16                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 2744                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 14:58									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711830">??? : 몸무게 40키로대 있어?</a>
									<span class="num_reply"> (<span
												class="num">30</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									빠꼬      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 74                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 14532                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 14:56									</span>
								</div>
							</td>
						</tr>
												<!-- <tr>
							<td class="ad_wrapper row">
															</td>
						<tr> -->
													<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711823">흔한 종교차별</a>
									<span class="num_reply"> (<span
												class="num">22</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									금손만되자      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 30                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 9579                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 14:55									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711822">대학생들이 보면 좋아죽는 짤</a>
									<span class="num_reply"> (<span
												class="num">15</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									니들출근길따라간다      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 82                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 10585                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 14:55									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711801">견종에 따른 개짖는 소리</a>
									<span class="num_reply"> (<span
												class="num">10</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									메컷메컷      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 45                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 8086                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 14:53									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711794">겁쟁이가 공포영화 보는 방법</a>
									<span class="num_reply"> (<span
												class="num">16</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									꾸에에에에엑      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 60                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 15614                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 14:52									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711792">구독자 70만명인데 수익창출 지금까지 단한번도 안한 유튜버</a>
									<span class="num_reply"> (<span
												class="num">5</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									개드립      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 13                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 1369                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 14:52									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711781">이게 군대냐?.jpg</a>
									<span class="num_reply"> (<span
												class="num">33</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									루리웹-0198862772      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 69                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 9887                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 14:50									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711729">햄버거 한입에 먹기.gif</a>
									<span class="num_reply"> (<span
												class="num">21</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									큐로비트      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 47                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 14334                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 14:45									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711727">AMD 미소녀 마우스패드 이벤트.jpg</a>
									<span class="num_reply"> (<span
												class="num">49</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									가즈아아아아아      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 67                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 12685                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 14:45									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711719">대륙의 명필가</a>
									<span class="num_reply"> (<span
												class="num">61</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									꾸에에에에엑      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 49                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 17679                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 14:44									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711709">제대로 빡친 손흥민</a>
									<span class="num_reply"> (<span
												class="num">63</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									피파광      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 47                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 16416                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 14:43									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711704">요즘 AMD 이벤트 근황.jpg</a>
									<span class="num_reply"> (<span
												class="num">27</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									태양별왕자      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 32                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 11047                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 14:43									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711700">한국어 패치 잘못한 외국인 .jyp</a>
									<span class="num_reply"> (<span
												class="num">48</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									Fluttershy♡四月一日      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 68                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 11170                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 14:43									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711695">낙뢰를 맞는 비행기 날개.gif</a>
									<span class="num_reply"> (<span
												class="num">31</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									Brit Marling      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 35                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 12346                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 14:41									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711690">장애인 주차자리 불법주차 신고했더니</a>
									<span class="num_reply"> (<span
												class="num">39</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									황달너무조아      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 75                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 11579                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 14:41									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711665">매일 50억씩 쓰는 사람</a>
									<span class="num_reply"> (<span
												class="num">27</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									다림      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 46                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 12522                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 14:39									</span>
								</div>
							</td>
						</tr>
											<tr class="table_body">

							<td class="subject">
								<div class="title row">
									<a class="subject_link deco"
									   href="https://m.ruliweb.com/best/board/300143/read/41711656">총이라니 미개한놈들</a>
									<span class="num_reply"> (<span
												class="num">46</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									식봉이　      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 53                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 9099                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 14:37									</span>
								</div>
							</td>
						</tr>
									</tbody>
			</table>
		</div><!-- board_main end -->
    `;
    const data = parser(html, '');
    expect(data).toEqual({
		 title: 'test board',
		 notices: [],
		 rows: [],
	 });
  })
});
