# GraphML Format Specification

XML-based format for graph serialization defined by GraphML specification (DTD
and XSD).

**Related Docs:** [GRAPHENGINE.md](GRAPHENGINE.md),
[TINKERPOP.md](TINKERPOP.md), [GRAPHSON.md](GRAPHSON.md), [GRYO.md](GRYO.md),
[GRAPHBINARY.md](GRAPHBINARY.md),
[CODE_ANALYZER_CONFIG.md](CODE_ANALYZER_CONFIG.md)

## Overview

GraphML: XML-based format for representing graph structures. TinkerGraph can
load/save graphs in GraphML format. Enables graph persistence and exchange.
Useful for testing and development. Conforms to GraphML DTD and XSD
specifications. Human-readable XML format.

## GraphML Document Structure

### Root Element: `<graphml>`

Root element containing namespace declarations, `<key>` elements (property
definitions), and `<graph>` elements (graph data). Keys must appear before
graphs. Multiple graphs allowed.

**Attributes:** `xmlns` (XML namespace, typically
`http://graphml.graphdrawing.org/xmlns`), `xmlns:xsi` (XML Schema instance
namespace), `xsi:schemaLocation` (Location of XSD schema)

**Example:**

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<graphml
    xmlns="http://graphml.graphdrawing.org/xmlns"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns
         http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd"
>
    <!-- keys and graphs -->
</graphml>
```

### Key Element: `<key>`

Defines property keys used in graph elements. Must appear before `<graph>`
elements. Optional `<desc>` and `<default>`.

**Attributes:** `id` (required, unique identifier), `for` (optional, element
type: `all`, `graph`, `node`, `edge`, default: `all`), `attr.name` (optional,
property name), `attr.type` (optional, data type: `string`, `int`, `long`,
`float`, `double`, `boolean`, default: `string`), `attr.list` (optional, whether
property is a list: `true`/`false`, default: `false`), `attr.domain` (optional,
domain specification)

**Example:**

```xml
<key id="name" for="node" attr.name="name" attr.type="string"/>
<key id="weight" for="edge" attr.name="weight" attr.type="double"/>
```

### Graph Element: `<graph>`

Represents a graph structure. Contains `<node>`, `<edge>`, `<hyperedge>`, and
`<data>` elements.

**Attributes:** `id` (optional, unique identifier), `edgedefault` (required,
default edge direction: `directed` or `undirected`), `parse.nodes`,
`parse.edges` (optional, hints for parsers to pre-allocate memory),
`parse.maxindegree`, `parse.maxoutdegree` (optional, hints for optimizing data
structures), `parse.nodeids`, `parse.edgeids` (optional, ID type: `canonical` =
sequential integers starting at 0, `free` = arbitrary IDs), `parse.order`
(optional, element ordering: `nodesfirst`, `edgesfirst`, `adjacencylist`)

### Node Element: `<node>`

Represents a vertex. Contains `<data>` elements for properties, optional
`<port>` elements (for hyperedges), optional nested `<graph>` (for hierarchical
graphs).

**Attributes:** `id` (required, unique identifier)

**Example:**

```xml
<node id="1">
    <data key="name">Vertex 1</data>
    <data key="type">Person</data>
</node>
```

### Edge Element: `<edge>`

Represents an edge connecting two nodes. Contains `<data>` elements for
properties, optional nested `<graph>`.

**Attributes:** `id` (optional, unique identifier), `source` (required, ID of
source node), `target` (required, ID of target node), `directed` (optional,
whether edge is directed: `true`/`false`, defaults to `edgedefault` from graph)

**Example:**

```xml
<edge id="e1" source="1" target="2">
    <data key="weight">1.5</data>
</edge>
```

### Hyperedge Element: `<hyperedge>`

Represents hyperedge connecting multiple nodes (n-ary relationship). Contains
`<endpoint>` elements, `<data>` elements, optional nested `<graph>`.

**Attributes:** `id` (optional, unique identifier)

### Endpoint Element: `<endpoint>`

Represents connection point in hyperedge. Specifies which node and port the
hyperedge connects to.

**Attributes:** `id` (optional, unique identifier), `node` (required, ID of
connected node), `port` (optional, port name on the node)

### Port Element: `<port>`

Represents port on a node (connection point for hyperedges). Used in
hierarchical graphs and hyperedge connections.

**Attributes:** `name` (required, port name/identifier)

### Data Element: `<data>`

Contains property value for graph, node, or edge. References a `<key>` element
via `key` attribute. Can contain text content or nested elements.

**Attributes:** `key` (required, ID of corresponding `<key>` element)

### Desc/Default Elements

- `<desc>`: Optional description element (text content)
- `<default>`: Optional default value element (text content, used in `<key>`
  elements)

## Complete GraphML Example

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<graphml
    xmlns="http://graphml.graphdrawing.org/xmlns"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns
         http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd"
>
    <key id="name" for="node" attr.name="name" attr.type="string" />
    <key id="weight" for="edge" attr.name="weight" attr.type="double" />
    <graph id="G" edgedefault="directed">
        <node id="1">
            <data key="name">Vertex 1</data>
        </node>
        <node id="2">
            <data key="name">Vertex 2</data>
        </node>
        <edge id="e1" source="1" target="2">
            <data key="weight">1.5</data>
        </edge>
    </graph>
</graphml>
```

## TinkerPop GraphML Support

**GraphMLReader:** Reads GraphML files into TinkerPop graphs, parses all GraphML
elements, handles property key definitions, supports all GraphML data types.
Builder: `GraphMLReader.build().create()`. Methods:
`readGraph(InputStream|File|URL, Graph)`. **Limitation:** Does not fully support
hyperedges and ports (simplified to regular edges).

**GraphMLWriter:** Writes TinkerPop graphs to GraphML format, generates valid
GraphML documents, includes property key definitions. Builder:
`GraphMLWriter.build().normalize(boolean).xmlMapper(XMLMapper).create()`.
Methods: `writeGraph(OutputStream|File|URL, Graph)`. Configuration: `normalize`
(default: false), `xmlMapper` (custom XML mapper). **Limitation:** Does not
support hyperedges and ports (converts to regular edges).

**Usage:**

```java
Graph graph = TinkerGraph.open();
GraphReader reader = GraphMLReader.build().create();
reader.readGraph(new FileInputStream("graph.graphml"), graph);

GraphWriter writer = GraphMLWriter.build().create();
writer.writeGraph(new FileOutputStream("graph.graphml"), graph);
```

**Limitations:** Does not support meta-properties (vertex properties on vertex
properties) as GraphML specification does not define this concept. Hyperedges
and ports are simplified to regular edges in TinkerPop implementation.

## DTD Specification

Document Type Definition (DTD) defines structure and validation rules.

**Element Definitions:**

- `<!ELEMENT graphml (key*,graph*)>`: Root element (keys before graphs, multiple
  graphs allowed)
- `<!ELEMENT key (desc?,default?)>`: Property key definition
- `<!ELEMENT graph (data*,node*,edge*,hyperedge*)>`: Graph structure
- `<!ELEMENT node (data*,port*,graph?)>`: Vertex (can contain nested graph,
  ports)
- `<!ELEMENT edge (data*,graph?)>`: Edge connecting two nodes
- `<!ELEMENT hyperedge (data*,endpoint*,graph?)>`: Hyperedge connecting multiple
  nodes
- `<!ELEMENT endpoint (data*,port?)>`: Connection point in hyperedge
- `<!ELEMENT port (data*,graph?)>`: Port on a node
- `<!ELEMENT data (#PCDATA|desc|default)*>`: Property value
- `<!ELEMENT desc (#PCDATA)>`: Description element
- `<!ELEMENT default (#PCDATA)>`: Default value element

**Attribute Definitions:**

- `key`: `id` (required, ID), `for` (optional, `all|graph|node|edge`, default:
  `all`), `attr.name`, `attr.type` (optional,
  `string|int|long|float|double|boolean`, default: `string`), `attr.list`
  (optional, `true|false`, default: `false`), `attr.domain` (optional)
- `graph`: `id` (optional, ID), `edgedefault` (required, `directed|undirected`),
  parsing attributes (optional)
- `node`: `id` (required, ID)
- `edge`: `id` (optional, ID), `source` (required, IDREF), `target` (required,
  IDREF), `directed` (optional, `true|false`, defaults to graph `edgedefault`)
- `data`: `key` (required, IDREF)
- `endpoint`: `id` (optional, ID), `node` (required, IDREF), `port` (optional,
  NMTOKEN)
- `port`: `name` (required, NMTOKEN)

## XSD Specification

XML Schema Definition (XSD) provides schema validation. More expressive than DTD
(data types, constraints), defines element/attribute types, supports namespace
validation.

**Complex Types:**

- `graphml.type`: Root element type (sequence of `key.type` and `graph.type`,
  keys before graphs)
- `key.type`: Key element type (optional `desc` and `default`, attributes: `id`
  (required, ID), `for` (optional, `key.for.type`, default: `all`), `attr.name`,
  `attr.type` (optional, `key.attr.type.type`, default: `string`), `attr.list`
  (optional, boolean, default: `false`), `attr.domain`)
- `graph.type`: Graph element type (sequence of `data.type`, `node.type`,
  `edge.type`, `hyperedge.type`, attributes: `id` (optional, ID), `edgedefault`
  (required, `graph.edgedefault.type`), parsing attributes)
- `node.type`: Node element type (sequence of `data.type`, `port.type`, optional
  `graph.type`, attributes: `id` (required, ID))
- `edge.type`: Edge element type (sequence of `data.type`, optional
  `graph.type`, attributes: `id` (optional, ID), `source` (required, IDREF),
  `target` (required, IDREF), `directed` (optional, `edge.directed.type`))
- `hyperedge.type`: Hyperedge element type (sequence of `data.type`,
  `endpoint.type`, optional `graph.type`, attributes: `id` (optional, ID))
- `endpoint.type`: Endpoint element type (sequence of `data.type`, optional
  `port.type`, attributes: `id` (optional, ID), `node` (required, IDREF), `port`
  (optional, NMTOKEN))
- `port.type`: Port element type (sequence of `data.type`, optional
  `graph.type`, attributes: `name` (required, NMTOKEN))
- `data.type`: Data element type (mixed content: text, `desc`, `default`,
  attributes: `key` (required, IDREF))
- `desc.type`: Description element type (text content)
- `default.type`: Default value element type (text content)

**Simple Types:**

- `key.for.type`: Enumeration (`all`, `graph`, `node`, `edge`, default: `all`)
- `key.attr.type.type`: Enumeration (`string`, `int`, `long`, `float`, `double`,
  `boolean`, default: `string`)
- `graph.edgedefault.type`: Enumeration (`directed`, `undirected`, required)
- `edge.directed.type`: Boolean (`true`/`false`, optional, overrides graph
  `edgedefault`)

**Attribute Groups:**

- `graph.extra.attrib`, `node.extra.attrib`, `edge.extra.attrib`: Extension
  attributes for extension namespaces

## Validation Rules

**Document-Level:** Key IDs must be unique, keys must be defined before use,
multiple graphs allowed.

**Graph-Level:** Graph `id` must be unique if specified, `edgedefault` required,
node/edge/hyperedge IDs must be unique within graph, port names must be unique
within each node.

**Node Rules:** Node `id` required and unique within graph, must be valid XML
ID.

**Edge Rules:** `source` and `target` required, must reference existing node IDs
(IDREF constraint), `directed` overrides graph `edgedefault` if specified.

**Hyperedge Rules:** `id` must be unique if specified, must contain at least one
`<endpoint>`, endpoint `node` required and must reference existing node ID,
endpoint `port` must reference existing port name if node has ports.

**Port Rules:** `name` required and unique within node, must be valid XML
NMTOKEN.

**Data Rules:** `key` required, must reference defined key ID (IDREF
constraint), value type must match key's `attr.type` if specified.

**Type Validation:** String values (any text), integer/long (valid integer
format), float/double (valid floating-point format), boolean (`true` or `false`,
case-sensitive), list values (multiple values separated by whitespace when
`attr.list="true"`).

## Namespace Support

**Default namespace:** `http://graphml.graphdrawing.org/xmlns`

**XML Schema namespace:** `http://www.w3.org/2001/XMLSchema`

**XML Schema Instance namespace:** `http://www.w3.org/2001/XMLSchema-instance`

**Extension Namespaces:** Supports extension namespaces for custom
elements/attributes. Custom attributes in extension namespaces allowed on all
elements. Custom elements in extension namespaces allowed (must not conflict
with core elements). Maintains compatibility with core specification when
extensions used.

## Extension Points

GraphML allows custom extensions via namespaces: additional elements in
extension namespaces, custom attributes on standard elements, extension elements
can appear in standard element content where appropriate. Maintains backward
compatibility: core parsers ignore unknown extension elements/attributes.
Extension elements should follow GraphML structure patterns for consistency.
