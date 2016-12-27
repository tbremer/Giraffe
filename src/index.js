import { Node, Edge, mergePaths } from './lib';

function Graff() {
  this.nodes = [];
  this.edges = [];
  this.labels = {
    edges: {},
    nodes: {}
  };
}

Graff.prototype.create = function create (label, data) {
  if (label.constructor === Object) {
    data = label;
    label = null;
  }

  const id = this.nodes.length;
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
  const edges = [];

  for (const f in from) {
    const _from = from[f];

    for (const t in through ) {
      const _through = through[t];
      const id = this.edges.length;
      const edg = new Edge({ id, label, data, from: _from, through:_through });

      _from._edges.push(id);

      this.edges = [ ...this.edges, edg ];

      if (label) {
        const labelObj = this.labels.edges;

        if (!(label in labelObj)) labelObj[label] = [];
        labelObj[label] = [...labelObj[label], edg._id];
      }

      edges.push(edg);
    }
  }

  return edges;
};

Graff.prototype.query = function query (label, properties) {
  if (!label && !properties) label = properties = null;

  if (label && label.constructor === Object) {
    properties = label;
    label = null;
  }

  return mergePaths(label, properties, { nodes: this.nodes, edges: this.edges, labels: this.labels });
};

window.Graff = Graff;
