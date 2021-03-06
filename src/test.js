import expect, { createSpy } from 'expect';
import Giraffe from './';
import Node from './Node';
import Edge from './Edge';

const label = 'Animal';
const relationship = 'CHASES';

describe('Giraffe', () => {
  let db;

  beforeEach(() => { db = new Giraffe(); }); //eslint-disable-line
  afterEach(() => { db = undefined; }); //eslint-disable-line

  describe('database', () => {
    describe('initial data', () => {
      it('allows for preloaded data', () => {
        const nodes = [
          new Node({ id: 0, data: { name: 'Cat' } }),
          new Node({ id: 1, data: { name: 'Dog' } })
        ];
        const edges = [
          new Edge({ from: nodes[0], through: nodes[1], label: 'CHASES', id: 0 })
        ];

        db = new Giraffe({ nodes, edges });

        expect(db.nodes.length).toEqual(2);
        expect(db.edges.length).toEqual(1);
        expect(db.labels.nodes).toEqual({});
        expect(db.labels.edges).toIncludeKey('CHASES');
      });

      it('throws errors if edge does not have a label', () => {
        const nodes = [
          new Node({ id: 0, data: { name: 'Cat' } }),
          new Node({ id: 1, data: { name: 'Dog' } })
        ];
        const edges = [
          new Edge({ from: nodes[0], through: nodes[1], label: 'CHASES', id: 0 })
        ];

        delete edges[0].label;

        expect(() => new Giraffe({ nodes, edges }))
        .toThrow(/Incorrect shape for/);
      });

      it('throws errors if Node does not have the correct shape', () => {
        const nodes = [ { identity: 'foo' } ];

        expect(() => new Giraffe({ nodes }))
        .toThrow(/Incorrect shape for/);
      });

      it('throws errors if Edge does not have the correct shape', () => {
        const edges = [ { identity: 'foo' } ];

        expect(() => new Giraffe({ edges }))
        .toThrow(/Incorrect shape for/);
      });

      it('throws errors if creation is sent a non-array for nodes', () => {
        const nodes = { identity: 'foo' };

        expect(() => new Giraffe({ nodes }))
        .toThrow(/Objects needs to be an array/);
      });

      it('throws errors if creation is sent a non-array for edges', () => {
        const edges = { from: 0, through: 1, label: '', identity: 'foo' };

        expect(() => new Giraffe({ edges }))
        .toThrow(/Objects needs to be an array/);
      });
    });

    describe('callback', () => {
      it('handles callback as first argument', () => {
        const callback = createSpy();

        db = new Giraffe(callback);

        expect(db.callback).toEqual(callback);
        expect(db.nodes).toEqual([]);
        expect(db.edges).toEqual([]);
        expect(db.labels).toEqual({
          nodes: {},
          edges: {}
        });
      });

      it('calls callback on `create`', () => {
        const callback = createSpy();

        db = new Giraffe(callback);
        const node = db.create({ name: 'Cat' });

        expect(callback).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledWith('create', node);
      });

      it('calls callback on `update`', () => {
        const callback = createSpy();

        db = new Giraffe(callback);

        const updatedNode = db.update(db.create({ name: 'Cat' }), { type: 'Tabby' });

        expect(callback).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledWith('update', updatedNode);
      });

      it('calls callback on `remove`', () => {
        const callback = createSpy();

        db = new Giraffe(callback);

        const node = db.create({ name: 'Cat' });

        db.remove(node);

        expect(callback).toHaveBeenCalled();

        expect(callback).toHaveBeenCalledWith('remove', [ node ]);
      });

      it('calls callback on `edge`', () => {
        const callback = createSpy();

        db = new Giraffe(callback);

        const cat = db.create({ name: 'Cat' });
        const dog = db.create({ name: 'Dog' });
        const [ edge ] = db.edge(cat, dog, relationship);
        const calledWith = [
          {
            ...edge,
            from: cat,
            through: dog
          }
        ];

        expect(callback).toHaveBeenCalled();

        const [ callbackType, callbackNodes ] = callback.calls[2].arguments;

        expect(callbackType).toEqual('edge');
        expect(callbackNodes).toMatch(calledWith);
      });

      it('calls callback on `query`', () => {
        const callback = createSpy();

        db = new Giraffe(callback);

        db.create(label, { name: 'Cat' });
        db.create(label, { name: 'Dog' });
        db.create(label, { name: 'CatDog' });

        const results = db.query(label);

        expect(callback).toHaveBeenCalled();

        const [ callbackType, callbackData ] = callback.calls[3].arguments;

        expect(callbackType).toEqual('query');
        expect(callbackData).toEqual(results);
      });
    });

    describe('initial data and callback', () => {
      it('handles both', () => {
        const callback = createSpy();
        const nodes = [
          new Node({ id: 0, data: { name: 'Cat' } }),
          new Node({ id: 1, data: { name: 'Dog' } })
        ];
        const edges = [
          new Edge({ from: nodes[0], through: nodes[1], label: 'CHASES', id: 0 })
        ];

        db = new Giraffe({ nodes, edges }, callback);

        expect(db.nodes.length).toEqual(2);
        expect(db.edges.length).toEqual(1);
        expect(db.labels.nodes).toEqual({});
        expect(db.labels.edges).toIncludeKey('CHASES');
        expect(db.callback).toEqual(callback);
      });
    });

    describe('tracks IDs', () => {
      it('has an IDs key', () => {
        expect(db).toIncludeKey('_ids');
        expect(db._ids).toBeAn('array');
      });

      it('has a generateId function', () => {
        expect(db).toIncludeKey('_generateId');
        expect(db._generateId).toBeAn('function');
      });

      it('hidden props do not show up on enumerations', () => {
        expect(Object.keys(db)).toExclude('_ids');
        expect(Object.keys(db)).toExclude('_generateId');
      });

      it('increments with each creation', () => {
        expect(db._ids.length).toBe(0);
        const cat = db.create({ name: 'Cat' });
        expect(db._ids.length).toBe(1);
        const dog = db.create({ name: 'Dog' });
        expect(db._ids.length).toBe(2);
        db.edge(cat, dog, relationship);
        expect(db._ids.length).toBe(3);
      });
    });
  });

  describe('create', () => {
    it('can create nodes', () => {
      const node = db.create(label, { name: 'Fido', type: 'dog' });

      expect(db.nodes.length).toEqual(1);
      expect(db.nodes[0]).toEqual(node);
      expect(node).toIncludeKeys([
        'properties',
        'identity',
        'edges',
        'labels'
      ]);
      expect(node).toInclude({
        labels: [ 'Animal' ],
        properties: {
          name: 'Fido',
          type: 'dog'
        }
      });
    });
  });

  describe('edges', () => {
    it('creates edges', () => {
      const nodeA = db.create(label, { name: 'Dog' });
      const nodeB = db.create(label, { name: 'Cat' });
      const [ edge ] = db.edge(nodeA, nodeB, relationship);

      expect(db.edges.length).toEqual(1);
      expect(db.nodes.length).toEqual(2);
      expect(edge).toIncludeKeys([
        'identity',
        'from',
        'through',
        'label',
        'properties'
      ]);
      expect(edge).toInclude({
        from: nodeA.identity,
        through: nodeB.identity,
        label: 'CHASES',
        properties: {}
      });
    });

    it('creates edges with data', () => {
      const data = { time: Date.now() };
      const nodeA = db.create(label, { name: 'Dog' });
      const nodeB = db.create(label, { name: 'Cat' });
      const [ edge ] = db.edge(nodeA, nodeB, relationship, data);

      expect(edge).toInclude({ properties: data });
    });
  });

  describe('query', () => {
    it('returns all built nodes if no properties passed in', () => {
      db.create(label, { name: 'Cat' });
      db.create(label, { name: 'Dog' });
      db.create(label, { name: 'CatDog' });

      const results = db.query();

      expect(results.length).toEqual(3);
    });

    it('returns all built nodes of a label if only a label passed in', () => {
      db.create(label, { name: 'Cat' });
      db.create(label, { name: 'Dog' });
      db.create(label, { name: 'CatDog' });
      db.create({ name: 'Grass' });
      db.create({ name: 'Neptune' });
      db.create({ name: 'Sun' });
      db.create({ name: 'Europa' });

      const results = db.query(label);

      expect(results.length).toEqual(3);
    });

    it('nodes returned', () => {
      db.create(label, { name: 'Cat' });
      db.create(label, { name: 'Dog' });
      db.create(label, { name: 'CatDog' });

      const results = db.query(label, { name: 'CatDog' });
      const [ res ] = results;
      expect(results.length).toEqual(1);
      expect(res).toInclude({
        labels: [ label ],
        properties: { name: 'CatDog' }
      });
    });

    it('edges returned', () => {
      const cat = db.create(label, { name: 'Cat' });
      const dog = db.create(label, { name: 'Dog' });
      db.create(label, { name: 'CatDog' });

      db.edge(
        db.query(label, { name: 'Cat' }),
        db.query(label, { name: 'Dog' }),
        relationship
      );

      expect(db.nodes.length).toEqual(3);
      expect(db.edges.length).toEqual(1);

      const results = db.query(label, { name: 'Cat' });
      const [ node ] = results;
      const [ edge ] = node.edges;

      expect(results.length).toEqual(1);
      expect(edge).toInclude({
        label: 'CHASES',
        from: cat,
        through: dog
      });
    });

    it('can query based on edges', () => {
      const cat = db.create(label, { name: 'Cat' });
      const dog = db.create(label, { name: 'Dog' });
      db.create(label, { name: 'CatDog' });

      db.edge(cat, dog, relationship);
      db.edge(dog, cat, relationship);

      const results = db.query({ edges: [ relationship ] });

      expect(results.length).toEqual(2);
    });

    it('edge query returns no results when no edges found', () => {
      const cat = db.create(label, { name: 'Cat' });
      const dog = db.create(label, { name: 'Dog' });
      db.create(label, { name: 'CatDog' });

      db.edge(cat, dog, relationship);
      db.edge(dog, cat, relationship);

      const results = db.query({ edges: [ 'ACTED_IN' ] });

      expect(results.length).toEqual(0);
    });

    it('returns based on properties and edges', () => {
      const cat = db.create(label, { name: 'Cat' });
      const dog = db.create(label, { name: 'Dog' });
      db.create(label, { name: 'CatDog' });

      db.edge(cat, dog, relationship);
      db.edge(dog, cat, relationship);

      const results = db.query({ name: 'Cat', edges: [ relationship ] });

      expect(results.length).toEqual(1);
    });

    it('returns properly when testing multiple edges', () => {
      const cat = db.create(label, { name: 'Cat' });
      const dog = db.create(label, { name: 'Dog' });

      db.edge(cat, dog, relationship);
      db.edge(cat, dog, 'PLAYS');
      db.edge(dog, cat, relationship);

      const results = db.query({ edges: [ relationship, 'PLAYS' ] });

      expect(results.length).toEqual(1);
      expect(results[0].properties).toInclude({ name: 'Cat' });
    });

    it('supports nested queries');
  });

  describe('remove', () => {
    it('removes nodes', () => {
      const nodeA = db.create(label, { name: 'Dog' });
      const nodeB = db.create(label, { name: 'Cat' });

      expect(db.nodes.length).toEqual(2);

      db.remove(nodeA);

      expect(db.nodes.length).toEqual(1);
      expect(db.nodes[0]).toEqual(nodeB);
    });

    it('removes edges when nodes removed', () => {
      const nodeA = db.create(label, { name: 'Dog' });
      const nodeB = db.create(label, { name: 'Cat' });
      db.edge(nodeA, nodeB, relationship);

      expect(db.nodes.length).toEqual(2);
      expect(db.edges.length).toEqual(1);

      db.remove(nodeA);

      expect(db.nodes.length).toEqual(1);
      expect(db.edges.length).toEqual(0);
      expect(db.nodes[0]).toEqual(nodeB);
    });

    it('removes reference to nodes in labels.nodes', () => {
      const nodeA = db.create(label, { name: 'Cat' });
      const nodeB = db.create(label, { name: 'Dog' });

      db.remove(nodeB);

      expect(db.nodes.length).toEqual(1);
      expect(db.nodes[1]).toEqual(undefined);
      expect(db.labels.nodes[label].length).toEqual(1);
      expect(db.labels.nodes[label][0]).toEqual(nodeA.identity);
    });

    it('removes reference to nodes in labels.edges', () => {
      const cat = db.create(label, { name: 'Cat' });
      const dog = db.create(label, { name: 'Dog' });

      db.edge(cat, dog, relationship);
      db.remove(cat);

      expect(db.nodes.length).toEqual(1);
      expect(db.nodes[0]).toEqual(dog);
      expect(db.labels.edges[relationship].length).toEqual(0);
      expect(db.labels.edges[relationship][0]).toEqual(undefined);
    });
  });

  describe('update', () => {
    it('can update nodes', () => {
      const node = db.create({ name: 'Cat' });
      const result = db.update(node, { type: 'Tabby' });

      expect(result).toBeAn('array');
      expect(node).toIncludeKey('properties');
      expect(node.properties).toInclude({
        name: 'Cat',
        type: 'Tabby'
      });
    });

    it('can update edges', () => {
      const cat = db.create({ name: 'Cat' });
      const dog = db.create({ name: 'Dog' });
      const edge = db.edge(cat, dog, relationship);
      const results = db.update(edge, { 'for-fun': true });

      expect(results).toBeAn('array');
      expect(results[0]).toInclude({
        properties: { 'for-fun': true }
      });
    });

    it('throws error if trying to update edge labels', () => {
      const cat = db.create({ name: 'Cat' });
      const dog = db.create({ name: 'Dog' });
      const edge = db.edge(cat, dog, relationship);

      expect(() => {
        db.update(edge, 'RUNS AWAY FROM');
      })
      .toThrow('Edge Labels cannot be changed.');
    });

    it('updates node labels', () => {
      const node = db.create({ name: 'Cat' });
      const [ updatedNode ] = db.update(node, label);

      expect(updatedNode).toIncludeKey('labels');
      expect(updatedNode.labels).toInclude('Animal');
    });

    it('handles arrays of nodes', () => {
      db.create(label, { type: 'Cat' });
      db.create(label, { type: 'Dog' });
      db.create(label, { type: 'Whale' });

      const results = db.update(db.query(label), 'Mammal');

      expect(results.length).toEqual(3);
      results.forEach(node => {
        expect(node.labels).toInclude('Animal');
        expect(node.labels).toInclude('Mammal');
      });
    });
  });
});
