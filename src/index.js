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

  this.nodes = [ ...this.nodes, node ];

  if (label) {
    const labelObj = this.labels.nodes;

    if (!(label in labelObj)) labelObj[label] = [];
    labelObj[label] = [ ...labelObj[label], node._id ];
  }

  return node;
};

Graff.prototype.edge = function edge (from, through, label, data) {
  if (from.constructor !== Array) from = [ from ];
  if (through.constructor !== Array) through = [ through ];

  const edges = [];

  for (const f in from) {
    const _from = from[f];


    for (const t in through) {
      const _through = through[t];
      const id = this.edges.length;
      const edg = new Edge({ id, label, data, from: _from, through: _through });

      _from._edges.push(id);

      this.edges = [ ...this.edges, edg ];

      if (label) {
        const labelObj = this.labels.edges;

        if (!(label in labelObj)) labelObj[label] = [];
        labelObj[label] = [ ...labelObj[label], edg._id ];
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

Graff.prototype.remove = function remove (nodes) {
  if (nodes.constructor !== Array) nodes = [ nodes ];

  for (const n in nodes) {
    const node = nodes[n];
    const { _id: id } = node;

    /**
     * remove all of this node's edges
     */
    for (const e in node._edges) {
      const edge = node._edges[e];

      this.edges[edge] = undefined;
    }

    /**
     * remove all edges that reference this node
     */
    for (const e in this.edges) {
      const edge = this.edges[e];

      if (!edge || edge.through !== id) continue;

      const node = this.nodes[edge.from];
      if (!node) continue;

      const idx = node._edges.indexOf(edge._id);
      if (idx === -1) continue;

      /**
       * splice edge out of node's array
       */
      node._edges.splice(idx, 1);

      /**
       * remove
       */
      this.edges[e] = undefined;
    }

    /**
     * finally, remove node.
     */
    this.nodes[node._id] = undefined;
  }
};
