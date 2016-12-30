import expect from 'expect';
import Giraffe from './';

const label = 'Animal';
const relationship = 'CHASES';

describe('Giraffe', () => {
  let db;

  beforeEach(() => { db = new Giraffe(); }); //eslint-disable-line
  afterEach(() => { db = undefined; }); //eslint-disable-line

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
      identity: 0,
      labels: [ 'Animal' ],
      properties: {
        name: 'Fido',
        type: 'dog'
      }
    });
  });

  it('nodes increment properly', () => {
    const nodeA = db.create(label, { name: 'Fido', type: 'dog' });
    const nodeB = db.create(label, { name: 'Fido', type: 'dog' });

    expect(db.nodes.length).toEqual(2);
    expect(nodeA.identity).toEqual(0);
    expect(nodeB.identity).toEqual(1);
  });

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
      identity: 0,
      from: 0,
      through: 1,
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

  describe('query', () => {
    it('returns all built nodes if no properties passed in');
    it('returns all built nodes of a label if only a label passed in');

    it('nodes returned in query', () => {
      db.create(label, { name: 'Cat' });
      db.create(label, { name: 'Dog' });
      db.create(label, { name: 'CatDog' });

      const results = db.query(label, { name: 'CatDog' });
      expect(results.length).toEqual(1);
      expect(results[0]).toInclude({
        identity: 2,
        labels: [ label ],
        properties: { name: 'CatDog' }
      });
    });

    it('edges returned in search', () => {
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
        identity: 0,
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

    xit('can query based on edges with a single value', () => {
      const cat = db.create(label, { name: 'Cat' });
      const dog = db.create(label, { name: 'Dog' });
      db.create(label, { name: 'CatDog' });

      db.edge(cat, dog, relationship);
      db.edge(dog, cat, relationship);

      const results = db.query({ _edges: relationship });

      expect(results.length).toEqual(2);
    });

    xit('edge query returns no results when no edges found', () => {
      const cat = db.create(label, { name: 'Cat' });
      const dog = db.create(label, { name: 'Dog' });
      db.create(label, { name: 'CatDog' });

      db.edge(cat, dog, relationship);
      db.edge(dog, cat, relationship);

      const results = db.query({ _edges: [ 'ACTED_IN' ] });

      expect(results.length).toEqual(0);
    });
  });

  /**
   * OLD TESTS
   */

  xit('removes nodes', () => {
    const nodeA = db.create(label, { name: 'Dog' });
    db.create(label, { name: 'Cat' });

    expect(db.nodes.length).toEqual(2);

    db.remove(nodeA);

    expect(db.nodes.length).toEqual(2);
    expect(db.nodes[0]).toEqual(undefined);
  });

  xit('removes edges when nodes removed', () => {
    const nodeA = db.create(label, { name: 'Dog' });
    const nodeB = db.create(label, { name: 'Cat' });
    db.edge(nodeA, nodeB, relationship);

    expect(db.nodes.length).toEqual(2);
    expect(db.edges.length).toEqual(1);

    db.remove(nodeA);

    expect(db.nodes.length).toEqual(2);
    expect(db.edges.length).toEqual(1);
    expect(db.nodes[0]).toEqual(undefined);
    expect(db.edges[0]).toEqual(undefined);
  });
});
