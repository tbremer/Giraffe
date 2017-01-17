const validConstructors = [ String, Number ];

function testConstructor(type) {
  return validConstructors.indexOf(type.constructor) > -1;
}

export default function Edge({ from, through, id, data, label }) {
  if (!label || !testConstructor(label)) throw new Error('All Edges need a single Label');

  this.identity = id;
  this.from = from.identity;
  this.through = through.identity;
  this.label = label;
  this.properties = Object.assign({}, data);
}

export const shape = {
  identity: validConstructors,
  properties: Object,
  label: String,
  from: validConstructors,
  through: validConstructors
};
