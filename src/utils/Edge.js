import uuid from 'uuid';
import { isArray } from './isType';
import flatten from './flatten';
import compose from './compose';
import getLabels from './get-labels';
import getProperties from './get-properties';

const $type = 'Edge';

export default function Edge (nodeSetA, nodeSetB, lbl, props) {
  if (
    nodeSetA === undefined ||
    nodeSetA === null ||
    nodeSetB === undefined ||
    nodeSetB === null ||
    nodeSetA.length === 0 ||
    nodeSetB.length === 0
  ) {
    throw new Error('An Edge requires two sets of Nodes');
  }
  const labels = getLabels(lbl);
  const properties = getProperties(lbl, props);
  const setA = flatten(isArray(nodeSetA) ? nodeSetA : [ nodeSetA ]);
  const setB = flatten(isArray(nodeSetB) ? nodeSetB : [ nodeSetB ]);
  const returnArr = [];

  return setA.reduce((all, nodeA) => setB.reduce((all, nodeB) => {
    const { identity: from } = nodeA;
    const { identity: through } = nodeB;
    const identity = uuid();

    all.push(
      compose({
        $type,
        identity,
        labels,
        properties,
        from,
        through
      })
    );

    return all;
  }, returnArr), returnArr);
}

export { $type };
