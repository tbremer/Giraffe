export function checkProperties(node, properties) {
  const { properties: props } = node;

  /**
   * Property Checking
   * skip if key is `edge` since that is checked before.
   * check if key exists
   * check if key's value is the same as the node's value
   */
  for (const key in properties) {
    if (key === 'edges') continue;
    if (!(key in props)) return false;
    if (props[key] !== properties[key]) return false;
  }

  return true;
}

/**
 * Ensure data exists and
 * Ensure key is in data
 */
export function lookForKey(key, data) {
  return data && key in data;
}

/**
 * Loop through array of objects to check
 * all objects contain the correct keys and
 * all values have the same constructors
 */
export function ensureObjectsShape(objects, shape) {
  if (objects.constructor !== Array) throw new Error('Objects needs to be an array');
  for (const idx in objects) {
    const object = objects[idx];

    for (const key in shape) {
      if (!(key in object) || object[key].constructor !== shape[key]) {
        throw new Error(`Incorrect shape for ${JSON.stringify(object)}`);
      }
    }
  }

  return true;
}
