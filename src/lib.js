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
