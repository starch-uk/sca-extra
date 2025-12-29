# GraphSON Format Specification

JSON-based format for graph serialization used by Apache TinkerPop.

**Related Docs:** [GRAPHENGINE.md](GRAPHENGINE.md),
[TINKERPOP.md](TINKERPOP.md), [GRAPHML.md](GRAPHML.md), [GRYO.md](GRYO.md),
[GRAPHBINARY.md](GRAPHBINARY.md),
[CODE_ANALYZER_CONFIG.md](CODE_ANALYZER_CONFIG.md)

## Overview

GraphSON: JSON-based format for graph serialization. Multiple versions (v1, v2,
v3) with different schemas. Compact and efficient for network transfer. Primary
format for Gremlin Server communication. Supports typed and untyped property
values. Human-readable JSON format. Suitable for API communication and web
applications.

## GraphSON Versions

**GraphSON v1:** Original format, untyped properties, simple structure, basic
JSON representation of graph elements. Use cases: legacy systems, simple graph
representations, when type information is not required.

**GraphSON v2:** Typed properties, includes meta-properties (vertex properties
on vertex properties), more structured format, better type preservation. Use
cases: when type information is important, complex property structures,
meta-property support required.

**GraphSON v3:** Compact format, optimized for network transfer, typed
properties, improved efficiency over v2. Use cases: Gremlin Server
communication, network transfer scenarios, high-performance requirements, modern
applications.

## TinkerPop GraphSON Support

**Builder Pattern:**

```java
GraphSONReader reader = GraphSONReader.build()
    .version(GraphSONVersion.V3_0)
    .mapper(new ObjectMapper())
    .create();

GraphSONWriter writer = GraphSONWriter.build()
    .version(GraphSONVersion.V3_0)
    .embedTypes(true)
    .includeNullProperties(false)
    .normalize(false)
    .mapper(new ObjectMapper())
    .create();
```

**Reader Methods:** `readGraph(InputStream|File|URL, Graph)`

**Writer Methods:** `writeGraph(OutputStream|File|URL, Graph)`

**Configuration:**

- `version(GraphSONVersion)`: GraphSON version (v1, v2, v3) - must match writer
  version
- `mapper(ObjectMapper)`: Custom JSON mapper for parsing/generation (Jackson
  ObjectMapper)
- `embedTypes(boolean)`: Include type information in serialization (default:
  `false` for v1, `true` for v2/v3)
- `includeNullProperties(boolean)`: Include null property values (default:
  `false`)
- `normalize(boolean)`: Normalize property keys (default: `false`)

**Usage:**

```java
Graph graph = TinkerGraph.open();
GraphSONReader reader = GraphSONReader.build()
    .version(GraphSONVersion.V3_0)
    .mapper(new ObjectMapper())
    .create();
reader.readGraph(new File("graph.json"), graph);

GraphSONWriter writer = GraphSONWriter.build()
    .version(GraphSONVersion.V3_0)
    .embedTypes(true)
    .includeNullProperties(false)
    .create();
writer.writeGraph(new File("graph.json"), graph);
```

## Version Compatibility

**Important:** GraphSON reader and writer must use the same version for proper
serialization/deserialization.

**Compatibility Rules:** v1 reader can only read v1 files, v2 reader can only
read v2 files, v3 reader can only read v3 files, version mismatch causes
deserialization errors.

**Best Practice:** Always specify the version explicitly when creating readers
and writers.

## GraphSON Structure

GraphSON represents graph elements as JSON objects.

### Vertex Representation

**GraphSON v1:**

```json
{
    "id": 1,
    "label": "person",
    "properties": {
        "name": ["John"],
        "age": [30]
    }
}
```

**GraphSON v2/v3 (with types):**

```json
{
    "id": { "@type": "g:Int32", "@value": 1 },
    "label": "person",
    "properties": {
        "name": [{ "@type": "g:String", "@value": "John" }],
        "age": [{ "@type": "g:Int32", "@value": 30 }]
    }
}
```

### Edge Representation

**GraphSON v1:**

```json
{
    "id": 7,
    "label": "knows",
    "inV": 2,
    "outV": 1,
    "properties": {
        "weight": 0.5
    }
}
```

**GraphSON v2/v3 (with types):**

```json
{
    "id": { "@type": "g:Int64", "@value": 7 },
    "label": "knows",
    "inV": { "@type": "g:Int32", "@value": 2 },
    "outV": { "@type": "g:Int32", "@value": 1 },
    "properties": {
        "weight": { "@type": "g:Double", "@value": 0.5 }
    }
}
```

### Property Representation

**GraphSON v1:** Properties are simple JSON values, no type information
embedded.

**GraphSON v2/v3:** Properties can include type information. Format:
`{"@type": "typeName", "@value": value}`. Type names follow TinkerPop type
system (e.g., `g:String`, `g:Int32`, `g:Double`).

### Meta-Properties (v2/v3 only)

Meta-properties (properties on vertex properties) are supported. Represented as
nested property structures:

```json
{
    "properties": {
        "name": [
            {
                "@type": "g:VertexProperty",
                "@value": {
                    "id": { "@type": "g:Int64", "@value": 0 },
                    "value": { "@type": "g:String", "@value": "John" },
                    "properties": {
                        "created": { "@type": "g:Date", "@value": 1234567890 }
                    }
                }
            }
        ]
    }
}
```

## Type System

GraphSON supports TinkerPop's type system through type embedding.

**Supported Types:** Primitive Types (String, Integer, Long, Float, Double,
Boolean), Date/Time Types (Date, Timestamp), Graph Elements (Vertex, Edge,
VertexProperty, Property), Collection Types (List, Set, Map), Path Types (Path),
Special Types (UUID, BigDecimal, BigInteger).

**Type Embedding:** When `embedTypes` is `true`, types are embedded in JSON
using `@type` and `@value` structure. Type names follow TinkerPop conventions
(e.g., `g:String`, `g:Int32`). Enables proper type preservation during
serialization/deserialization.

## Configuration Best Practices

**Reading:** Max Compatibility: `version(GraphSONVersion.V3_0)`, Custom JSON
Parsing: `mapper(customMapper)` with custom ObjectMapper configuration.

**Writing:** Network Transfer (Gremlin Server): `version(GraphSONVersion.V3_0)`,
`embedTypes(true)`, `includeNullProperties(false)`. Human-Readable Output:
`version(GraphSONVersion.V2_0)`, `embedTypes(true)`,
`includeNullProperties(true)`, `normalize(true)`.

**General Configuration:** See
[TINKERPOP.md](TINKERPOP.md#general-configuration-best-practices) for general
configuration best practices across all formats.

## Error Handling

**Format-Specific Issues:** Version mismatch (reader and writer versions must
match), type mismatch (when `embedTypes` is inconsistent between reader/writer),
invalid JSON (malformed JSON causes parsing errors), missing properties
(properties may be omitted if `includeNullProperties` is false).

**Format-Specific Best Practices:** Always specify version explicitly, use
consistent configuration between reader and writer, validate JSON before
parsing, handle missing properties gracefully.

**General Error Handling:** See
[TINKERPOP.md](TINKERPOP.md#general-error-handling-patterns) for common error
handling patterns across all formats.

## Performance Considerations

**Format-Specific Optimization Tips:** Use GraphSON v3 for best performance, set
`includeNullProperties(false)` to reduce output size, use `embedTypes(true)`
only when type preservation is required, consider compression for large graphs,
use streaming for very large graphs.

**File Size:** More compact than GraphML. Typed format (v2/v3) is slightly
larger than untyped (v1). Null properties increase file size if included.
Compression can significantly reduce file size.

**General Performance Considerations:** See
[TINKERPOP.md](TINKERPOP.md#general-performance-considerations) for format
comparison and general optimization tips.

## Examples

**Complete GraphSON Example (v3):**

```json
{
    "vertices": [
        {
            "id": { "@type": "g:Int32", "@value": 1 },
            "label": "person",
            "properties": {
                "name": [{ "@type": "g:String", "@value": "Alice" }],
                "age": [{ "@type": "g:Int32", "@value": 30 }]
            }
        }
    ],
    "edges": [
        {
            "id": { "@type": "g:Int64", "@value": 7 },
            "label": "knows",
            "inV": { "@type": "g:Int32", "@value": 2 },
            "outV": { "@type": "g:Int32", "@value": 1 },
            "properties": {
                "weight": { "@type": "g:Double", "@value": 0.5 }
            }
        }
    ]
}
```

**Reading and Writing:**

```java
Graph graph = TinkerGraph.open();
Vertex alice = graph.addVertex(T.label, "person", "name", "Alice", "age", 30);
Vertex bob = graph.addVertex(T.label, "person", "name", "Bob", "age", 25);
alice.addEdge("knows", bob, "weight", 0.5);

GraphSONWriter writer = GraphSONWriter.build()
    .version(GraphSONVersion.V3_0)
    .embedTypes(true)
    .create();
writer.writeGraph(new File("graph.json"), graph);

Graph readGraph = TinkerGraph.open();
GraphSONReader reader = GraphSONReader.build()
    .version(GraphSONVersion.V3_0)
    .create();
reader.readGraph(new File("graph.json"), readGraph);
```
