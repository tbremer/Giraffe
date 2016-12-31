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
    const { identity } = node;

    /**
     * remove all of this node's edges
     */
    for (const e in node.edges) {
      const edge = node.edges[e];

      this.edges[edge] = undefined;
    }

    /**
     * remove all edges that reference this node
     */
    for (const e in this.edges) {
      const edge = this.edges[e];

      if (!edge || edge.through !== identity) continue;

      const node = this.nodes[edge.from];
      if (!node) continue;

      const idx = node.edges.indexOf(edge.identity);
      if (idx === -1) continue;

      /**
       * splice edge out of node's array
       */
      node.edges.splice(idx, 1);

      /**
       * remove
       */
      this.edges[e] = undefined;
    }

    /**
     * finally, remove node.
     */
    this.nodes[identity] = undefined;
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

  const results = [];

  for (const idx in this.nodes) {
    const node = this.nodes[idx];
    if (!node) continue;
    if (label && node.labels.indexOf(label) === -1) continue;

    const nodeContainsValidProps = checkProperties(node, properties);
    const edgeCheck = (properties && 'edges' in properties);

    /**
     * Edge checking
     * define boolean as false (assume node does not have the edge)
     * we loop through all edges, checking `this.labels.edges` for the names,
     * then checking the corresponding ids.
     * if and edge is not found we continue checking nodes.
     */
    if (edgeCheck) {
      let nodeContainsEdge = false;
      for (const idx in properties.edges) {
        const edgeName = properties.edges[idx];

        if (!(edgeName in this.labels.edges)) continue; // edge is not known
        if (this.labels.edges[edgeName].indexOf(node.identity) > -1) { // edge exists and is found
          nodeContainsEdge = true;
          continue;
        }
      }

      if (!nodeContainsEdge) continue; // Node does not have the edge and we move on. through our parent loop.
    }

    if (properties && !nodeContainsValidProps) continue;

    /**
     * Build our node object without a prototype (now Hash Objects);
     * loop through all the edges and create a circular reference to the node
     * bind the node and it's relationship to the same return
     * This works in a single degree of separation so a node can have an edge
     * to itself without stack-overflowing.
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
