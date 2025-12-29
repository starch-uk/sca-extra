# Gryo Format Specification

Binary format for graph serialization used by Apache TinkerPop.

**Related Docs:** [GRAPHENGINE.md](GRAPHENGINE.md),
[TINKERPOP.md](TINKERPOP.md), [GRAPHML.md](GRAPHML.md),
[GRAPHSON.md](GRAPHSON.md), [GRAPHBINARY.md](GRAPHBINARY.md),
[CODE_ANALYZER_CONFIG.md](CODE_ANALYZER_CONFIG.md)

## Overview

Gryo: binary format for graph serialization. Most compact and efficient format.
Fast serialization/deserialization. Suitable for large graphs and
high-performance scenarios. Versioned format (v1, v3). Optimized for local
storage and production systems. Not human-readable.

## Gryo Versions

**Gryo v1:** Original binary format, basic binary representation of graph
elements. Use cases: legacy systems, compatibility with older systems.

**Gryo v3:** Improved format with better performance, enhanced serialization
efficiency, better handling of large graphs, optimized binary encoding. Use
cases: modern applications, high-performance requirements, large graph
scenarios, production systems.

**Note:** Gryo v2 does not exist - version jumped from v1 to v3.

## TinkerPop Gryo Support

**Builder Pattern:**

```java
GryoReader reader = GryoReader.build()
    .version(3)
    .bufferSize(8192)
    .create();

GryoWriter writer = GryoWriter.build()
    .version(3)
    .bufferSize(8192)
    .create();
```

**Methods:** `readGraph(InputStream|File|URL, Graph)`,
`writeGraph(OutputStream|File|URL, Graph)`

**Configuration:**

- `version(int)`: Gryo version (1 or 3) - **must match between reader and
  writer**
- `bufferSize(int)`: Buffer size for I/O operations (default: 4096 bytes).
  Larger buffers improve performance for large files, smaller buffers use less
  memory.

**Version Compatibility:** Reader and writer must use the same version. Version
mismatch causes deserialization errors. v1 reader can only read v1 files, v3
reader can only read v3 files.

**Usage:**

```java
Graph graph = TinkerGraph.open();
GryoWriter writer = GryoWriter.build().version(3).bufferSize(8192).create();
writer.writeGraph(new File("graph.kryo"), graph);

GryoReader reader = GryoReader.build().version(3).bufferSize(8192).create();
reader.readGraph(new File("graph.kryo"), graph);
```

## Version Compatibility

**Critical:** Gryo reader and writer must use the same version for proper
serialization/deserialization.

**Compatibility Rules:** v1 reader can only read v1 files, v3 reader can only
read v3 files, version mismatch causes deserialization errors or data
corruption, always specify version explicitly.

**Best Practice:** Always specify the version explicitly when creating readers
and writers.

**Migration:** To migrate from v1 to v3, read with v1 reader and write with v3
writer. No direct conversion tool - must read and rewrite graphs.

## Binary Format Characteristics

**Format Type:** Binary format (not human-readable), compact representation,
efficient encoding of graph elements.

**Format-Specific Characteristics:** Smallest file size among all formats,
fastest serialization/deserialization, efficient for large graphs, low memory
overhead.

**Limitations:** Not human-readable, version-specific (requires matching
reader/writer versions), cannot be edited with text editors, requires TinkerPop
libraries.

**Format Comparison:** See
[TINKERPOP.md](TINKERPOP.md#detailed-format-comparisons) for detailed
comparisons with other formats.

## Performance Considerations

**Format-Specific Optimization Tips:** Use Gryo v3 for best performance,
increase buffer size for large graphs (8192, 16384, or higher), use streaming
for very large graphs, consider compression for storage (Gryo files compress
well).

**File Size:** Most compact format. Typically 3-5x smaller than GraphML, 2-3x
smaller than GraphSON. Binary encoding is highly efficient.

**Speed:** Fastest serialization/deserialization, optimized for
performance-critical scenarios, suitable for real-time graph operations.

**Memory Usage:** Low memory overhead, efficient binary representation, buffer
size affects memory usage.

**General Performance Considerations:** See
[TINKERPOP.md](TINKERPOP.md#general-performance-considerations) for format
comparison and general optimization tips.

## Configuration Best Practices

**For Maximum Performance:**

```java
GryoReader reader = GryoReader.build()
    .version(3)           // Use latest version
    .bufferSize(16384)   // Larger buffer for large files
    .create();

GryoWriter writer = GryoWriter.build()
    .version(3)           // Use latest version
    .bufferSize(16384)   // Larger buffer for large graphs
    .create();
```

**For Memory Efficiency:**

```java
GryoReader reader = GryoReader.build()
    .version(3)
    .bufferSize(4096)    // Default buffer size
    .create();

GryoWriter writer = GryoWriter.build()
    .version(3)
    .bufferSize(4096)    // Default buffer size
    .create();
```

**General Configuration:** See
[TINKERPOP.md](TINKERPOP.md#general-configuration-best-practices) for general
configuration best practices across all formats.

## Error Handling

**Format-Specific Issues:** Version mismatch (reader and writer versions must
match), corrupted files (binary files can be corrupted, use checksums for
validation), buffer size (too small buffer may cause performance issues), memory
issues (very large graphs may require increased heap size).

**Format-Specific Best Practices:** Always specify version explicitly, use
consistent configuration between reader and writer, validate files after writing
(read back and verify), use appropriate buffer sizes for graph size, handle
IOException appropriately.

**General Error Handling:** See
[TINKERPOP.md](TINKERPOP.md#general-error-handling-patterns) for common error
handling patterns across all formats.

## Examples

**Complete Reading and Writing:**

```java
Graph graph = TinkerGraph.open();
Vertex alice = graph.addVertex(T.label, "person", "name", "Alice", "age", 30);
Vertex bob = graph.addVertex(T.label, "person", "name", "Bob", "age", 25);
alice.addEdge("knows", bob, "weight", 0.5);

GryoWriter writer = GryoWriter.build().version(3).bufferSize(8192).create();
writer.writeGraph(new File("graph.kryo"), graph);

Graph readGraph = TinkerGraph.open();
GryoReader reader = GryoReader.build().version(3).bufferSize(8192).create();
reader.readGraph(new File("graph.kryo"), readGraph);
```

**Version Migration:**

```java
Graph graph = TinkerGraph.open();

// Read v1 file
GryoReader v1Reader = GryoReader.build().version(1).create();
v1Reader.readGraph(new File("graph-v1.kryo"), graph);

// Write v3 file
GryoWriter v3Writer = GryoWriter.build().version(3).create();
v3Writer.writeGraph(new File("graph-v3.kryo"), graph);
```

**Streaming:**

```java
try (FileInputStream fis = new FileInputStream("large-graph.kryo");
     BufferedInputStream bis = new BufferedInputStream(fis, 65536)) {
    GryoReader reader = GryoReader.build().version(3).bufferSize(65536).create();
    reader.readGraph(bis, graph);
}
```

## File Extensions

`.kryo` (standard), `.gryo` (alternative, less common). Extensions are
conventions only - Gryo format is identified by its binary structure, not file
extension.

## Limitations

**Known Limitations:** Not human-readable (binary format), version-specific
(requires matching versions), cannot be edited with text editors, requires
TinkerPop libraries, no built-in compression (use external compression if
needed), platform-dependent (Java-specific binary format).

**Workarounds:** Use GraphML or GraphSON for human-readable formats, always
specify versions explicitly, use version migration for upgrading, consider
compression for storage efficiency.
