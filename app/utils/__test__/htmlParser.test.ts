import fs from 'fs';
import { resolve } from 'path';
import parser from '../htmlParser';

describe('html parser', () => {
  it('iframe src', () => {
    const html = `<iframe src="https://sample.object.url"></iframe>`;
    const data = parser(html);
    expect(data).toEqual({
      childNodes: [{
        attrs: {
          src: 'https://sample.object.url',
        },
        childNodes: [],
        q: '',
        tagName: 'iframe',
      }],
      q: '',
      tagName: '',
    });
  });
});
