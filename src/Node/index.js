export default function Node({ id, label, data }) {
  if (!id && id !== 0) throw new Error(`All Node's require an id`);
  this.identity = id;
  this.properties = Object.assign({}, data);
  this.labels = label ? label.constructor === Array ? label : [ label ] : [];
  this.edges = [];
}

export const shape = {
  identity: Number,
  properties: Object,
  labels: Array,
  edges: Array
};
