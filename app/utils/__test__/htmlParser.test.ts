import fs from 'fs';
import { resolve } from 'path';
import parser from '../htmlParser';

describe('html parser', () => {
  it('works', () => {
    const html = '<body></body>';
    const data = parser(html);
  });
});
