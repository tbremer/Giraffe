import expect from 'expect';
import Node from '../../src/utils/Node';
import Edge, { $type } from '../../src/utils/Edge';

describe('Edge', () => {
  let nodeA, nodeB, nodeSetA, nodeSetB;

  beforeEach(() => {
    nodeA = new Node('Node', { a: true, b: false });
    nodeB = new Node('Node', { a: false, b: true });
    nodeSetA = [ nodeA ];
    nodeSetB = [ nodeB ];
  });
  afterEach(() => {
    nodeA = nodeB = nodeSetA = nodeSetB = undefined;
  });

  it('is a function', () => {
    expect(Edge).toBeA('function');
  });

  it('throws errors', () => {
    const nodeA = new Node();
    const nodeB = new Node();
    expect(() => new Edge())
    .toThrow('An Edge requires two sets of Nodes');

    expect(() => new Edge(nodeA))
    .toThrow('An Edge requires two sets of Nodes');

    expect(() => new Edge(null, nodeB))
    .toThrow('An Edge requires two sets of Nodes');
  });

  xit('returns an array', () => {
    const expected = new Edge();

    expect(expected).toBeAn('array');
  });

  xit('returns a correctly formed object', () => {
    const expected = new Edge();

    expect(expected).toIncludeKeys([
      '$type',
      'identity',
      'labels',
      'edges',
      'properties'
    ]);
  });

  xit('exports a type', () => {
    expect($type).toBeA('string');
    expect($type).toBe('Edge');
  });

  xit('returns empty labels', () => {
    const expected = new Edge({ foo: 'bar' });

    expect(expected).toInclude({ labels: [] });
    expect(expected).toInclude({ properties: { foo: 'bar' } });
  });

  xit('returns empty props', () => {
    const expected = new Edge('Label');

    expect(expected).toInclude({ labels: [ 'Label' ] });
    expect(expected).toInclude({ properties: {} });
  });

  xit('returns with label and props', () => {
    const expected = new Edge('Label', { foo: 'bar' });

    expect(expected).toInclude({ labels: [ 'Label' ] });
    expect(expected).toInclude({ properties: { foo: 'bar' } });
  });
});
