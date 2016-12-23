console.clear();

function Node({id, label, data}) {
  const obj = Object.create(null);
  const node = Object.defineProperties(obj, {
    _id: { value: id },
    label: { value: label }
  });

  for (const key in data) {
    Object.defineProperty(node, key, { value: data[key] })
  }

  return node;
}

function Edge({ id, label, from, through, data }) {
  const obj = Object.create(null);
  const edge = Object.defineProperties(obj, {
    _id: { value: id },
    from: {value: from._id},
    through: { value: through._id },
    label: { value: label }
  });

  for (const key in data) {
    Object.defineProperty(edge, key, { value: data[key] })
  }

  return edge;
}

function Graff() {
  this.nodes = [];
  this.edges = [];
  this.labels = {
    edges: {},
    nodes: {}
  };
  this.db = {
    nodes: this.nodes,
    edges: this.edges,
    labels: this.labels
  };
}

Graff.prototype.create = function create (label, data) {
  if (label.constructor === Object) {
    data = label;
    label = null;
  }

  const id = this.nodes.length + 1;
  const node = new Node({ id, label, data });

  this.nodes = [...this.nodes, node];

  if (label) {
    const labelObj = this.labels.nodes;

    if (!(label in labelObj)) labelObj[label] = [];
    labelObj[label] = [...labelObj[label], node._id];
  }

  return node;
};

Graff.prototype.edge = function edge (from, through, label, data) {
  const id = this.edges.length + 1;
  const edg = new Edge({ id, from, through, label, data });

  this.edges = [ ...this.edges, edg ];

  if (label) {
    const labelObj = this.labels.edges;

    if (!(label in labelObj)) labelObj[label] = [];
    labelObj[label] = [...labelObj[label], edg._id];
  }

  return edg;
};

// Graff.prototype.remove = function remove () {};
// Graff.prototype.removeEdge = function removeEdge () {};
// Graff.prototype.query = function query () {};

const Person = 'person';
const ab = new Graff();

const one = ab.create({ foo: 'bar' });
const two = ab.create(Person, { baz: 'bing' });
const edge = ab.edge(one, two, 'LOVES')

console.log(one);
console.log(two);
console.log(edge);
console.log(ab);
