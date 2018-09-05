import fs from 'fs';
import { resolve } from 'path';
import parser from '../parseComment';

describe('html parser', () => {
  it('works', () => {
    const html = fs.readFileSync(resolve(__dirname, './html/hit_comment.txt'), 'utf-8');
    const data = parser(html);

    console.log(data);
  });
});