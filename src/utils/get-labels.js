export default function getLabels(label) {
  if (!label || label.constructor === Object) return [];
  if (label.constructor !== Array && (label.constructor !== String && label.constructor !== Number)) throw new TypeError('Label must be an Array, String, or Number');
  if (label.constructor !== Array) return [ label ];

  return label;
}
