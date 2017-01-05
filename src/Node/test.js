import expect from 'expect';
import Node from './';

describe('Node', () => {
  it('returns a properly formatted Node object', () => {
    const node = new Node({ id: 90, label: 'ANIMAL', data: {} });

    expect(node).toIncludeKeys([
      'identity',
      'edges',
      'properties',
      'labels'
    ]);
    expect(node).toInclude({
      identity: 90,
      labels: [ 'ANIMAL' ],
      edges: [],
      properties: {}
    });
  });

  it('returns an empty label array if no label is passed in', () => {
    const node = new Node({ id: 90, data: {} });
    expect(node).toIncludeKeys([
      'identity',
      'edges',
      'properties',
      'labels'
    ]);
    expect(node).toInclude({
      identity: 90,
      labels: [],
      edges: [],
      properties: {}
    });
  });

  it('clones data', () => {
    const data = { name: 'Dog', tricks: 0 };
    const node = new Node({ id: 0, data, label: 'ANIMAL' });

    expect(node).toInclude({ properties: data });
  });

  it('accepts multiple labels', () => {
    const labels = [ 'foo', 'bar' ];
    const node = new Node({ id: 123, label: labels });

    expect(node.labels).toMatch(labels);
  });

  it('throws an error without an identity', () => {
    expect(() => new Node({}))
    .toThrow(`All Node's require an id`);
  });
});
