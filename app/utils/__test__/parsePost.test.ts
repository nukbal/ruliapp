import fs from 'fs';
import { resolve } from 'path';
import parser from '../parsePost';

describe('html parser', () => {
  it('works', () => {
    const html = fs.readFileSync(resolve(__dirname, './html/wow_post.txt'), 'utf-8');
    const data = parser(html);

    console.log(JSON.stringify(data));
  });
});
