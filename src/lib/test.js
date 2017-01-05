import expect from 'expect';
import {
  checkProperties,
  lookForKey,
  ensureObjectsShape,
  buildEdges
} from './';

describe('lib', () => {
  describe('checkProperties', () => {
    it('returns true if no properties passed', () => {
      const node = { properties: {} };

      expect(checkProperties(node)).toBe(true);
      expect(checkProperties(node, undefined)).toBe(true);
      expect(checkProperties(node, null)).toBe(true);
    });

    it('returns true if props and object match', () => {
      const node = { properties: { foo: 'bar' } };
      const properties = { foo: 'bar' };

      expect(checkProperties(node, properties)).toBe(true);
    });

    it('returns false if key is not found', () => {
      const node = { properties: { foo: 'bar' } };
      const properties = { foo: 'bar', baz: false };

      expect(checkProperties(node, properties)).toBe(false);
    });

    it('returns false if values aren\'t equal', () => {
      const node = { properties: { foo: 'baz' } };
      const properties = { foo: 'bar' };

      expect(checkProperties(node, properties)).toBe(false);
    });
  });

  describe('lookForKey', () => {
    it('returns false if no data', () => {
      expect(lookForKey({ foo: 'bar' })).toEqual(false);
    });

    it('returns false if key isn\'t found in data', () => {
      const obj = {};
      const key = 'baz';

      expect(lookForKey(key, obj)).toEqual(false);
    });

    it('returns true if key found in data', () => {
      const obj = { baz: 'bing' };
      const key = 'baz';

      expect(lookForKey(key, obj)).toEqual(true);
    });
  });

  describe('ensureObjectsShape', () => {
    it('throws error if objects is not an array', () => {
      expect(() => ensureObjectsShape())
      .toThrow('Objects needs to be an array');
      expect(() => ensureObjectsShape({}, { foo: String }))
      .toThrow('Objects needs to be an array');
    });

    it('throws error if incorrect shape', () => {
      const objects = [
        { foo: 0 }
      ];
      const shape = { foo: String };

      expect(() => ensureObjectsShape(objects, shape))
      .toThrow(/Incorrect shape for/);
    });

    it('throws error if key not found', () => {
      const objects = [
        { foo: 0 }
      ];
      const shape = { foo: Number, bar: Boolean };

      expect(() => ensureObjectsShape(objects, shape))
      .toThrow(/Incorrect shape for/);
    });

    it('returns true if shape correct', () => {
      const objects = [
        { foo: 0, bar: true }
      ];
      const shape = { foo: Number, bar: Boolean };

      expect(ensureObjectsShape(objects, shape)).toBe(true);
    });
  });

  describe('buildEdges', () => {
    it('builds edges', () => {
      const nodes = [
        { identity: 0, properties: { name: 'Cat' }, edges: [ 0 ], labels: [] },
        { identity: 1, properties: { name: 'Dog' }, edges: [], labels: [] }
      ];
      const edges = [ { identity: 0, label: 'CHASES', properties: {}, from: 0, through: 1 } ];
      const assert = buildEdges.call({ nodes, edges }, edges);
      const expected = [ { identity: 0, label: 'CHASES', properties: {}, from: nodes[0], through: nodes[1] } ];

      expect(assert).toMatch(expected);
    });
  });
});
