import fs from 'fs';
import { parseDetail } from '../parser';

describe('[ util parser ]', () => {
  it('힛갤 내용 적은것', () => {
    const html = fs.readFileSync('./src/utils/__test__/hit_sample.html', 'utf-8');
    const start = process.hrtime();
    const json = parseDetail(html);
    const end = process.hrtime(start);

    expect(end[0] - start[0]).toBeLessThan(1);
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
