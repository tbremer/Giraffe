import expect from 'expect';
import flatten from '../../src/utils/flatten';

describe('flatten', () => {
  it('throws a TypeError when input is invalid', () => {
    expect(() => flatten()).toThrow(TypeError);
    expect(() => flatten()).toThrow(/only takes an array/);
  });

  it('returns empty array', () => {
    expect(flatten([])).toEqual([]);
  });
  it('does not affect flat arrays', () => {
    const arr = [ 1, 2, 3, 4, 'foo', {} ];
    expect(flatten(arr)).toEqual(arr);
  });

  it('flattens nested arrays', () => {
    const arr = [ 1, 2, [ 3, [ 4 ] ], [ [ [ 'foo' ] ] ], {} ];
    const assert = [ 1, 2, 3, 4, 'foo', {} ];
    expect(flatten(arr)).toEqual(assert);
  });
});
