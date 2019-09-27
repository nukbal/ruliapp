import parser, { querySelector, querySelectorAll } from '../htmlParser';

describe('html parser', () => {
  it('iframe src', () => {
    const html = `<iframe src="https://sample.object.url"></iframe>`;
    expect(parser(html)).toMatchObject({
      tagName: 'root',
      childNodes: [{
        tagName: 'iframe',
        attrs: { src: 'https://sample.object.url' },
        childNodes: [],
      }],
    });
  });

  it('parse simple structure', () => {
    const html = `<ul id="list"><li>Hello World</li></ul>`;
    expect(parser(html)).toMatchObject({
      tagName: 'root',
      childNodes: [{
        tagName: 'ul',
        attrs: { id: 'list' },
        childNodes: [{
          tagName: 'li',
          childNodes: [{ tagName: 'text', childNodes: [], value: 'Hello World' }],
        }],
      }],
    });
  });

  it('parse array', () => {
    const html = `
      <ul id="list">
        <li>Hello World</li>
        <li>Hello World1</li>
        <li>Hello World2</li>
      </ul>`;
    const elem = parser(html);
    expect(elem).toMatchObject({
      tagName: 'root',
      childNodes: [{
        tagName: 'ul',
        attrs: { id: 'list' },
      }],
    });
    expect(elem.childNodes[0].childNodes).toHaveLength(3);
    expect(elem.childNodes[0].childNodes[0].childNodes[0].value).toEqual('Hello World');
    expect(elem.childNodes[0].childNodes[1].childNodes[0].value).toEqual('Hello World1');
    expect(elem.childNodes[0].childNodes[2].childNodes[0].value).toEqual('Hello World2');
  })

  it('querySelector, simple query', () => {
    expect(
      querySelector(parser(`<ul id="list"><li>Hello World</li></ul>`), '#list text'),
    ).toMatchObject({
      tagName: 'text',
      value: 'Hello World',
      childNodes: [],
    });
  });

  it('querySelectorAll, simple array query', () => {
    const elem = querySelectorAll(parser(`
      <ul id="list">
        <li>Hello World</li>
        <li>Hello World1</li>
        <li>Hello World2</li>
      </ul>
    `), '#list text');
    expect(elem).toHaveLength(3);
    expect(elem![0].value).toEqual('Hello World');
    expect(elem![1].value).toEqual('Hello World1');
    expect(elem![2].value).toEqual('Hello World2');
  })
});
