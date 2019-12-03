import parse from '../parseDate';
import MockDate from 'mockdate';

describe('Parse Date', () => {

  beforeEach(MockDate.reset);

  it('parse properly with date-only string', () => {
    expect(parse('18.10.11')).toEqual('2018-10-10T15:00:00.000Z');
  });

  it('parse properly with full string', () => {
    expect(parse('18.10.11 11:20')).toEqual('2018-10-11T02:20:00.000Z');
  });

  it('parse time only string', () => {
    MockDate.set(Date.UTC(2018, 9, 11));
    expect(parse('11:20')).toEqual('2018-10-11T02:20:00.000Z');
  });
});
