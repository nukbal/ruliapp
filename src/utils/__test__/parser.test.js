import fs from 'fs';
import { parseDetail, parseBoardList } from '../parser';

describe('[ util parser ] board', () => {
  it('', () => {
    const html = fs.readFileSync('./src/utils/__test__/html/hit_board.html', 'utf-8');
    const start = process.hrtime();
    const json = parseBoardList(html);
    const end = process.hrtime(start);
    const processTime = Math.round((end[0] * 1000) + (end[1] / 1000000));

    // 50ms이내에 처리를 끝낼것
    expect(processTime).toBeLessThan(50);

    expect(json.items).toHaveLength(30);

    expect(json.title).toEqual('BEST - 일반유머');
    expect(json.items[0]).toEqual({
      author: "팟타이꿍",
      boardId: "300143",
      comments: "36",
      id: "37050529",
      key: "best_300143_37050529",
      likes: "23",
      prefix: "best",
      times: "22:29",
      title: "넥슨, 넷마블 근황.jpg",
      views: "4977",
    });
  });
});

describe('[ util parser ] detail', () => {
  it('힛갤 1', () => {
    const html = fs.readFileSync('./src/utils/__test__/html/hit_sample.html', 'utf-8');
    const start = process.hrtime();
    const json = parseDetail(html);
    const end = process.hrtime(start);
    const processTime = Math.round((end[0] * 1000) + (end[1] / 1000000));

    // 50ms이내에 처리를 끝낼것
    expect(processTime).toBeLessThan(50);

    expect(json.commentList).toHaveLength(6);
    expect(json.bestCommentList).toHaveLength(4);

    delete json.commentList;
    delete json.bestCommentList;

    expect(json).toEqual({
      contents: [
        {
          content: 'image.png',
          key: '0_0',
          type: 'image',
        },
        {
          content: '즐겜러',
          key: '1_0',
          type: 'text',
        }
      ],
      comments: '6',
      likes: '46',
      dislikes: '0',
      title: '컨셉러',
      reference: null,
    });
  });

  it('힛갤 2', () => {
    const html = fs.readFileSync('./src/utils/__test__/html/hit_sample2.html', 'utf-8');
    const start = process.hrtime();
    const json = parseDetail(html);
    const end = process.hrtime(start);
    const processTime = Math.round((end[0] * 1000) + (end[1] / 1000000));

    // 50ms이내에 처리를 끝낼것
    expect(processTime).toBeLessThan(50);

    expect(json.commentList).toHaveLength(21);
    expect(json.bestCommentList).toHaveLength(5);

    delete json.commentList;
    delete json.bestCommentList;

    expect(json).toEqual({
      contents: [
        {
          content: 'image.png',
          key: '0_0',
          type: 'image',
        },
      ],
      comments: '21',
      likes: '71',
      dislikes: '2',
      title: '밀덕이라도 덕밍아웃을 조심해야하는 썰.',
      reference: null,
    });
  });

  it('삭제된 계시물', () => {
    const html = fs.readFileSync('./src/utils/__test__/html/delete_detail.html', 'utf-8');
    try {
      const json = parseDetail(html);
    } catch (e) {}
  });
});
