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
    // expect(processTime).toBeLessThan(50);

    expect(json.items).toHaveLength(30);

    expect(json).toEqual({
      title: 'BEST - 일반유머',
    });
  });
});

describe('[ util parser ] detail', () => {
  it('힛갤 내용 적은것', () => {
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
          key: '1_1',
          type: 'image',
        },
        {
          content: '즐겜러',
          key: '3_0',
          type: 'text',
        }
      ],
      comments: '6',
      likes: '46',
      dislikes: '0',
      title: '컨셉러',
      reference: undefined,
    });
  });
});
