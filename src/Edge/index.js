import Obj from '../Obj';

const validConstructors = [ String, Number ];

function testConstructor(type) {
  return validConstructors.indexOf(type.constructor) > -1;
}

export default function Edge({ from, through, id, data, label }) {
  if (!label || !testConstructor(label)) throw new Error('All Edges need a single Label');

  const edge = new Obj();

  edge.identity = id;
  edge.from = from.identity;
  edge.through = through.identity;
  edge.label = label;
  edge.properties = Object.assign(new Obj(), data);

  return edge;
}
