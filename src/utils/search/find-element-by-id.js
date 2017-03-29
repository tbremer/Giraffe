import needleInHaystack from './needle-in-haystack';

export default function findElementById(id, group) {
  return needleInHaystack('identity', id, group);
}
