import compress from '../compressUrl';

describe('compress url', () => {
  it('jpg', () => {
    expect(compress('http://i2.ruliweb.com/img/12/34/56/aaabbbcccddd.jpg'))
      .toEqual('i2img123456aaabbbcccddd.jpg');
  })
  it('jpeg', () => {
    expect(compress('http://i2.ruliweb.com/img/12/34/56/aaabbbcccddd.jpeg'))
      .toEqual('i2img123456aaabbbcccddd.jpeg');
  })
  it('png', () => {
    expect(compress('http://i2.ruliweb.com/img/12/34/56/aaabbbcccddd.png'))
      .toEqual('i2img123456aaabbbcccddd.png');
  })
  it('gif', () => {
    expect(compress('http://i2.ruliweb.com/img/12/34/56/aaabbbcccddd.gif'))
      .toEqual('i2img123456aaabbbcccddd.gif');
  })
  it('webp', () => {
    expect(compress('http://i2.ruliweb.com/img/12/34/56/aaabbbcccddd.webp'))
      .toEqual('i2img123456aaabbbcccddd.webp');
  })
  it('unknown format', () => {
    expect(compress('http://i2.ruliweb.com/img/12/34/56/aaabbbcccddd'))
      .toEqual('i2img123456aaabbbcccddd.jpg');
  })
  it('external url with format as parameter', () => {
    expect(compress('http://img.pming.com/aaabbbcccddd?format=png&size=100x100'))
      .toEqual('imgpmingcomaaabbbcccddd.png');
  })
})
