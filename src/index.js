import Node from './Node';
import Edge from './Edge';
import Obj from './Obj';
import { checkProperties } from './lib';

export default function Giraffe() {
  this.nodes = [];
  this.edges = [];
  this.labels = {
    edges: {},
    nodes: {}
  };
}

Giraffe.prototype.create = function create (label, data) {
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
    labelObj[label] = [ ...labelObj[label], node.identity ];
  }

  return node;
};

Giraffe.prototype.remove = function remove (nodes) {
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

Giraffe.prototype.edge = function edge (from, through, label, data) {
  if (from.constructor !== Array) from = [ from ];
  if (through.constructor !== Array) through = [ through ];

  const edges = [];

  for (const f in from) {
    const _from = from[f];

    for (const t in through) {
      const _through = through[t];
      const id = this.edges.length;
      const edg = new Edge({ id, label, data, from: _from, through: _through });
      const labelObj = this.labels.edges;

      if (!(label in labelObj)) labelObj[label] = [];
      labelObj[label] = [ ...labelObj[label], edg.identity ];

      _from.edges.push(id);
      this.edges = [ ...this.edges, edg ];
      edges.push(edg);
    }
  }

  return edges;
};

Giraffe.prototype.query = function query (label, properties) {
  if (!label && !properties) label = properties = null;

  if (label && label.constructor === Object) {
    properties = label;
    label = null;
  }

  // console.log('label:', label);
  // console.log('properties:', properties);
  // console.log('this.nodes:', this.nodes);
  // console.log('this.labels:', this.labels);
  // console.log('this.edges:', this.edges);

  const results = [];

  for (const idx in this.nodes) {
    const node = this.nodes[idx];
    if (!node) continue;
    if (label && node.labels.indexOf(label) === -1) continue;
    if (properties && !checkProperties(node, properties)) continue;

    /*
      * EDGE CHECKING?
     */

    const returnObj = Object.assign(new Obj(), node);

    for (const edgeIdx in returnObj.edges) {
      const edgeId = returnObj.edges[edgeIdx];
      const edge = Object.assign(new Obj(), this.edges[edgeId]);
      const throughNode = this.nodes[edge.through];

      edge.through = Object.assign(new Obj(), throughNode);
      edge.from = returnObj;

      returnObj.edges[edgeIdx] = edge;
    }

    results.push(returnObj);
  }

  return results;
};
