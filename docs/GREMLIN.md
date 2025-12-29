````markdown
# Gremlin Query Language Reference

Functional graph traversal lang. Apache TinkerPop/SFGE. Multi-lang
(Java/Groovy/Python/JS/.NET). OLTP/OLAP.

**Related:** GRAPHENGINE.md, TINKERPOP.md, GRAPHML.md, GRAPHSON.md, GRYO.md,
GRAPHBINARY.md, CODE_ANALYZER_CONFIG.md

**Variants:** Gremlin-Java (core), -Groovy (console), -Python, -JavaScript,
-.NET. Syntax parity.

**Note:** Devs don't write Gremlin directly—SFGE handles graph ops internally
via TinkerPop.

## Core Concepts

- **Traversal**: Graph movement V→V via E. Step chain=query. Lazy (exec on
  terminal)
- **Steps**: Transform traversers: `out()`,`has()`,`where()`. Atomic, composable
- **Traversers**: Objects moving through graph. Carry data/state. Fork/merge.
  Track path/side-effects
- **Path**: V/E sequence visited. Get via `path()`
- **GraphTraversal**: Step chain. Extends `Traversal<S,E>`. Method chaining.
  Immutable
- **Side-Effects**: Stored values: `aggregate()`,`store()`. Get via `cap()`
- **Stream Nature**: Traversals=data streams. Steps transform stream

## Anatomy

Ref: TinkerPop 3.8.0 Anatomy Tutorial

```groovy
g.V().has('person','name',within('marko','josh')).outE().groupCount().by(label()).next()
```
````

Components:

1. **GraphTraversalSource** (`g`) - Spawns traversals
2. **GraphTraversal** (`has()`,`outE()`,`groupCount()`) - Chained steps
3. **Step Modulators** (`by()`) - Modify step behavior
4. **Anonymous Traversals** (`label()`) - Unbound traversals as args
5. **Terminal Steps** (`next()`) - Return results, not traversals
6. **Expressions** (`within()`) - Helper classes/enums

### GraphTraversalSource

Start point. Var `g` convention.

```groovy
graph = TinkerGraph.open()
g = graph.traversal()
```

Config (prefixed "with"):

```groovy
g.withStrategies(SubgraphStrategy.build().vertices(hasLabel('person')).create()).V()
g.withSack(1.0f).V().sack()
g.withComputer().V().pageRank()
```

Methods:
`V(id)`,`E(id)`,`addV(label)`,`addE(label)`,`withStrategies()`,`withoutStrategies()`,`withSideEffect()`,`withBindings()`,`withSack()`,`withComputer()`,`getGraph()`,`clone()`

Traversal interface:
`hasNext()`,`next()`,`tryNext()`,`toList()`,`toSet()`,`toBulkSet()`,`iterate()`,`explain()`,`profile()`,`cap()`,`as()`,`by()`,`isExhausted()`,`close()`

### GraphTraversal

From start steps. Returns `GraphTraversal` (fluent). Output→Input:

```groovy
g.V()                                           // →Vertex
  .has('person','name',within('marko','josh'))  // V→V (filter)
  .outE()                                       // V→E
  .groupCount().by(label())                     // E→Map
```

### Step Modulators

Modify prev step: `by()` (grouping/ordering/transform), `as()` (label ref),
`option()` (branches for `choose()`/`mergeV()`/`mergeE()`)

### Anonymous Traversals

Unbound from `__` class (typically static import):

```groovy
by(label())         // = by(__.label())
where(out('knows'))
coalesce(out(), in())
```

### Terminal Steps

Execute, return results (not `GraphTraversal`): `next()` (throws if none),
`hasNext()` (bool), `tryNext()` (Optional), `toList()`/`toSet()` (collect),
`iterate()` (side-effects only)

### Result Iteration

```groovy
g.V().hasLabel('person').forEachRemaining { v -> println(v.value('name')) }
def t = g.V().hasLabel('person'); while (t.hasNext()) { processVertex(t.next()) }
def vertices = g.V().hasLabel('person').toList()
```

Best: `forEachRemaining()` streaming, `toList()` batch, check `hasNext()`/use
`tryNext()`, close traversals, prefer streaming large sets.

### Expressions

**P (Predicates):**
`eq()`,`neq()`,`lt()`,`lte()`,`gt()`,`gte()`,`between()`,`inside()`,`outside()`,`within()`,`without()`
**T (Tokens):** `T.id`,`T.label` **Order:** `Order.asc`,`Order.desc` **Merge:**
`Merge.onCreate`,`Merge.onMatch`

## Step Reference

**Navigation:**
`V(id)`,`E(id)`,`out(label)`,`in(label)`,`both(label)`,`outE(label)`,`inE(label)`,`bothE(label)`,`outV()`,`inV()`,`bothV()`

**Filtering:**
`has(key,value)`,`has(key)`,`has(key,predicate)`,`hasLabel(label)`,`hasId(id)`,`where(predicate)`,`filter(predicate)`,`and(...)`,`or(...)`,`not(step)`,`simplePath()`,`cyclicPath()`

**Value Extraction:**
`values(key)`,`valueMap()`,`elementMap()`,`properties()`,`id()`,`label()`

**Modification:**
`addV(label)`,`addE(label)`,`property(key,value)`,`drop()`,`mergeV()`,`mergeE()`

**Path/Collection:**
`path()`,`simplePath()`,`cyclicPath()`,`limit(n)`,`range(start,end)`,`count()`,`dedup()`,`order()`,`group()`,`groupCount()`,`fold()`,`unfold()`,`subgraph(key)`

**Control Flow:**
`repeat(step)`,`until(cond)`,`emit(cond)`,`times(n)`,`loops()`,`coalesce(...)`,`optional(step)`,`union(...)`,`choose(pred,true,false)`,`match(...)`,`branch(step)`

**Side Effects:**
`sideEffect(step)`,`store(key)`,`aggregate(key)`,`cap(key)`,`inject(...)`

**Terminal:** `next()`,`toList()`,`toSet()`,`iterate()`

**Transformation:**
`map(step)`,`flatMap(step)`,`project(...)`,`select(...)`,`constant(value)`

**Aggregation:**
`count()`,`sum()`,`mean()`,`max()`,`min()`,`group()`,`groupCount()`

**String:**
`concat()`,`split()`,`substring()`,`toLower()`,`toUpper()`,`trim()`,`replace()`,`format()`
**Date:** `asDate()`,`dateAdd()`,`dateDiff()` **Type:**
`asString()`,`asNumber()`,`asBool()`

## Advanced Semantics

### Null Values (3.5.0+)

`null` preserved as traverser (not filtered):

```groovy
g.V().coalesce(values('age'), constant(null))  // →29,27,null,32,null,35
g.V().coalesce(values('age'), constant(null))
  .choose(is(null), constant('nulled'), constant('not nulled'))
```

### constant() vs inject()

| `constant()`                       | `inject()`                     |
| ---------------------------------- | ------------------------------ |
| Map step—transforms each traverser | Start step—inserts into stream |
| Called per traverser               | Called once mid-traversal      |

```groovy
g.V().has('person','name',within('josh','marko')).constant('c')  // →c,c
g.V().has('person','name','marko').inject('i')  // →i,v[1]
g.inject(1,2,3).constant('person').addV()  // 3 vertices, all 'person'
g.inject(1,2,3).inject('person').addV()    // 4 vertices, mixed labels
```

### fold()/unfold()

`fold()`: stream→List; `unfold()`: List→stream

**Critical in `by()` modulators** (only calls `next()` once):

```groovy
// Without fold: first only
g.V().has('person','name','marko').project('name','knows')
  .by('name').by(out('knows').values('name'))  // →[name:marko,knows:vadas]

// With fold: all
g.V().has('person','name','marko').project('name','knows')
  .by('name').by(out('knows').values('name').fold())  // →[name:marko,knows:[vadas,josh]]
```

### Static vs Dynamic Maps

```groovy
// Static: shared instance
g.inject(0).project('x').by(constant([y:0]))
// Dynamic: new per traverser
g.inject(0).project('x').by(constant(0).project('y').by(constant(0)))
```

### Maps as Keys

Some langs don't support map dict keys. Solutions: convert to lists, string
keys, flatten structure.

## Stream Patterns

Traversers flow through pipeline. Transform/filter/split/merge. Lazy eval.

Iterator types:
`Iterator<Vertex>`,`Iterator<Edge>`,`Iterator<Object>`,`Iterator<Path>`,`Iterator<Map>`

```groovy
// Filter-Transform-Collect
g.V().has('country','US').values('code').order().limit(10).toList()
// Branch-Process-Merge
g.V().has('code','AUS').choose(values('type'),
  option('airport', out('route')),
  option('country', in('contains')))
// Aggregate-Process
g.V().has('code','AUS').aggregate('visited').out('route')
  .where(without('visited')).values('code')
```

Best: filter early, appropriate terminals, avoid unnecessary steps, handle
empty, limit large.

## Examples

```groovy
// Basic
g.V(); g.V(1); g.V().hasLabel('airport')
g.V().has('code','AUS').out(); g.V().has('code','AUS').values('name')
g.V().has('code','AUS').elementMap()

// Filter/Project
g.V().has('country','US').has('type','airport')
g.V().where(out().count().is(gt(10)))
g.V().hasLabel('airport').project('code','name','city').by('code').by('name').by('city')

// Pattern Match
g.V().has('code','AUS').match(
  __.as('a').out('route').as('b'),
  __.as('b').out('route').as('c')).select('a','b','c')

// Aggregation
g.V().count()
g.V().hasLabel('airport').groupCount().by('country')
g.V().hasLabel('airport').order().by('code',Order.asc)

// Mutations
g.addV('airport').property('code','XYZ').next()
g.V().has('code','AUS').addE('route').to(__.V().has('code','DFW')).next()
g.V().has('code','XYZ').drop().iterate()
g.mergeV().has('airport','code','XYZ')
  .option(Merge.onCreate, __.property('name','New'))
  .option(Merge.onMatch, __.property('name','Existing')).next()

// Recursive
g.V().has('code','AUS').repeat(out('route')).until(has('code','DFW')).path()
```

## Supernodes

High-degree vertices→perf issues. Mitigate:

```groovy
g.V().has('code','ATL').out('route').limit(10)
g.V().has('code','ATL').outE('route').has('distance',lt(1000)).inV()
```

## Semantics

**Numeric promotion:** int→long→double (auto) **Type ops:** equality (same val),
comparability (<,>,<=,>=), orderability (sort), equivalence (equal/comparable)
**Step semantics:** domain (input), range (output), modulation capability
**Categories:** Navigation, Filtering, Transformation, Side-Effect, Barrier,
Control Flow, String, Date, Type Conversion, Collection

## Version Updates

### 3.5/3.6

New: `mergeV()`,`mergeE()`,`elementMap()` Deprecated:
`Order.incr`/`Order.decr`→`Order.asc`/`Order.desc` Enhanced drivers, GraphBinary

### 3.8.0

Enhanced semantics, Gremlin MCP Server, perf improvements, 4.0.0 prep. Check
release notes.

## Recipes

Ref: TinkerPop 3.8.0 Recipes

```groovy
// Between Vertices
g.V(1).bothE().where(otherV().hasId(2))
g.V(v1).outE().where(inV().is(v2))

// Centrality
g.V().project('vertex','degree').by(id()).by(bothE().count())

// Collections
g.V().hasLabel('person').fold()
g.V().hasLabel('person').aggregate('people').cap('people')

// Cycle Detection
g.V().as('start').repeat(out().simplePath()).until(cyclicPath()).path()
  .where(unfold().is(select('start')))

// Get or Create (coalesce pattern)
// fold()→list, unfold() returns existing if non-empty, else addV()
g.V().has('name','Alice').fold()
  .coalesce(unfold(), addV('person').property('name','Alice'))

// Pagination
g.V().hasLabel('person').order().by('name').range(10,20)

// Shortest Path
g.V().has('code','AUS').repeat(out('route').simplePath())
  .until(has('code','DFW')).limit(1).path()

// Looping
g.V().has('code','AUS').repeat(out('route')).times(5).dedup()  // fixed depth
g.V().has('code','AUS').repeat(out('route').simplePath()).until(has('code','DFW')).path()  // conditional
g.V().has('code','AUS').repeat(out('route').simplePath()).emit().times(3)
  .project('vertex','depth').by('code').by(loops())  // emit at levels

// times(0) Semantics
repeat(...).times(0)  // do/while: exec once
times(0).repeat(...)  // while/do: skip
```

### Anti-Patterns

- Long traversals→break smaller
- Unspecified labels→always `hasLabel()`
- Unnecessary steps→remove non-contributing
- `has()` without label→use `has(label,key,value)`

## SQL→Gremlin

| SQL      | Gremlin                                |
| -------- | -------------------------------------- |
| SELECT   | `values()`,`valueMap()`,`elementMap()` |
| FROM     | `V()`,`E()`                            |
| WHERE    | `has()`,`where()`,`filter()`           |
| JOIN     | `out()`,`in()`,`both()`                |
| GROUP BY | `group()`,`groupCount()`               |
| ORDER BY | `order()`                              |
| LIMIT    | `limit()`                              |
| COUNT    | `count()`                              |
| DISTINCT | `dedup()`                              |
| INSERT   | `addV()`,`addE()`                      |
| UPDATE   | `property()`                           |
| DELETE   | `drop()`                               |

```sql
SELECT name,age FROM persons WHERE age>25 ORDER BY name LIMIT 10;
```

```groovy
g.V().hasLabel('person').has('age',gt(25)).order().by('name').limit(10).values('name','age')
```

## Remote Connections

```java
// Java
Cluster cluster = Cluster.build().addContactPoint("localhost").port(8182)
  .credentials("user","pass").create();
GraphTraversalSource g = traversal().withRemote(DriverRemoteConnection.using(cluster));
```

```python
# Python
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection
from gremlin_python.process.anonymous_traversal import traversal
g = traversal().withRemote(DriverRemoteConnection('ws://localhost:8182/gremlin','g'))
```

Config: connection pooling, serialization (GraphSON/GraphBinary), timeouts,
sessions.

## Profiling/Optimization

```groovy
g.V().has('code','AUS').out('route').explain()   // exec plan
g.V().has('code','AUS').out('route').profile()   // metrics: duration, count, %
```

Optimize: filter early, use indexes, limit breadth, use `sample()` random, avoid
unnecessary steps.

## Indexing

Types: Composite (multi-prop), Mixed (single prop, flexible) Best: index
frequent props, composite for common combos, avoid over-indexing, verify
`explain()`.

## Pattern Matching

```groovy
g.V().has('code','AUS').match(
  __.as('a').out('route').as('b'),
  __.as('b').out('route').as('c'),
  __.as('c').has('code','DFW')
).select('a','b','c')
```

## Recommendations

```groovy
// Collaborative: users who liked same items
g.V().has('user','name','Alice').as('alice')
  .out('rated').has('rating',gte(4)).inV().as('likedMovie')
  .in('rated').has('rating',gte(4)).where(neq('alice'))
  .out('rated').has('rating',gte(4)).inV()
  .where(neq('likedMovie'))
  .groupCount().order(local).by(values,Order.desc).limit(local,10)
```

## Recursive Traversals

```groovy
g.V().has('code','AUS').repeat(out('route')).times(3).dedup()  // fixed
g.V().has('code','AUS').repeat(out('route').simplePath()).until(has('code','DFW')).path()  // until
g.V().has('code','AUS').repeat(out('route')).emit().times(3).dedup()  // emit during
// Avoid cycles
g.V().has('code','AUS').repeat(out('route').simplePath()).until(has('code','DFW')).path()
// With side-effects
g.V().has('code','AUS').aggregate('visited')
  .repeat(out('route').where(without('visited')).aggregate('visited'))
  .until(has('code','DFW')).path()
```

## Path Object

```groovy
g.V().has('code','AUS').out('route').out('route').path().by('code')  // basic
g.V().has('code','AUS').as('start').out('route').as('first').path().from('start').by('code')  // labeled
g.V().has('code','AUS').outE('route').as('edge').inV().path().by('code').by('distance')  // with edges
g.V().has('code','AUS').repeat(out('route').simplePath()).until(has('code','DFW'))
  .path().where(count(local).is(lt(5)))  // filter by length
```

## Testing/Debugging

```groovy
g.V().has('code','AUS').path().by(elementMap())  // inspect
def aus = g.V().has('code','AUS').next()         // break complex
def routes = g.V(aus).out('route').toList()
g.V().has('code','AUS').out('route').profile()   // profile
```

## Security

- Credentials auth
- SSL/TLS
- RBAC at app level
- Parameter binding (not string concat)
- Validate/sanitize input
- Config timeouts/resource limits

## Resources

Stephen Mallette Gremlin Snippets:

- 1: null handling
- 2: constant() vs inject()
- 3: fold()/unfold()
- 4: static/dynamic maps
- 5: maps as keys
- 6: edge direction grouping
- 20: constant() vs inject() with addV()
- 21: times(0) semantics
- 22: TinkerPop 3.8.0

```

```
