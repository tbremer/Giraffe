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
  const id = this.edges.length;
  const edg = new Edge({ id, from, through, label, data });

  from._edges.push(id);

  this.edges = [ ...this.edges, edg ];

  if (label) {
    const labelObj = this.labels.edges;

    if (!(label in labelObj)) labelObj[label] = [];
    labelObj[label] = [...labelObj[label], edg._id];
  }

  return edg;
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
