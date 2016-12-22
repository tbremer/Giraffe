GRAFF
---

_A simple node/browser graph database_

## Methods

- `new Graff()`
	- **`data`**: `Object` _Optional_

- `.create(label, data)`
	- **`label`**: `String` _Optional_
	- **`data`**: `Object`

- `.edge(label, properties)`
	- **`label`**: `String` _Optional_
	- **`properties`**: `Object`

- `.remove(node)`
	- **`node`**: `Object` _Node to be removed from graph_

- `.removeEdge(edge)`
	- **`edge`**: `Object` _Edge to be removed from between two nodes_

- `.query(label, properties)`
	- **`label`**: `String` _Optional_
	- **`properties`**: `Object`


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
