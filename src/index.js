import Node, { shape as nodeShape } from './Node';
import Edge, { shape as edgeShape } from './Edge';
import { checkProperties, lookForKey, ensureObjectsShape, buildEdges } from './lib';

export default function Giraffe(dataset, callback) {
  if (dataset && dataset.constructor === Function && !callback) {
    callback = dataset;
    dataset = {};
  }

  this.nodes = [];
  this.edges = [];
  this.labels = {
    edges: {},
    nodes: {}
  };
  this.callback = callback;

  /**
   * for both Nodes and Edges
   * check if dataset exists and if key is within it
   * Ensure correct shape for each object
   */
  if (lookForKey('nodes', dataset) && ensureObjectsShape(dataset.nodes, nodeShape)) this.nodes = dataset.nodes;
  if (lookForKey('edges', dataset) && ensureObjectsShape(dataset.edges, edgeShape)) this.edges = dataset.edges;

  /**
   * Build up this.labels object for Nodes
   */
  for (const idx in this.nodes) {
    const node = this.nodes[idx];
    if (!node.labels.length) continue;

    for (const idx in node.labels) {
      const label = node.labels[idx];

      if (!(label in this.labels.nodes)) this.labels.nodes[label] = [];
      this.labels.nodes[label].push(node.identity);
    }
  }

  /**
   * Build up this.labels object for Edges
   */
  for (const idx in this.edges) {
    const edge = this.edges[idx];
    if (!edge.label) throw new Error('All Edges need a label');
    const label = edge.label;

    if (!(label in this.labels.edges)) this.labels.edges[label] = [];
    this.labels.edges[label].push(edge.identity);
  }
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

  if (this.callback) this.callback('create', node);

  return node;
};

Giraffe.prototype.update = function nodes (nodes, labels, data) {
  if (nodes.constructor !== Array) nodes = [ nodes ];
  if (labels.constructor === Object) {
    data = labels;
    labels = null;
  }
  if (labels !== null && labels.constructor !== Array) labels = [ labels ];
  if (!data) data = {};

  for (const idx in nodes) {
    const node = nodes[idx];
    const isEdge = ('label' in node);

    if (isEdge && labels) throw new TypeError('Edge Labels cannot be changed.');
    if (labels) node.labels = node.labels.concat(...labels);

    node.properties = Object.assign({}, node.properties, data);
  }

  if (this.callback) this.callback('update', nodes);

  return nodes;
};

Giraffe.prototype.remove = function remove (nodes) {
  if (nodes.constructor !== Array) nodes = [ nodes ];

  for (const n in nodes) {
    const node = nodes[n];
    const { identity } = node;

    /**
     * Removes all of this node's edges
     * Removes all label -> edge references.
     */
    for (const e in node.edges) {
      const edgeId = node.edges[e];
      const edge = this.edges[edgeId];
      const { label, identity } = edge;

      if (label in this.labels.edges) {
        const idx = this.labels.edges[label].indexOf(identity);
        if (idx !== -1) this.labels.edges[label].splice(idx, 1);
      }

      /**
       * Remove the edge
       */
      this.edges[edgeId] = undefined;
    }

    /**
     * Remove this node from the labels properties.
     */
    for (const idx in node.labels) {
      const label = node.labels[idx];
      if (!(label in this.labels.nodes)) continue; // label does not exist

      const nodeIdx = this.labels.nodes[label].indexOf(identity);

      if (nodeIdx === -1) continue; // node index does not exist in label

      this.labels.nodes[label].splice(nodeIdx, 1);
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

  if (this.callback) this.callback('remove');
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

  if (this.callback) this.callback('edge', buildEdges.call(this, edges));

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
     * get count of edges being checked
     * loop through all edges, checking `this.labels.edges` for the edge ids,
     * then checking the corresponding edge from property.
     * if edge count is less than edge's being checked move on.
     */
    if (edgeCheck) {
      const edgeTotal = properties.edges.length;
      let count = 0;

      for (const idx in properties.edges) {
        const edgeName = properties.edges[idx];
        const internalNodeIdsFromEdge = [];

        if (!(edgeName in this.labels.edges)) continue; // edge is not known

        for (const idFromLabel in this.labels.edges[edgeName]) {
          const id = this.labels.edges[edgeName][idFromLabel];
          const edge = this.edges[id];

          if (!edge) continue; //edges can be undefined from the `remove` method.
          internalNodeIdsFromEdge.push(edge.from);
        }

        if (internalNodeIdsFromEdge.indexOf(node.identity) > -1) count++; // edge exists and is found
      }

      if (count < edgeTotal) continue; // Node does not have the edge and we move on. through our parent loop.
    }

    if (properties && !nodeContainsValidProps) continue;

    /**
     * Build our node object without a prototype (now Hash Objects);
     * loop through all the edges and create a circular reference to the node
     * bind the node and it's relationship to the same return
     * This works in a single degree of separation so a node can have an edge
     * to itself without stack-overflowing.
     */
    const returnObj = Object.assign({}, node);

    for (const edgeIdx in returnObj.edges) {
      const edgeId = returnObj.edges[edgeIdx];
      const edge = Object.assign({}, this.edges[edgeId]);
      const throughNode = this.nodes[edge.through];

      edge.through = Object.assign({}, throughNode);
      edge.from = returnObj;

      returnObj.edges[edgeIdx] = edge;
    }

    results.push(returnObj);
  }

  if (this.callback) this.callback('query', results);

  return results;
};
