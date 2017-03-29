import compose from './compose';

export default function cloneElement(element) {
  const props = 'properties' in element ? element.properties : undefined;

  return compose(
    element,
    props ?
    {
      properties: compose(props)
    } :
    undefined
  );
}
