const enumerable = true;

function nodeEquality(searchObj, node) {
  if (!searchObj) return true;

  const nodeKeys = [];

  for (const key in node) {
    nodeKeys.push(key);
  }

  for (const key in searchObj) {
    if (key === '_edges') {
      if (searchObj[key].constructor !== Array) searchObj[key] = [ searchObj[key] ];
      for (const edgeId in searchObj[key]) {
        const edgeName = searchObj[key][edgeId];

        if (nodeKeys.indexOf(edgeName) > -1) return true;
      }
    }
    if (!(key in node)) return false;
    if (searchObj[key] !== node[key]) return false;
  }

  return true;
}

function createObjFromNode(node) {
  const _node = Object.assign(
    Object.create(null),
    node
  );

  return _node;
}

function addDataToObj(obj, data) {
  if (!data) return obj;

  for (const key in data) {
    Object.defineProperty(obj, key, { enumerable, value: data[key] });
  }

  return obj;
}

export function mergePaths(label, properties, { nodes, edges/*, labels */ }) {
  const objects = [];

  for (const idx in nodes) {
    const node = nodes[idx];
    if (!node) continue;

    const obj = createObjFromNode(node);

    if (label && label !== obj.label) continue;

    for (const idx in obj._edges) {
      const edgeId = obj._edges[idx];
      const edge = edges[edgeId];

      if (!edge) continue;

      const { label } = edge;
      const throughNode = nodes[edge.through];

      if (!(label in obj)) obj[label] = [];

      obj[label].push(createObjFromNode(throughNode));
    }

    if (!nodeEquality(properties, obj)) continue;

    objects.push(obj);
  }

  return objects;
}

export function Node({ id, label, data }) {
  const obj = Object.create(null);
  const node = Object.defineProperties(obj, {
    _id: { enumerable, value: id },
    _edges: { enumerable, value: [] },
    label: { enumerable, value: label }
  });

  return addDataToObj(node, data);
}

export function Edge({ id, label, from, through, data }) {
  const obj = Object.create(null);
  const edge = Object.defineProperties(obj, {
    _id: { enumerable, value: id },
    from: { enumerable, value: from._id },
    through: { enumerable, value: through._id },
    label: { enumerable, value: label }
  });

  return addDataToObj(edge, data);
}
