import { isArray } from './isType';

export default function flatten(arr, flat = []) {
  // if array is empty, it's flat and return;
  if (!arr.length) return flat;

  // get first element from array
  const [ head, ...tail ] = arr;

  // if the HEAD is also and array, flatten it and add to back of flat.
  // call with the now updated array
  if (isArray(head)) return flatten(tail, flat.concat(flatten(head)));

  // add value to back of flat and call with the now updated array
  return flatten(tail, flat.concat(head));
}
