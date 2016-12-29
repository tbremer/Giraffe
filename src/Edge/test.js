import expect from 'expect';
import Edge from './';
import Node from '../Node';

describe('Edge', () => {
  it('returns a properly formatted Edge object', () => {
    const from = new Node({ id: 0 });
    const through = new Node({ id: 1 });
    const edge = new Edge({ from, through, id: 90, label: 'CHASES', data: {} });

    expect(edge).toIncludeKeys([
      'identity',
      'from',
      'through',
      'label',
      'properties'
    ]);
    expect(edge).toInclude({
      identity: 90,
      from: 0,
      through: 1,
      label: 'CHASES',
      properties: {}
    });
  });

  it('throws an error if there is no label', () => {
    const expected = 'All Edges need a single Label';
    expect(() => {
      const from = new Node({ id: 0 });
      const through = new Node({ id: 1 });
      new Edge({ from, through });
    })
    .toThrow(expected);
  });

  it('throws an error if there is multiple labels', () => {
    const expected = 'All Edges need a single Label';
    expect(() => {
      const from = new Node({ id: 0 });
      const through = new Node({ id: 1 });
      new Edge({ from, through, label: [ 'a', 'b' ] });
    })
    .toThrow(expected);
  });

  it('clones data', () => {
    const from = new Node({ id: 0 });
    const through = new Node({ id: 1 });
    const data = { name: 'Dog', tricks: 0 };
    const edge = new Edge({ from, through, id: 90, label: 'CHASES', data });

    expect(edge).toInclude({ properties: data });
  });
});
