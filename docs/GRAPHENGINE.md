# Salesforce Graph Engine (SFGE) Quick Reference

Condensed guide for Salesforce Graph Engine (SFGE) data-flow analysis and rules.

**Related Docs:** [CODE_ANALYZER_CONFIG.md](CODE_ANALYZER_CONFIG.md),
[PMD.md](PMD.md), [GREMLIN.md](GREMLIN.md), [TINKERPOP.md](TINKERPOP.md),
[GRAPHML.md](GRAPHML.md), [GRAPHSON.md](GRAPHSON.md), [GRYO.md](GRYO.md),
[GRAPHBINARY.md](GRAPHBINARY.md)

## Overview

Salesforce Graph Engine (SFGE): open-source Salesforce tool performing complex
analysis on Apex code, identifying security vulnerabilities and code issues.
Uses data-flow analysis for more complex checks than static-analysis tools.
**Status:** Developer Preview.

**Key Advantage:** SFGE uses data-flow analysis to detect issues requiring
understanding of how data flows through code paths, not just syntax patterns.

**Viewing Available Rules:**

```bash
scanner run dfa --rule-selector sfge --help
```

For modifying rule settings (severity, tags), see
[Customize Your Configuration](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/customize-config.html).

## Data-Flow Analysis Process

1. **Parse Tree Generation:** Apex Jorje compiler analyzes code and returns
   parse tree
2. **Graph Construction:** SFGE translates parse tree into vertices and adds
   them to Apache TinkerPop graph database
3. **Code Path Construction:** SFGE builds code paths starting from each
   identified entry point
4. **Rule Application:** SFGE walks each code path, applying selected rules at
   every vertex with contextual data. Rules evaluate information and create
   violations if applicable

After traversal completes, SFGE returns all collected rule violations.

## Key Concepts

| Concept         | Description                                                                                                                                                                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Entry Point** | Starting code location of execution path from external interaction (e.g., `@AuraEnabled` methods, `public` Visualforce controller methods). Entry points are evaluated in parallel, and timeout is applied to each entry point separately                                                   |
| **Source**      | Code location where data originates. When data is passed into an entry point, the entry point is the source for that data. Data can also be produced or read other than getting passed into the entry point, making it possible for the data source to also be in the middle of a code path |
| **Sink**        | Ending code location where data is consumed or modified (e.g., DML operations, SOQL queries)                                                                                                                                                                                                |
| **Sanitizer**   | Check between source and sink that ensures appropriate actions are taken or inappropriate actions are prevented (e.g., null checks, CRUD/FLS checks)                                                                                                                                        |

**Rule Logic:** SFGE verifies that each code path containing a source and a sink
also includes a sanitizer. Missing sanitizers result in violations.

**Path Relationships:** A source can lead to multiple sinks. A sink can be
reached through multiple sources. There can be multiple paths between the same
source and sink. SFGE analyzes all possible paths from each entry point.

## Configuration

Configure SFGE in `code-analyzer.yml`:

```yaml
engines:
    sfge:
        disable_engine: false
        disable_limit_reached_violations: false
        java_command: null
        java_max_heap_size: null
        java_thread_count: 4
        java_thread_timeout: 900000
```

### Configuration Properties

| Property                           | Type    | Default  | Description                                                                                                                                                                                                                         |
| ---------------------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `disable_engine`                   | boolean | `false`  | Turn off SFGE engine (not included in Code Analyzer commands)                                                                                                                                                                       |
| `disable_limit_reached_violations` | boolean | `false`  | Prevent LimitReached violations for complex paths. SFGE detects complex paths that might cause OutOfMemory errors and throws LimitReached violations. Disable this check (in addition to increasing `java_max_heap_size`) if needed |
| `java_command`                     | string  | `null`   | Specific `java` command/path for JRE/JDK. Auto-discovered if `null`                                                                                                                                                                 |
| `java_max_heap_size`               | string  | `null`   | Maximum Java heap size (bytes). Appended to `-Xmx`. Must be multiple of 1024, >2MB. Use `k`/`K`/`kb`/`KB` (kilobytes), `m`/`M`/`mb`/`MB` (megabytes), `g`/`G`/`gb`/`GB` (gigabytes). Auto: JVM default if `null`                    |
| `java_thread_count`                | number  | `4`      | Number of Java threads for parallel execution. Increasing allows more paths evaluated simultaneously                                                                                                                                |
| `java_thread_timeout`              | number  | `900000` | Maximum time (milliseconds) a Java thread may execute before SFGE issues Timeout violation                                                                                                                                          |

## Running SFGE Rules

Use `--rule-selector sfge` to run SFGE rules:

```bash
scanner run dfa --rule-selector sfge
```

**Note:** `scanner run dfa` invokes data-flow-based rules in SFGE.

**Rule Registration:** Rules register interest in specific types of vertices.
For example: CRUD/FLS rules express interest in DML operation vertices,
NullPointerException rules express interest in object dereference vertices,
Performance rules express interest in loop and database operation vertices.
Rules evaluate vertices along code paths and create violations when conditions
are met.

## Working with SFGE

### Interpreting Results

SFGE results include at least two locations: **Entry Point** (where the code
path starts, first location) and **Sink** (where the violation occurs, last
location). Review both to understand potential vulnerabilities.

**Note:** SFGE uses the same results output schema that other engines use. See
[Interpret the Run Results](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/interpret-results.html)
for information about human-readable output, and the
[Output Schema Reference](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/output-schema-reference.html)
for details about machine-readable outputs.

**Flow Scanner vs SFGE Differences:** Flow Scanner engine's code paths start
from the data source. SFGE's code paths always start from the entry point, which
aren't always the same as the data source.

### Managing False Positives/Negatives

SFGE may produce false positives or negatives: **False Negative** (SFGE fails to
create a violation where the code is insecure), **False Positive** (SFGE creates
a violation even though the code is secure).

If you determine that SFGE created a false positive, add engine directives to
your code so that SFGE doesn't throw that violation anymore.

**Engine Directives (Three Levels):**

**1. Disable Next Line:** Disable just the sink from SFGE's analysis. Add
`disable-next-line` in the line immediately before the sink operation:

```apex
// sfge-disable-next-line RuleName
List<Account> accounts = [SELECT Id FROM Account];
```

**2. Disable Stack (Method):** Disable all analyses of sink operations in paths
passing through a method. Add `disable-stack` in the line immediately before the
method declaration:

```apex
// sfge-disable-stack RuleName
public void myMethod() {
    List<Account> accounts = [SELECT Id FROM Account];
}
```

**3. Disable (Class):** Disable all analyses of sink operations that occur in
the class. Add `disable` in the line immediately before the class declaration:

```apex
// sfge-disable RuleName
public class MyClass {
    public void myMethod() {
        List<Account> accounts = [SELECT Id FROM Account];
    }
}
```

### Understanding Code Paths

Recognize how data flows through code: 1. Identify entry points (external
interaction points), 2. Trace data from sources to sinks, 3. Verify sanitizers
exist between source and sink, 4. Review violations to understand missing
sanitizers.

## Writing SFGE-Friendly Code

To enhance SFGE performance and reduce analysis time. **Note:** Some suggested
refactors can conflict with accepted best practices for Apex. Read through the
options and update your code as appropriate.

**Performance Factors:** Two factors directly affect SFGE's performance: 1.
**Number of entry points analyzed** (entry points are evaluated in parallel, and
timeout is applied to each entry point separately), 2. **Number of paths each
entry point constructs** (building paths is the most expensive part of analyzing
an entry point. Typically, an entry point causes timeouts or memory issues
because it constructs an inordinate number of paths).

**Most Consequential Refactoring:** Decrease the number of paths a single entry
point constructs or more evenly distribute paths between entry points.

### How Paths Are Built

When SFGE encounters conditional statements (if, while, etc.) with unknown
values, paths fork at each conditional. For example:

```apex
public void myMethod(boolean b1, boolean b2) {
    if (b1) { /* path 1 */ }
    if (b2) { /* path 2 */ }
}
```

If the values of `b1` and `b2` are unknown, SFGE identifies four unique paths
through the method (2 × 2 = 4). Each conditional causes paths to fork.

**Key Principle:** Where possible, SFGE avoids building impossible paths. Paths
only fork when the outcome is truly indeterminate.

### Reduce Entry Points

Minimize number of entry points analyzed (each evaluated separately), break down
complex entry points into multiple simpler ones, distribute paths evenly among
entry points.

**Refactoring Strategy:** If an entry point's complexity causes timeouts or
memory problems, refactor that entry point into two separate entry points with
fewer paths. These entry points are analyzed in parallel and have separate
timeouts, complete faster, and are less likely to exceed time or memory limits.

**Example Path Calculation:** Entry point with 3 unknown parameters and 3
indeterminate if clauses. If each helper method contains 1 unique path: Total =
1 × 2 × 2 × 2 = 8 paths. If each helper method contains 10 unique paths: Total =
1 × 20 × 20 × 20 = 8,000 paths.

**Refactoring Example:** Split a single entry point into two entry points, each
passing a literal boolean to avoid forking at one conditional: Original: 8,000
paths (1 × 20 × 20 × 20), Refactored: 4,000 paths per entry point (1 × 20 × 20 ×
10), Total: 8,000 paths across 2 entry points (analyzed in parallel).

### Limit Code Path Complexity

Simplify code paths to prevent excessive branching, refactor complex methods
into smaller manageable ones, reduce conditional branches to decrease number of
paths SFGE analyzes, prevent timeouts or memory issues from too many paths.

### Best Practices

- **Distribute Paths Evenly:** Balance path distribution among entry points
- **Refactor Complex Methods:** Break down large methods to distribute paths
- **Simplify Conditionals:** Reduce nested conditionals and branching
- **Use Literal Values:** Pass literal values to helper methods to avoid path
  forking
- **Split Entry Points:** Convert single complex entry point into multiple
  simpler entry points

## SFGE Rules Reference

### ApexFlsViolation

Detects Create, Read, Update, Delete (CRUD) and Field-Level Security (FLS)
violations.

**Entry Points:** `@AuraEnabled`, `@InvocableMethod`, `@NamespaceAccessible`,
`@RemoteAction`-annotated methods, methods returning `PageReference` object,
`public`-scoped methods on Visualforce Controllers, `global`-scoped methods on
any class, `Messaging.InboundEmailResult handleInboundEmail()` methods on
`Messaging.InboundEmailHandler` implementations, any method targeted during
invocation.

**Sinks:** DML operations (`delete`, `insert`, `merge`, `undelete`, `update`,
`upsert`), `Database.method()` counterparts (`Database.delete()`,
`Database.insert()`, etc.), SOQL queries (`[SELECT ... FROM ...]`),
`Database.query()` counterpart.

**Sanitizers:** CRUD checks (`Schema.DescribeSObjectResult` access checks,
acceptable for DELETE, UNDELETE, MERGE operations), FLS checks
(`Schema.DescribeFieldResult` access checks, acceptable for READ, INSERT,
UPDATE, UPSERT operations on standard/custom objects),
`Security.stripInaccessible()` filtered lists, SOQL queries using
`WITH USER_MODE`, SOQL queries using `WITH SECURITY_ENFORCED`.

**Violation Messages:**

- `{Validation-Type} validation is missing for {Operation-Name} operation on {Object-Type} with fields {Comma-Separated-Fields}`
- `{Validation-Type} validation is missing for {Operation-Name} operation on {Object-Type} with fields {Comma-Separated-Fields}–Graph Engine couldn't parse all objects and fields correctly. Manually confirm if the objects and fields involved in these segments have FLS checks: {Unknown-Segments}`

**Fields:** `Validation-Type` (CRUD or FLS), `Operation-Name` (data operation
that must be sanitized), `Object-Type` (object name or variable
name/`SFGE_Unresolved_Argument` if unknown), `Comma-Separated-Fields` (field
names or `Unknown` if Graph Engine couldn't determine).

### ApexNullPointerException

Identifies Apex operations that dereference null objects and throw
NullPointerExceptions.

**Entry Points:** Same as ApexFlsViolation

**Sinks:** Any object dereference (e.g., `x.someMethod()`, `x.field`,
`x[index]`)

**Sanitizers:** Non-null initialization (`String s = 'abcde';`), null checks
before accessing (`if (s != null) { ... }`), checks for specific non-null values
(`if (x == 7) { ... }`)

**Violation Message:**
`ApexNullPointerException identifies Apex operations with a high likelihood of throwing a NullPointerException`

**Fix:** Add null checks before dereferencing, ensure variables are initialized,
avoid initializing to `null` unless reassigned before use.

### AvoidDatabaseOperationInLoop

Detects database operations inside loops that cause performance degradation and
exceed governor limits.

**Entry Points:** Same as ApexFlsViolation

**Sinks:** DML operations inside loops, SOQL queries inside loops,
`Database.method()` calls inside loops

**Violation Messages:**

- `Database operation {Operation} was called inside a loop. [LoopStatement at {Location}]`
- `SOQL query was called inside a loop. [LoopStatement at {Location}]`

**Fix:** Move database operations outside loops, use bulk operations, collect
data in collections first.

### AvoidExpensiveSchemaLookups

Detects expensive schema lookups (`Schema.getGlobalDescribe()`,
`Schema.describeSObjects()`) that cause performance issues.

**Entry Points:** Same as ApexFlsViolation

**Sinks:** `Schema.getGlobalDescribe()`, `Schema.describeSObjects(...)`

**Sanitizers:** None (rule detects expensive operations, not security issues)

**Violation Messages:**

- `Schema.getGlobalDescribe was called inside a loop. [ForEachStatement at {Location}]`
- `Multiple expensive schema lookups are invoked. [Schema.describeSObjects at {Location}]`
- `Schema.getGlobalDescribe executed multiple times in the call stack. [getFields at {Location1}, getFields at {Location2}, ...]`

**Fix:** Move schema lookups outside loops, cache results, avoid multiple calls
in same path.

### DatabaseOperationsMustUseWithSharing

Identifies database operations in classes annotated as `without sharing` or
classes that inherit sharing implicitly instead of explicitly using
`inherited sharing`.

**Entry Points:** Same as ApexFlsViolation

**Sinks:** Any database operation (DML, SOQL)

**Sanitizers:** Class-level `with sharing` annotation, class-level
`inherited sharing` annotation

**Sharing Models:** `with sharing` (database transactions respect sharing rules,
default recommendation), `without sharing` (database transactions ignore sharing
rules, use with caution), `inherited sharing` (database transactions inherit
sharing model of calling class, use for flexibility)

**Violation Messages:**

- `Database operation must be executed from a class that enforces sharing rules.`
- `The database operation's class implicitly inherits a sharing model from {Class} {Method}. Explicitly assign a sharing model instead.`

**Fix:** Add `with sharing` or `inherited sharing` to class declaration.

### MissingNullCheckOnSoqlVariable

Identifies SOQL queries with variables in WHERE clauses that lack null checks.
When variable is null, O(1) operation becomes O(n) (full table scan).

**Entry Points:** Same as ApexFlsViolation

**Sinks:** SOQL queries with variables in WHERE clauses

**Sanitizers:** Null checks (`if (x != null) { ... }`), explicit non-null
assignment (`String x = 'asdf';`), checks for specific non-null values
(`if (x == 7) { ... }`)

**Violation Message:**
`Null check is missing for variable {VariableName} used in SOQL query.`

**Fix:** Add null check before SOQL query or assign to specific non-null value.

### UnimplementedType

Detects abstract classes and interfaces that are non-global and missing
implementations or extensions.

**Note:** Traditional static analysis rule (not data-flow based). Violation
occurs at declaration point.

**Violation Message:** `Extend, implement, or delete {Type} {Name}`

**Fix:** Implement/extend the type or delete if unnecessary. Rule excludes
`global` scoped classes to prevent false positives.

## Apache TinkerPop Integration

SFGE uses Apache TinkerPop graph computing framework to manage and traverse code
graph representations.

**Reference:** See [TINKERPOP.md](TINKERPOP.md) for complete framework
documentation.

### Graph Database Concepts

**Property Graph Model:** See [TINKERPOP.md](TINKERPOP.md#property-graph-model)
for the general Property Graph Model concept.

**SFGE-Specific Graph Structure:**

- **Vertices:** Code elements (methods, statements, expressions)
- **Edges:** Relationships (data flow, control flow)
- **Properties:** Metadata (line numbers, variable names, operation types)
- **Labels:** Categories ("Method", "DML", "SOQL", "EntryPoint")

**Graph Structure in SFGE:** Code is represented as a directed property graph.
Entry points are starting vertices. Code paths are sequences of connected
vertices and edges. Rules traverse paths from entry points to sinks. Graph is
constructed from Apex parse tree.

### Gremlin Query Language

Gremlin is a functional, data-flow language for graph traversal. SFGE uses
Gremlin internally for path analysis.

**Reference:** See [GREMLIN.md](GREMLIN.md) for complete Gremlin language
documentation.

**Note:** Developers don't need to write Gremlin queries. SFGE handles graph
construction and traversal internally using TinkerPop. The framework
automatically generates appropriate Gremlin traversals for path analysis.

### Graph Serialization Formats

TinkerPop supports multiple formats for graph persistence and exchange. See
format-specific docs: [GRAPHML.md](GRAPHML.md), [GRAPHSON.md](GRAPHSON.md),
[GRYO.md](GRYO.md), [GRAPHBINARY.md](GRAPHBINARY.md). For format comparison,
selection guidance, and general performance/configuration best practices, see
[TINKERPOP.md](TINKERPOP.md).

### Traversal Patterns

Common traversal patterns used in graph analysis: **Path Finding** (Shortest
Path, All Paths, Reachability, Path Length), **Pattern Matching** (Subgraph
Matching, Pattern Detection, Motif Finding, `match()` Step - declarative pattern
matching with multiple patterns, patterns defined using `as()` labels, patterns
matched independently and combined, useful for complex multi-hop queries),
**Graph Analysis** (Centrality - degree, betweenness, closeness, Community
Detection, Graph Metrics), **Data Extraction** (Subgraph Extraction, Property
Aggregation, Relationship Analysis).

SFGE uses these patterns internally to analyze code paths and detect violations.
The framework automatically applies appropriate traversal patterns based on rule
requirements.

## Performance Considerations

### Memory Management

- Complex paths may cause OutOfMemory errors
- SFGE dynamically calculates allowed complexity based on `java_max_heap_size`
- `disable_limit_reached_violations` can disable LimitReached violations if
  needed

### Threading

- `java_thread_count` controls parallel execution (default: 4)
- Increasing thread count allows more paths evaluated simultaneously
- `java_thread_timeout` prevents threads from running indefinitely (default:
  900000ms)

### Optimization Tips

1. **Reduce Entry Points:** Fewer entry points = less analysis
2. **Simplify Paths:** Fewer branches = faster analysis
3. **Increase Heap Size:** For large codebases, increase `java_max_heap_size`
4. **Adjust Thread Count:** Balance between speed and resource usage

## Suppression

Suppress SFGE violations using engine directives. See
[Managing False Positives/Negatives](#managing-false-positivesnegatives) for
details on the three levels of engine directives.

**Note:** Suppression syntax may vary. Check Salesforce Code Analyzer
documentation for current syntax.

## User Action Violations

If your SFGE analysis is intentionally blocked, it's because SFGE identified
something incorrect in your code. You must modify your code to unblock the
analysis.

| Message                                                             | Violation             | When it Occurs                                                            |
| ------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------- |
| Remove unreachable code to proceed with the analysis.               | User Action           | Returned one time on an entire analysis. Analysis of all code is blocked. |
| Rename or delete this reused variable to proceed with the analysis. | User Action Violation | Returned on a single path. Analysis of only that code path is blocked.    |

**Unreachable Code Example:**

```apex
public void myMethod() {
    throw new Exception('Error');
    return; // Unreachable code
}
```

SFGE analysis on this code results in the entire analysis being blocked:
`Remove unreachable code to proceed with the analysis.`

**Reused Variable Example:**

```apex
public void myMethod() {
    String input = 'value1';
    // ... some code ...
    String input = 'value2'; // Reused variable
}
```

SFGE analysis on this code path results in a User Action Violation on this path:
`Rename or delete this reused variable to proceed with the analysis.`

## Limitations

1. **Error Logs:** Error logs shown as
   `Internal error. Work in progress. Please ignore` indicate that the entry
   point's analysis didn't complete successfully. This issue is being worked on.
   In the meantime, you must verify the validity of this error manually.

2. **Duplicate Class Names:** SFGE handles unique class names. If the source
   code has two distinctly different files that have classes with duplicate
   names, SFGE fails with an error message:
   `<example_class> is defined in multiple files`. In cases like these: Provide
   a `--workspace` subpath to the source directory that has only one of the file
   names, set `--target` to the second file name, rerun the `code-analyzer run`
   command.

3. **Anonymous Apex Script:** SFGE doesn't handle anonymous Apex script. Provide
   the class directory path as the `--workspace` that doesn't include any
   anonymous Apex script.

4. **Namespace Placeholders:** SFGE doesn't handle namespace placeholders. Leave
   the namespace placeholder blank.

5. **Property Chain Depth:** SFGE supports Apex property chains with a depth of
   2 or fewer. For example, SFGE supports `Object.x` but not `Object.x.y`.

6. **Apex Triggers:** SFGE doesn't scan Apex triggers.

## Apex Security Enforcement Methods

### Enforce User Mode for Database Operations

Use `WITH USER_MODE` in SOQL queries to enforce field-level security (FLS) and
sharing rules:

```apex
// Enforces FLS and sharing rules
List<Account> accounts = [SELECT Id, Name FROM Account WITH USER_MODE];
```

**Benefits:** Automatically enforces FLS checks, respects sharing rules,
prevents access to fields user cannot read, recognized by SFGE as sanitizer for
FLS violations.

**Usage:** Add `WITH USER_MODE` to SOQL queries. Works with `SELECT`, `UPDATE`,
`DELETE` statements. Alternative to manual FLS checks.

### Security.stripInaccessible Method

Use `Security.stripInaccessible()` to remove fields and records the user cannot
access:

```apex
List<Account> accounts = [SELECT Id, Name, SecretField FROM Account];
// Remove inaccessible fields
SObjectAccessDecision decision = Security.stripInaccessible(
    AccessType.READABLE, accounts
);
List<Account> safeAccounts = decision.getRecords();
```

**Benefits:** Automatically filters inaccessible fields, returns only accessible
data, recognized by SFGE as sanitizer for FLS violations.

**Access Types:** `AccessType.READABLE` (filter fields user cannot read),
`AccessType.UPDATABLE` (filter fields user cannot update),
`AccessType.CREATABLE` (filter fields user cannot create).

### Enforcing Object and Field Permissions

Use Schema describe methods to check permissions before operations:

**Object-Level (CRUD) Checks:**

```apex
Schema.DescribeSObjectResult objDesc = Account.sObjectType.getDescribe();
if (objDesc.isDeletable()) {
    delete accounts;
}
```

**Field-Level (FLS) Checks:**

```apex
Schema.DescribeFieldResult fieldDesc = Account.Name.getDescribe();
if (fieldDesc.isAccessible()) { /* Read field */ }
if (fieldDesc.isUpdateable()) { /* Update field */ }
if (fieldDesc.isCreateable()) { /* Create field */ }
```

**Schema Methods:** `isAccessible()` (check if field can be read),
`isUpdateable()` (check if field can be updated), `isCreateable()` (check if
field can be created), `isDeletable()` (check if object can be deleted,
object-level).

**SFGE Recognition:** CRUD checks (recognized for DELETE, UNDELETE, MERGE
operations), FLS checks (recognized for READ, INSERT, UPDATE, UPSERT
operations), must be performed before the operation (between source and sink).
