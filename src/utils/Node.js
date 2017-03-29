import uuid from 'uuid';
import compose from './compose';
import getLabels from './get-labels';
import getProperties from './get-properties';

const $type = 'Node';
const edges = [];

export default function Node (lbl, props) {
  const identity = uuid();
  const labels = getLabels(lbl);
  const properties = getProperties(lbl, props);

  return compose({
    $type,
    identity,
    labels,
    edges,
    properties
  });
}
