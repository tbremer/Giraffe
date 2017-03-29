import compose from './utils/compose';
import cloneArr from './utils/clone-array';
import cloneElement from './utils/clone-element';
import flatten from './utils/flatten';
import findElementById from './utils/search/find-element-by-id';
import { default as createNode } from './utils/Node';

export default function Giraffe() {
  const nodes = [];
  const edges = [];
  const middlewares = [ buildNodes ];

  function buildNodes(action, state) {
    const builtNodes = flatten(cloneArr(state)).reduce((all, curr) => {
      const node = cloneElement(curr);

      if (node.$type === 'Node') {
        node.edges = node.edges.reduce((all, curr) => {
          const ogEdge = findElementById(curr, edges);

          if (!ogEdge) throw new Error(`Cannot find edge with id: ${curr}`);

          const ogFrom = findElementById(ogEdge.from, nodes);
          const ogThrough = findElementById(ogEdge.through, nodes);

          if (!ogFrom) throw new Error(`Cannot find from Node on edge ${ogEdge.from}`);
          if (!ogThrough) throw new Error(`Cannot find through Node on edge ${ogEdge.from}`);

          const edge = cloneElement(ogEdge);
          const from = ogFrom.identity === node.identity ? node : buildNodes(ogFrom);
          const through = ogThrough.identity === node.identity ? node : buildNodes(ogThrough);

          all.push(compose(edge, { from, through }));

          return all;
        }, []);
      }

      if (node.$type === 'Edge') {
        const ogFrom = findElementById(node.from, nodes);
        const ogThrough = findElementById(node.through, nodes);

        if (!ogFrom) throw new Error(`Cannot find Edge\'s (${node.identity}) from point: ${node.from}`);
        if (!ogThrough) throw new Error(`Cannot find Edge\'s (${node.identity}) from point: ${node.through}`);

        node.from = ogFrom.identity === node.identity ? node : buildNodes(ogFrom);
        node.through = ogThrough.identity === node.identity ? node : buildNodes(ogThrough);
      }

      all.push(node);

      return all;
    }, []);

    if (action === 'Create') return builtNodes[0];

    return builtNodes;
  }

  function use(action, data) {
    let index = -1;

    function next() {
      index++;
      const middleware = middlewares[index];

      if (!middleware) return buildNodes(data);

      return middleware(action, data, next);
    }

    return next();
  }

  return compose({
    create(...args) {
      const created = createNode(...args);

      nodes.push(created);

      return use('Create', created);
    },
    edge() {},
    use(...callbacks) {
      middlewares.splice(-1, 0, ...callbacks);
    }
  });
}
