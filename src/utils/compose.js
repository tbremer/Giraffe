/**
 * Merge one or more prototype onto a null object
 * @method compose
 * @param  {Array} prototypes zero or more prototypes
 * @return {Object}           null object of prototypes
 */
export default function compose(...prototypes) {
  return Object.assign(
    Object.create(null),
    ...prototypes
  );
}
