import compress from '../compressUrl';

describe('compress url', () => {
  it('compressed', () => {
    expect(compress('http://i2.ruliweb.com/img/19/01/30/1689ebca90213f0b0.jpg'))
      .toEqual('i2ruliwebcomimg1901301689ebca90213f0b0');
  })
})
