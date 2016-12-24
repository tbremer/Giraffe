const writable = true;
const enumerable = true;

function nodeEquality(searchObj, node) {
  if (!searchObj) return true;

  for (const key in searchObj) {
    if (!(key in node)) return false;
    if (searchObj[key] !== node[key]) return false;
  }

  return true;
}

function generateNode(node) {
  return Object.assign(Object.create(null), node);
}

export function mergePaths(label, properties, { nodes, edges, labels }) {
  const objects = [];

  for (const idx in nodes) {
    const node = nodes[idx];

    if (label && label !== node.label) continue;
    if (!nodeEquality(properties, node)) continue;

    const obj = generateNode(node);

    for (const idx in node._edges) {
      const edgeId = node._edges[idx];
      const edge = edges[edgeId];
      const { label } = edge;
      const throughNode = nodes[edge.through];

      if (!(label in obj)) obj[label] = [];

      obj[label].push(generateNode(throughNode));
    }

    objects.push(obj);
  }

  return objects;
}

export function Node({id, label, data}) {
  const obj = Object.create(null);
  const node = Object.defineProperties(obj, {
    _id: { value: id, enumerable },
    _edges: { value: [], writable },
    label: { value: label, enumerable }
  });

  for (const key in data) {
    Object.defineProperty(node, key, { value: data[key], enumerable })
  }

  return node;
}

export function Edge({ id, label, from, through, data }) {
  const obj = Object.create(null);
  const edge = Object.defineProperties(obj, {
    _id: { value: id },
    from: { value: from._id },
    through: { value: through._id },
    label: { value: label }
  });

  for (const key in data) {
    Object.defineProperty(edge, key, { value: data[key] })
  }

  return edge;
}
