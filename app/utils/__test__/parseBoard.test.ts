import parser, { parseBoardUrl } from '../parseBoard';
import MockDate from 'mockdate';

describe('parsing board', () => {

	beforeEach(MockDate.reset);

	describe('parseBoardUrl', () => {
		it('parse post url', () => {
			expect(parseBoardUrl('http://m.ruliweb.com/news/board/1004/read/2144237'))
				.toEqual({ id: '2144237', url: 'news/board/1004/read/2144237' });
		});
		it('parse post url with params', () => {
			expect(parseBoardUrl('http://m.ruliweb.com/news/board/1004/read/2144237?cate=1234'))
				.toEqual({ id: '2144237', url: 'news/board/1004/read/2144237' });
		});
		it('main news', () => {
			expect(parseBoardUrl('https://m.ruliweb.com/news/read/126289'))
				.toEqual({ id: '126289', url: 'news/read/126289' });
		})
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
									   href="https://m.ruliweb.com/best/board/300143/read/41712118">테스트 제목 123</a>
									<span class="num_reply"> (<span
												class="num">10</span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									유저테스트      								</span>
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
									   href="https://m.ruliweb.com/best/board/300143/read/41712112">테스트 제목입니다.</a>
									<span class="num_reply"> (<span
												class="num"></span>)</span>																	</div>
								<div class="info row">
									<a class="board_name"
									   href="https://m.ruliweb.com/best/board/300143">[유머 게시판]</a>
									<span class="writer text_over">
      									테스트유저 123      								</span>
									<span class="text_bar"> | </span>
									<span class="recomd">
                    					추천 7                  					</span>
									<span class="text_bar"> | </span>
									<span class="hit">
										조회 990                  					</span>
									<span class="text_bar"> | </span>
									<span class="time">
										날짜 12:23									</span>
								</div>
							</td>
						</tr>
									</tbody>
			</table>
		</div><!-- board_main end -->
    `;
    MockDate.set(Date.UTC(2018, 9, 11));
    const data = parser(html);
    expect(data).toEqual({
		 title: 'test board',
		 notices: [],
		 rows: [
			{
				key: '41712118',
				subject: '테스트 제목 123',
				likes: 14,
				commentSize: 10,
				views: 2870,
				date: '2018-10-11T06:23:00.000Z',
				url: 'best/board/300143/read/41712118',
				user: { name: '유저테스트' },
			},
			{
				key: '41712112',
				subject: '테스트 제목입니다.',
				likes: 7,
				views: 990,
				date: '2018-10-11T03:23:00.000Z',
				url: 'best/board/300143/read/41712112',
				user: { name: '테스트유저 123' },
			},
		 ],
	 });
  })
});
