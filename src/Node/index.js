import Obj from '../Obj';

export default function Node({ id, label, data }) {
  this.identity = id;
  this.properties = Object.assign(new Obj(), data);
  this.labels = label ? [ label ] : [];
  this.edges = [];
}
