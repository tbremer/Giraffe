import compose from './compose';

export default function getProperties(label, props) {
  let properties;

  if (label && !props && label.constructor === Object) properties = label;
  if (props && props.constructor !== Object) throw new TypeError('Properties must be an object');
  if (!properties) properties = props;

  return compose(properties);
}
