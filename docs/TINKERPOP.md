````markdown
# Apache TinkerPop Reference

Graph computing framework for OLTP (real-time) and OLAP (batch) operations.
Vendor-agnostic, language-agnostic, extensible.

**Related:** [GREMLIN.md](GREMLIN.md), [GRAPHML.md](GRAPHML.md),
[GRAPHSON.md](GRAPHSON.md), [GRYO.md](GRYO.md), [GRAPHBINARY.md](GRAPHBINARY.md)

## Framework Components

### TinkerGraph

In-memory property graph reference implementation. Lightweight, fast for
small-medium graphs. Supports all serialization formats.

```groovy
graph = TinkerGraph.open()
g = graph.traversal()
graph.io(graphml()).readGraph("path/to/file.graphml")
```
````

**Config:** `gremlin.tinkergraph.vertexIdManager`, `edgeIdManager`,
`vertexPropertyIdManager`, `defaultVertexPropertyCardinality` **ID Types:**
`LONG`, `INTEGER`, `STRING`, `UUID` (auto-generates if not provided)

**TinkerFactory Toy Graphs:**

- `createClassic()` - TinkerPop 2.x toy graph
- `createModern()` - TinkerPop 3.x version, 6 vertices/6 edges, used in docs
- `createTheCrew()` - Demonstrates meta-properties, multi-properties
- `createGratefulDead()` - 808 vertices/8049 edges, larger testing

```groovy
graph = TinkerFactory.createModern()
g = traversal().with(graph)
// or: g = graph.traversal()
```

### Gremlin Server

Remote Gremlin execution server. Supports sessions, auth, SSL/TLS.

**Formats:** GraphSON (primary), GraphBinary (optimized) **Config (YAML):**
host/port, graph config, serializers, thread pool, auth, SSL, script engines,
metrics

```bash
bin/gremlin-server.sh conf/gremlin-server.yaml
```

**Sessions:** Stateless (default), Session (maintains state), configurable
timeout **Security:** Auth, SSL/TLS, authorization (provider-specific),
traversal restrictions

### Gremlin Console

Interactive CLI for Gremlin queries. Groovy-based with autocompletion, syntax
highlighting.

**Commands:** `:help`/`:h`, `:exit`/`:x`/`:quit`/`:q`, `:import`/`:i`,
`:clear`/`:c`, `:show`/`:S`, `:load`, `:install`, `:plugin`

```groovy
// Load graph
graph = TinkerGraph.open()
graph.io(graphml()).readGraph('data/air-routes.graphml')
g = graph.traversal()

// Remote connection
:remote connect tinkerpop.server conf/remote.yaml
:remote console
```

**`:install`** - Maven dependency installation (requires Grape config):

```groovy
:install com.datastax.cassandra cassandra-driver-core 2.1.9
```

**Static Imports:**

```groovy
import static org.apache.tinkerpop.gremlin.process.traversal.dsl.graph.__.*
import static org.apache.tinkerpop.gremlin.process.traversal.P.*
import static org.apache.tinkerpop.gremlin.structure.T.*
import static org.apache.tinkerpop.gremlin.process.traversal.Order.*
```

**Result Iteration:**

```groovy
g.V().hasLabel('person').forEachRemaining { vertex ->
    println(vertex.value('name'))
}
```

**`def` Keyword:** Use inside closures for scoping. Don't use at console prompt
(causes error).

**Init Script:** `bin/gremlin.sh -i init.groovy`

## Property Graph Model

**Components:** Vertices (nodes), Edges (relationships), Properties (key-value),
Labels (categorization) **Tokens:** `T.id`, `T.label`

```java
Graph graph = TinkerGraph.open();
Vertex gremlin = graph.addVertex(T.label, "software", "name", "gremlin");
gremlin.property("created", 2009);
gremlin.addEdge("dependsOn", blueprints);
```

## Traversal Strategies

Auto-applied optimizations. Use `withStrategies()` for manual application.

**Common:** `SubgraphStrategy`, `ReadOnlyStrategy`, `PartitionStrategy`,
`VertexProgramStrategy`, `OptionsStrategy`, `ProductiveStrategy`,
`LazyBarrierStrategy`, `IncidentToAdjacentStrategy`, `FilterRankingStrategy`,
`CountStrategy`, `PathRetractionStrategy`, `MatchAlgorithmStrategy`,
`OrderLimitStrategy`, `RangeByIsCountStrategy`, `RepeatUnrollStrategy`,
`EarlyTerminationStrategy`

```java
g = graph.traversal().withStrategies(
    SubgraphStrategy.build().vertices(hasLabel("Person")).create(),
    ReadOnlyStrategy.instance()
);
```

## GraphComputer API (OLAP)

Distributed graph computation for batch processing.

**Concepts:** GraphComputer (interface), VertexProgram (per-vertex execution),
MapReduce (aggregation), Messaging (vertex communication), Memory (shared),
ComputerResult

**GraphComputer Methods:** `compute()`, `workers()`, `persist()`, `result()`,
`vertices()`, `edges()`, `memory()`, `program()`, `mapReduce()`, `submit()`
**VertexProgram Methods:** `setup()`, `execute()`, `terminate()`,
`getMemoryComputeKeys()`, `getVertexComputeKeys()`, `clone()` **MapReduce
Methods:** `map()`, `combine()`, `reduce()`, `execute()`, `getMemoryKey()`

**Execution:** Partition graph → Execute VertexProgram in parallel → Message
passing → Check termination → MapReduce aggregation → Store results

## Graph I/O

**Interfaces:** `GraphReader`, `GraphWriter` **Formats:** GraphML, GraphSON,
Gryo, GraphBinary (see dedicated docs) **Methods:** `readGraph()`,
`writeGraph()`

### Loading Data

**Get or Create Pattern:**

```groovy
getOrCreate = { id ->
  g.V().has('user', 'userId', id).
    fold().
    coalesce(unfold(),
             addV('user').property('userId', id)).next()
}
```

**Complete Example:**

```groovy
graph = TinkerGraph.open()
graph.createIndex('userId', Vertex.class)
g = traversal().with(graph)

getOrCreate = { id ->
  g.V().has('user', 'userId', id).
    fold().
    coalesce(unfold(),
             addV('user').property('userId', id)).next()
}

new File('wiki-Vote.txt').eachLine {
  if (!it.startsWith("#")) {
    (fromVertex, toVertex) = it.split('\t').collect(getOrCreate)
    g.addE('votesFor').from(fromVertex).to(toVertex).iterate()
  }
}
```

For larger datasets: `CloneVertexProgram` or native bulk loading.

### Format Comparison

| Format      | Type   | Use Case                  | Pros                       | Cons                           |
| ----------- | ------ | ------------------------- | -------------------------- | ------------------------------ |
| GraphML     | XML    | Human-readable, debugging | Standard, widely supported | Verbose, slow                  |
| GraphSON    | JSON   | Network, Gremlin Server   | Compact JSON               | Less expressive                |
| Gryo        | Binary | Performance, large graphs | Fastest, smallest          | Not readable, version-specific |
| GraphBinary | Binary | Network, Gremlin Server   | Efficient, flexible typing | Not readable                   |

**Size (approx):** Gryo < GraphBinary < GraphSON (2-3x) < GraphML (3-5x)
**Speed:** Gryo > GraphBinary > GraphSON > GraphML

**Selection:** Human-readable? → GraphML/GraphSON. Gremlin Server? →
GraphSON/GraphBinary. Performance-critical? → Gryo. Network-optimized? →
GraphBinary.

## Provider Integration

**Provider Types:** Graph System (DB/Processor), Driver, Language, Plugin

**Requirements:** Implement core API, pass `gremlin-test` suite, support
property graph model **OLTP:** `Graph`, `GraphTraversalSource` interfaces
**OLAP:** `GraphComputer` interface **IO:** `GraphReader`, `GraphWriter`
interfaces

**Validation:** JVM test suite, Gherkin BDD tests

## Core API Reference

**Graph:** `TinkerGraph.open()`, `TinkerGraph.open(Configuration)`

**Traversal<S,E>:** `hasNext()`, `next()`, `tryNext()`, `toList()`, `toSet()`,
`iterate()`, `explain()`, `profile()`, `as()`, `by()`, `cap()`, `option()`,
`union()`, `coalesce()`, `optional()`

**GraphTraversal<S,E>:** Extends Traversal with graph steps (V, E, out, in, has,
etc.)

**Step Types:** `Step`, `MapStep` (1:1), `FilterStep` (1:0/1:1), `FlatMapStep`
(1:N), `BarrierStep`, `SideEffectStep`, `CollectingBarrierStep`

## Version 3.5/3.6 Features

**New Steps:** `mergeV()` (upsert vertex), `mergeE()` (upsert edge),
`elementMap()` **Deprecations:** `Order.incr`/`Order.decr` →
`Order.asc`/`Order.desc`

```groovy
g.mergeV().has('airport', 'code', 'XYZ')
  .option(Merge.onCreate, __.property('name', 'New'))
  .option(Merge.onMatch, __.property('name', 'Updated'))
  .next()
```

## Air-Routes Dataset

Airline route network: airports, countries, continents as vertices; routes as
edges. Load from `air-routes.graphml`. Thousands of airports, tens of thousands
of routes.

```

```
