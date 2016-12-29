import Giraffe from '../src';
import expect from 'expect';

describe('giraffe', () => {
  const label = 'Animal';
  const relationship = 'CHASES';
  let db;

  beforeEach(() => {
    db = new Giraffe();
  });

  afterEach(() => {
    db = undefined;
  });

  it('creates nodes', () => {
    const node = db.create({ name: 'foo' });

    expect(node).toIncludeKeys([ '_id', 'name' ]);
    expect(db.nodes.length).toEqual(1);
  });

  it('creates nodes with labels', () => {
    const node = db.create('Label', { name: 'foo' });

    expect(node).toIncludeKeys([ '_id', '_edges', 'name', 'label' ]);
    expect(node).toInclude({
      name: 'foo',
      label: 'Label'
    });
    expect(db.nodes.length).toEqual(1);
  });

  it('creates edges', () => {
    const nodeA = db.create(label, { name: 'Dog' });
    const nodeB = db.create(label, { name: 'Cat' });
    const [ edge ] = db.edge(nodeA, nodeB, relationship);

    expect(db.edges.length).toEqual(1);
    expect(db.nodes.length).toEqual(2);
    expect(edge).toIncludeKeys([ '_id', 'from', 'through', 'label' ]);
    expect(edge).toInclude({
      from: 0,
      through: 1,
      label: relationship
    });
  });

  it('creates edges with extra data', () => {
    const data = { alot: true, 'for-fun': false };
    const nodeA = db.create(label, { name: 'Dog' });
    const nodeB = db.create(label, { name: 'Cat' });
    const [ edge ] = db.edge(nodeA, nodeB, relationship, data);

    expect(edge).toIncludeKeys([ '_id', 'from', 'through', 'label' ]);
    expect(edge).toInclude({
      from: 0,
      through: 1,
      label: relationship,
      alot: true,
      'for-fun': false
    });
  });

  it('removes nodes', () => {
    const nodeA = db.create(label, { name: 'Dog' });
    db.create(label, { name: 'Cat' });

    expect(db.nodes.length).toEqual(2);

    db.remove(nodeA);

    expect(db.nodes.length).toEqual(2);
    expect(db.nodes[0]).toEqual(undefined);
  });

  it('removes edges when nodes removed', () => {
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

  it('nodes returned in search', () => {
    db.create(label, { name: 'Cat' });
    db.create(label, { name: 'Dog' });
    db.create(label, { name: 'CatDog' });

    expect(db.nodes.length).toEqual(3);
    expect(db.edges.length).toEqual(0);

    const results = db.query(label, { name: 'CatDog' });
    expect(results.length).toEqual(1);
    expect(results[0]).toInclude({ name: 'CatDog' });
  });

  it('edges returned in search', () => {
    db.create(label, { name: 'Cat' });
    db.create(label, { name: 'Dog' });
    db.create(label, { name: 'CatDog' });

    db.edge(
      db.query(label, { name: 'Cat' }),
      db.query(label, { name: 'Dog' }),
      relationship
    );

    expect(db.nodes.length).toEqual(3);
    expect(db.edges.length).toEqual(1);

    const results = db.query(label, { name: 'Cat' });

    expect(results.length).toEqual(1);
    expect(results[0]).toInclude({
      name: 'Cat',
      _edges: [ 0 ]
    });
    expect(results[0]).toIncludeKey('CHASES');
  });

  it('can query based on edges', () => {
    const cat = db.create(label, { name: 'Cat' });
    const dog = db.create(label, { name: 'Dog' });
    db.create(label, { name: 'CatDog' });

    db.edge(cat, dog, relationship);
    db.edge(dog, cat, relationship);

    const results = db.query({ _edges: [ relationship ] });

    expect(results.length).toEqual(2);
  });

  it('can query based on edges with a single value', () => {
    const cat = db.create(label, { name: 'Cat' });
    const dog = db.create(label, { name: 'Dog' });
    db.create(label, { name: 'CatDog' });

    db.edge(cat, dog, relationship);
    db.edge(dog, cat, relationship);

    const results = db.query({ _edges: relationship });

    expect(results.length).toEqual(2);
  });

  it('edge query returns no results when no edges found', () => {
    const cat = db.create(label, { name: 'Cat' });
    const dog = db.create(label, { name: 'Dog' });
    db.create(label, { name: 'CatDog' });

    db.edge(cat, dog, relationship);
    db.edge(dog, cat, relationship);

    const results = db.query({ _edges: [ 'ACTED_IN' ] });

    expect(results.length).toEqual(0);
  });
});
