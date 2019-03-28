import compress from '../compressUrl';

describe('compress url', () => {
  it('jpg', () => {
    expect(compress('http://i2.ruliweb.com/img/12/34/56/aaabbbcccddd.jpg'))
      .toEqual('i2ruliwebcomimg123456aaabbbcccddd.jpg');
  })
  it('png', () => {
    expect(compress('http://i2.ruliweb.com/img/12/34/56/aaabbbcccddd.png'))
      .toEqual('i2ruliwebcomimg123456aaabbbcccddd.png');
  })
  it('gif', () => {
    expect(compress('http://i2.ruliweb.com/img/12/34/56/aaabbbcccddd.gif'))
      .toEqual('i2ruliwebcomimg123456aaabbbcccddd.gif');
  })
  it('webp', () => {
    expect(compress('http://i2.ruliweb.com/img/12/34/56/aaabbbcccddd.webp'))
      .toEqual('i2ruliwebcomimg123456aaabbbcccddd.webp');
  })
  it('unknown format', () => {
    expect(compress('http://i2.ruliweb.com/img/12/34/56/aaabbbcccddd'))
      .toEqual('i2ruliwebcomimg123456aaabbbcccddd.jpg');
  })
})
