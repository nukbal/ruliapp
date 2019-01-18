import parse from '../parseDate';

describe('Parse Date', () => {
  it('parse properly with date-only string', () => {
    expect(parse('18.10.11')!.toISOString()).toEqual('2018-10-11T00:00:00.000Z');
  });

  it('parse properly with full string', () => {
    expect(parse('18.10.11 11:20')!.toISOString()).toEqual('2018-10-11T11:20:00.000Z');
  });
});
