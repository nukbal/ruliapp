import fs from 'fs';
import { resolve } from 'path';
import parser from '../parseBoard';

describe('parsing board', () => {
  it('works', () => {
    const html = fs.readFileSync(resolve(__dirname, './html/hit_sample.txt'), 'utf-8');
  
    const before = process.memoryUsage().heapUsed;
    const data = parser(html);

    console.log(((process.memoryUsage().heapUsed - before) / 1024).toFixed(0) + 'KB');
    console.log(data);
  });
});
