Giraffe
---
_A simple node & browser graph database_

[![Travis CI](https://img.shields.io/travis/tbremer/Giraffe.svg?style=flat-square)](https://travis-ci.org/tbremer/Giraffe)
[![Version](https://img.shields.io/npm/v/giraffe.svg?style=flat-square)](https://www.npmjs.com/package/giraffe)
[![NPM Downloads](https://img.shields.io/npm/dm/giraffe.svg?style=flat-square)](https://www.npmjs.com/package/giraffe)
[![LICENSE](https://img.shields.io/npm/l/giraffe.svg?style=flat-square)](https://github.com/tbremer/Giraffe/blob/master/LICENSE)

## Install
```shell
npm install --save giraffe
```

## Use
```javascript
import Giraffe from 'giraffe';

const db = new Giraffe();

export default db;
```

## Methods
- `new Giraffe(data, callback)`
  - **`data`**: `Object` _Optional_
    - _Should be in the shape of `{ nodes: [], edges: [] }`_
    - _Labels are created dynamically based on data passed in_
    - _`Nodes` and `Edges` are checked for their correct shape._
  - **`callback`**: `Function` _Optional_
    - _Can be passed first if no data is supplied_
    - _Callback is called just before returning on each Database Method_
  - Create the DB instance


- `.create(label, data)`
  - **`label`**: `String` || `Array` _Optional_
  - **`data`**: `Object`
  - _`label` is type checked and coerced into a Array within the `Node` constructor_


- `.remove(nodes)`
  - **`nodes`**: `Array` _Array of Nodes to be removed from graph_
    - _this is automatically converted to an Array if a single node is passed in._


- `.edge([ from ], [ to ], label, properties)`
  - **`from`** `Array` _Array of Nodes where edge originates_
  - **`to`**: `Array` _Array of Nodes where edge goes_
  - **`label`**: `String` _Optional_
  - **`properties`**: `Object` _Optional_


- `.query(label, properties)`
  - **`label`**: `String` _Optional_
  - **`properties`**: `Object` _Optional_
    - you can search for an edge with the property key `_edges`
  - _An empty query returns all nodes_
  - _Queries return only their immediate relationships_


- `.update([ nodes ], [ labels ], data)`
  - **`nodes`**: `Array` (or single) node to be updated
  - **`labels`**: `Array` (or single) label to be added to Nodes.
  - **`data`**: `Object` Data set to be merged with previous data, any duplicate keys will be overwritten.
  - _edge labels cannot be updated, an error will be thrown_

## Internal Structure

### Database
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
    nodes: {
      [label]: [/* Array of Node ids */]
    },
    edges: {
      [label]: [/* Array of Edge ids */]
    }

  }
}
```

### Callback
The `callback` passed to your DB instance is called before the return statement of every method. That is to say `db.create` returns the created `Node`, but just before that return you `callback` is fired.

The calls are all identical it is called with the `Type` of request and the modified, added, or removed data.

| method | type     | data                            |
| ------ | -------- | ------------------------------- |
| Create | 'create' | `Node`                          |
| Remove | 'remove' | Array[`Node`]                   |
| Edge   | 'edge'   | Array[`Edge`]                   |
| Query  | 'query'  | Array[`Query Result`]           |
| Update | 'update' | Array[`Updated Nodes / Edges`]  |

### Node
```javascript
{
  identity: <UUID />,
  properties: Object,
  labels: Array,
  edges: Array,
}
```

#### Node information
- `properties` is the object passed into the `db.create` method.
- `edges` is an array of Edge identity's before a query, after a query it is an array of references to the `Node`'s they represent

### Edge
```javascript
{
  identity: <UUID />,
  from: <Node Identity /> || <Node />,
  through: <Node Identity /> || <Node />,
  label: String,
  properties: Object
}
```

#### Edge information
- `properties` is the object passed into the `db.edge` method.
- `from` and `through` are stored in the DB as `from.identity` and `through.identity`.
- When `db.query` returns `from` and `through` are references to the `Node`'s they represent

## Coming Features
Checkout out the [TODO Project](https://github.com/tbremer/Giraffe/projects/1) on Github.
1. Complex Queries.
1. Investigate Typescript.
