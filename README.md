Giraffe
---
_A simple node/browser graph database_

[![Travis CI](https://img.shields.io/travis/tbremer/Giraffe.svg?style=flat-square)](https://travis-ci.org/tbremer/Giraffe)
[![Version](https://img.shields.io/npm/v/Giraffe.svg?style=flat-square)](https://www.npmjs.com/package/Giraffe)
[![NPM Downloads](https://img.shields.io/npm/dm/Giraffe.svg?style=flat-square)](https://www.npmjs.com/package/Giraffe)
[![LICENSE](https://img.shields.io/npm/l/Giraffe.svg?style=flat-square)](https://github.com/tbremer/Giraffe/blob/master/LICENSE)

## Methods
- `new Giraffe()`
  - **`data`**: `Object` _Optional_

- `.create(label, data)`
  - **`label`**: `String` _Optional_
  - **`data`**: `Object`

- `.remove(nodes)`
  - **`nodes`**: `Array` _Array of Nodes to be removed from graph_
    - _this is automatically converted to an Array if a single node is sent in._

- `.edge([ from ], [ to ], label, properties)`
  - **`from`: `Array` _Array of Nodes where edge originates_
  - **`to`: `Array` _Array of Nodes where edge goes_
  - **`label`**: `String` _Optional_
  - **`properties`**: `Object` _Optional_

- `.query(label, properties)`
  - **`label`**: `String` _Optional_
  - **`properties`**: `Object` _Optional_
    - you can search for an edge with the property key `_edges`
  - _An empty query returns all nodes_
  - _Queries return only their immediate relationships_


## Internal Structure
```javascript
{
  /**
   * All relationships with additional properties
   */
  edges: [],

  /**
   * All nodes with properties
   */
  nodes: [],

  /**
   * Dynamic key:value store for tracking known node and edge labels
   */
  labels: {
    [label]: [/* Array of ids */]
  }
}
```

### Node
```javascript
{
  _id: Number,
  ...properties,
}
```


### Edge
```Javascript
{
  _id: Number,
  _from: Node,
  _through: Node,
  ...properties
}
```
