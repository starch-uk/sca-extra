# GraphBinary Format Specification

Compact binary format for graph serialization optimized for network transfer.

**Related Docs:** [GRAPHENGINE.md](GRAPHENGINE.md),
[TINKERPOP.md](TINKERPOP.md), [GRAPHML.md](GRAPHML.md),
[GRAPHSON.md](GRAPHSON.md), [GRYO.md](GRYO.md),
[CODE_ANALYZER_CONFIG.md](CODE_ANALYZER_CONFIG.md)

## Overview

GraphBinary: compact binary format optimized for network transfer and Gremlin
Server. Version v1.0. More efficient than GraphSON for large graphs. Supports
all TinkerPop data types. Not human-readable. Requires schema knowledge for some
type information modes.

## TinkerPop GraphBinary Support

**Builder Pattern:**

```java
GraphBinaryReader reader = GraphBinaryReader.build()
    .typeInfo(TypeInfo.PARTIAL)
    .serializeResultToString(false)
    .create();

GraphBinaryWriter writer = GraphBinaryWriter.build()
    .typeInfo(TypeInfo.PARTIAL)
    .serializeResultToString(false)
    .create();
```

**Methods:** `readGraph(InputStream|File|URL, Graph)`,
`writeGraph(OutputStream|File|URL, Graph)`

**Configuration:**

- `typeInfo(TypeInfo)`: `NONE` (no type info, requires schema), `PARTIAL`
  (complex types only, recommended), `FULL` (complete type info,
  self-describing)
- `serializeResultToString(boolean)`: Serialize as strings (default: `false`)

**Usage:**

```java
Graph graph = TinkerGraph.open();
GraphBinaryWriter writer = GraphBinaryWriter.build().typeInfo(TypeInfo.PARTIAL).create();
writer.writeGraph(new File("graph.graphbinary"), graph);

GraphBinaryReader reader = GraphBinaryReader.build().typeInfo(TypeInfo.PARTIAL).create();
reader.readGraph(new File("graph.graphbinary"), graph);
```

## Format Structure

**Header:** Version (1 byte) + format identifier

**Type Codes (Single-byte):** | Category | Types | Codes |
|----------|-------|-------| | Graph Elements | Vertex, Edge, VertexProperty,
Property | 0x01-0x04 | | Path Types | Path, Set, List, Map | 0x05-0x08 | |
Primitives | String, Date, Timestamp, UUID | 0x09-0x0C | | Numeric | Double,
Float, Integer, Long, BigInteger, BigDecimal | 0x0D-0x12 | | Other | Boolean,
Null, ByteBuffer, Byte, Short, Class, Duration, Char | 0x13-0x1A |

**Value Encoding:** Variable-length encoding (integers, strings), size-prefixed
collections, key-value pair maps. Optimizations: dictionary-based string
compression, efficient numeric encoding, network optimizations.

## Type Information Modes

| Mode      | Type Info          | Schema Required | File Size | Performance | Use Cases                                                    |
| --------- | ------------------ | --------------- | --------- | ----------- | ------------------------------------------------------------ |
| `NONE`    | None               | Yes             | Smallest  | Fastest     | Known schema, internal systems, max performance              |
| `PARTIAL` | Complex types only | No              | Medium    | Good        | Recommended, network transfer, Gremlin Server                |
| `FULL`    | All values         | No              | Largest   | Good        | Unknown schema, interoperability, debugging, max type safety |

**Important:** Reader and writer must use compatible modes. `NONE` requires
matching schema knowledge.

## Version Information

**Current:** v1.0 (only version). No migration required. Stable format.

## Performance Considerations

**Optimization Tips:** Use `PARTIAL` for best balance (recommended), `NONE` for
max performance when schema known, `FULL` only when necessary for type safety,
consider compression for storage.

**File Size:** More compact than GraphSON for large graphs, more efficient than
GraphML. Mode affects size: `NONE` < `PARTIAL` < `FULL`.

**Speed:** Fast serialization/deserialization, optimized for network transfer,
efficient binary encoding, low overhead.

**Memory:** Low overhead, efficient binary representation, streaming support for
large graphs.

**General Performance:** See
[TINKERPOP.md](TINKERPOP.md#general-performance-considerations) for format
comparison and general optimization tips.

## Configuration Best Practices

**Reading:** Max Performance: `typeInfo(TypeInfo.NONE)` (requires schema),
Balanced (Recommended): `typeInfo(TypeInfo.PARTIAL)`, Max Flexibility:
`typeInfo(TypeInfo.FULL)`

**Writing:** Same as reading. Ensure compatible modes between reader/writer.

**General Configuration:** See
[TINKERPOP.md](TINKERPOP.md#general-configuration-best-practices) for general
configuration best practices across all formats.

## Error Handling

**Format-Specific Issues:** Type information mismatch (use compatible modes),
schema mismatch with `NONE` mode (ensure matching schema), invalid binary data
(corrupted files cause deserialization errors), type code errors (invalid codes
cause parsing errors).

**Format-Specific Best Practices:** Use `PARTIAL` mode for most scenarios,
ensure schema compatibility with `NONE` mode, validate files after writing,
handle IOException appropriately.

**General Error Handling:** See
[TINKERPOP.md](TINKERPOP.md#general-error-handling-patterns) for common error
handling patterns across all formats.

## Examples

**Complete Example:**

```java
Graph graph = TinkerGraph.open();
Vertex alice = graph.addVertex(T.label, "person", "name", "Alice", "age", 30);
Vertex bob = graph.addVertex(T.label, "person", "name", "Bob", "age", 25);
alice.addEdge("knows", bob, "weight", 0.5);

GraphBinaryWriter writer = GraphBinaryWriter.build().typeInfo(TypeInfo.PARTIAL).create();
writer.writeGraph(new File("graph.graphbinary"), graph);

Graph readGraph = TinkerGraph.open();
GraphBinaryReader reader = GraphBinaryReader.build().typeInfo(TypeInfo.PARTIAL).create();
reader.readGraph(new File("graph.graphbinary"), readGraph);
```

**Streaming:**

```java
try (FileInputStream fis = new FileInputStream("graph.graphbinary");
     BufferedInputStream bis = new BufferedInputStream(fis, 65536)) {
    GraphBinaryReader reader = GraphBinaryReader.build().typeInfo(TypeInfo.PARTIAL).create();
    reader.readGraph(bis, graph);
}
```

## File Extensions

`.graphbinary` (standard), `.gb` (less common). Extensions are conventions
only - format identified by binary structure and header.

## Limitations

Not human-readable (binary format), requires schema knowledge for `NONE` mode,
cannot be edited with text editors, requires TinkerPop libraries, type
information mode affects compatibility, platform-dependent (Java-specific).

**Workarounds:** Use GraphML/GraphSON for human-readable formats, use
`PARTIAL`/`FULL` when schema unknown, consider compression.

## Type Code Reference

| Type           | Code | Description                          |
| -------------- | ---- | ------------------------------------ |
| Vertex         | 0x01 | Graph vertex element                 |
| Edge           | 0x02 | Graph edge element                   |
| VertexProperty | 0x03 | Vertex property with meta-properties |
| Property       | 0x04 | Element property                     |
| Path           | 0x05 | Traversal path                       |
| Set            | 0x06 | Set collection                       |
| List           | 0x07 | List collection                      |
| Map            | 0x08 | Map collection                       |
| String         | 0x09 | String primitive                     |
| Date           | 0x0A | Date type                            |
| Timestamp      | 0x0B | Timestamp type                       |
| UUID           | 0x0C | UUID type                            |
| Double         | 0x0D | Double numeric type                  |
| Float          | 0x0E | Float numeric type                   |
| Integer        | 0x0F | Integer numeric type                 |
| Long           | 0x10 | Long numeric type                    |
| BigInteger     | 0x11 | BigInteger numeric type              |
| BigDecimal     | 0x12 | BigDecimal numeric type              |
| Boolean        | 0x13 | Boolean type                         |
| Null           | 0x14 | Null value                           |
| ByteBuffer     | 0x15 | Byte buffer collection               |
| Byte           | 0x16 | Byte numeric type                    |
| Short          | 0x17 | Short numeric type                   |
| Class          | 0x18 | Class type                           |
| Duration       | 0x19 | Duration type                        |
| Char           | 0x1A | Character type                       |

## Format Comparison

**See [TINKERPOP.md](TINKERPOP.md#detailed-format-comparisons) for detailed
comparisons with other formats.**
