import Obj from '../Obj';

export default function Node({ id, label, data }) {
  const node = new Obj();

  node.identity = id;
  node.properties = Object.assign(new Obj(), data);
  node.labels = label ? [ label ] : [];
  node.edges = [];

  return node;
}
