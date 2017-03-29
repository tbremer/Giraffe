import expect from 'expect';
import Node from '../../src/utils/Node';

describe('Node', () => {
  it('is a function', () => {
    expect(Node).toBeA('function');
  });

  it('returns an object', () => {
    const expected = new Node();

    expect(expected).toBeAn('object');
  });

  it('returns a correctly formed object', () => {
    const expected = new Node();

    expect(expected).toIncludeKeys([
      '$type',
      'identity',
      'labels',
      'edges',
      'properties'
    ]);
    expect(expected).toInclude({ $type: 'Node' });
  });

  it('returns empty labels', () => {
    const expected = new Node({ foo: 'bar' });

    expect(expected).toInclude({ labels: [] });
    expect(expected).toInclude({ properties: { foo: 'bar' } });
  });

  it('returns empty props', () => {
    const expected = new Node('Label');

    expect(expected).toInclude({ labels: [ 'Label' ] });
    expect(expected).toInclude({ properties: {} });
  });

  it('returns with label and props', () => {
    const expected = new Node('Label', { foo: 'bar' });

    expect(expected).toInclude({ labels: [ 'Label' ] });
    expect(expected).toInclude({ properties: { foo: 'bar' } });
  });

  it('takes multiple labels', () => {
    const labels = [ 'Label', 'Node', 'Foo' ];
    const expected = new Node(labels);

    expect(expected).toInclude({ labels });
  });
});
