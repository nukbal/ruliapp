import parser, { parseBoardUrl } from '../parseBoard';

describe('parsing board', () => {
  it('parse url', () => {
    expect(parseBoardUrl('/family/4526/board/109995'))
      .toEqual({ id: 'family/4526/board/109995', url: 'family/4526/board/109995' });

    expect(parseBoardUrl('http://m.ruliweb.com/news/board/300009/list?&cate=118'))
      .toEqual({ id: 'news/board/300009', url: 'news/board/300009', param: { cate: '118' } });

    expect(parseBoardUrl('http://m.ruliweb.com/news/board/1004/read/2144237?'))
      .toEqual({ prefix: 'news', boardId: '1004', id: '2144237', key: 'news_1004_2144237' });

      expect(parseBoardUrl('http://m.ruliweb.com/news/board/1004/read/2144237'))
        .toEqual({ prefix: 'news', boardId: '1004', id: '2144237', key: 'news_1004_2144237' });
  });

  it('works', () => {
    const html = `
    
    `;
  
    const data = parser(html, '');

    // console.log(data);
  });
});
