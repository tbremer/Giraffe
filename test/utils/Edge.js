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
    expect(() => new Edge())
    .toThrow('An Edge requires two sets of Nodes');

    expect(() => new Edge(nodeA))
    .toThrow('An Edge requires two sets of Nodes');

    expect(() => new Edge(null, nodeB))
    .toThrow('An Edge requires two sets of Nodes');
  });

  it('returns an array', () => {
    const expected = new Edge(nodeSetA, nodeSetB);

    expect(expected).toBeAn('array');
  });

  it('returns a correctly formed array', () => {
    const expected = new Edge(nodeSetA, nodeSetB);
    const [ head ] = expected;

    expect(expected.length).toEqual(1);
    expect(head).toIncludeKeys([
      '$type',
      'identity',
      'labels',
      'from',
      'through',
      'properties'
    ]);
  });

  it('exports a type', () => {
    expect($type).toBeA('string');
    expect($type).toBe('Edge');
  });

  it('returns empty labels', () => {
    const props = { foo: 'bar' };
    const expected = new Edge(nodeSetA, nodeSetB, props);
    const [ head ] = expected;

    expect(expected.length).toEqual(1);
    expect(head).toInclude({ labels: [] });
    expect(head).toInclude({ properties: props });
  });

  it('returns empty props', () => {
    const label = 'Label';
    const expected = new Edge(nodeSetA, nodeSetB, label);
    const [ head ] = expected;

    expect(expected.length).toEqual(1);
    expect(head).toInclude({ labels: [ label ] });
    expect(head).toInclude({ properties: {} });
  });

  it('returns with label and props', () => {
    const label = 'Label';
    const props = { foo: 'bar' };
    const expected = new Edge(nodeSetA, nodeSetB, label, props);
    const [ head ] = expected;

    expect(expected.length).toEqual(1);
    expect(head).toInclude({ labels: [ label ] });
    expect(head).toInclude({ properties: props });
  });

  it('allows for multiple labels', () => {
    const labels = [ 'Label', 'Foo', 'Bar' ];
    const props = { foo: 'bar' };
    const expected = new Edge(nodeSetA, nodeSetB, labels, props);
    const [ head ] = expected;

    expect(expected.length).toEqual(1);
    expect(head).toInclude({ labels });
    expect(head).toInclude({ properties: props });
  });

  it('joins multiple', () => {
    const randNum = Math.round(Math.random() * 100);
    const randNum2 = Math.round(Math.random() * 100);
    nodeSetA = [ ...new Array(randNum) ].map((item, idx) => new Node('Item', { id: idx }));
    nodeSetB = [ ...new Array(randNum2) ].map((item, idx) => new Node('Item', { id: idx }));

    const expected = new Edge(nodeSetA, nodeSetB);

    expect(expected.length).toBe((randNum * randNum2));
  });
});
