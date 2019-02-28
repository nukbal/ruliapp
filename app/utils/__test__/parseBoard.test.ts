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
});
