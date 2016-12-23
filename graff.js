console.clear();

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
    label = '';
  }

  const node = {
    _id: this.nodes.length + 1,
    ...data
  };

  this.nodes = [...this.nodes, node];

  if (label) {
    const labelObj = this.labels.nodes;

    if (!(label in labelObj)) labelObj[label] = [];
    labelObj[label] = [...labelObj[label], node._id];
  }

  return node;
};

Graff.prototype.edge = function edge (from, to, label, props) {
  const edg = {
    _id: this.edges.length + 1,
    from: from._id,
    to: to._id,
    label,
    ...props
  };

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
