import fs from 'fs';
import { resolve } from 'path';
import parser from '../parsePost';

describe('html parser', () => {
  it('works', () => {
    const html = fs.readFileSync(resolve(__dirname, './html/hit_sample'), 'utf-8');
    const data = parser(html, '');
  });
});
