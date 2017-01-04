export default function Node({ id, label, data }) {
  this.identity = id;
  this.properties = Object.assign({}, data);
  this.labels = label ? [ label ] : [];
  this.edges = [];
}

export const shape = {
  identity: Number,
  properties: Object,
  labels: Array,
  edges: Array
};
