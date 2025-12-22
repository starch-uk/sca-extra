# XPath 3.1 Quick Reference for AI Agents

## Core Concepts

**Data Model:** Sequences of items (nodes, atomic values, maps, arrays, functions). Empty sequence `()`. Single item = one-item sequence.

**Context:** Current item (`.`), position (`position()`), size (`last()`), variables (`$var`).

**Location Paths:** `/` (root), `//` (descendant-or-self), `.` (self), `..` (parent), `@` (attribute).

## Expressions

### Path Expressions

- `/path/to/node` - Absolute path from root
- `child::node` - Child axis (default)
- `./relative/path` - Relative to context
- `//node` - Any descendant
- `@attr` - Attribute

### Primary Expressions

- `'string'` / `"string"` - String literal
- `42`, `3.14`, `true()`, `false()` - Literals
- `$variable` - Variable reference
- `(expr)` - Parenthesized
- `.` - Context item
- `..` - Parent node

### Sequences

- `(1, 2, 3)` - Sequence constructor
- `$a, $b` - Concatenation
- `[]` - Empty sequence (same as `()`)
- `[1 to 10]` - Range

## Operators

### Arithmetic

- `+`, `-`, `*`, `div`, `idiv`, `mod` - Numeric ops

### Comparison

- `=`, `!=`, `<`, `<=`, `>`, `>=` - Value comparison (atomizes)
- `eq`, `ne`, `lt`, `le`, `gt`, `ge` - General comparison (singleton)

### Logical

- `and`, `or` - Boolean (both operands evaluated)
- `not()` - Negation

### Other

- `||` - String concatenation
- `instance of` - Type check
- `cast as`, `castable as`, `treat as` - Type operations
- `:=` - Assignment (let)
- `!` - Simple map (applies to each item)
- `?` - Lookup (maps/arrays)

## Axes

- `child::` (default, can omit) - Direct children
- `descendant::` - All descendants
- `descendant-or-self::` - Self + descendants (`//`)
- `parent::` - Parent (`..`)
- `ancestor::` - All ancestors
- `ancestor-or-self::` - Self + ancestors
- `following-sibling::` - Siblings after
- `preceding-sibling::` - Siblings before
- `following::` - Nodes after in doc order
- `preceding::` - Nodes before in doc order
- `attribute::` (`@`) - Attributes
- `namespace::` - Namespace nodes
- `self::` (`.`) - Self

## Node Tests

- `*` - Any element/child
- `node()` - Any node
- `text()` - Text node
- `comment()` - Comment
- `processing-instruction()` - PI
- `element()`, `element(name)` - Element
- `attribute()`, `attribute(name)` - Attribute
- `document-node()`, `document-node(element(name))` - Document

## Predicates

- `[1]` - Position (first)
- `[last()]` - Last position
- `[position() = 1]` - Explicit position
- `[@attr = 'value']` - Filter by attribute
- `[count(child) > 0]` - Filter by condition
- `[some $x in child satisfies $x/@val > 0]` - Quantified

## Functions (Essential)

### String

- `fn:concat($a, $b, ...)` - Concatenate
- `fn:substring($s, $start, $len?)` - Substring
- `fn:string-length($s?)` - Length
- `fn:contains($hay, $needle)` - Contains
- `fn:starts-with($s, $prefix)`, `fn:ends-with($s, $suffix)`
- `fn:matches($s, $pattern)` - Regex match
- `fn:replace($s, $pattern, $replacement)` - Replace
- `fn:lower-case($s)`, `fn:upper-case($s)`
- `fn:normalize-space($s?)` - Trim + normalize whitespace
- `fn:substring-before($s, $delim)`, `fn:substring-after($s, $delim)`

### Numeric

- `fn:count($seq)` - Count items
- `fn:sum($seq)`, `fn:avg($seq)`, `fn:min($seq)`, `fn:max($seq)`
- `fn:abs($n)`, `fn:floor($n)`, `fn:ceiling($n)`, `fn:round($n)`

### Boolean

- `fn:not($b)` - Negation
- `fn:true()`, `fn:false()` - Constants
- `fn:empty($seq)` - Empty check
- `fn:exists($seq)` - Non-empty check

### Sequence

- `fn:distinct-values($seq)` - Unique values
- `fn:reverse($seq)` - Reverse order
- `fn:subsequence($seq, $start, $len?)` - Slice
- `fn:index-of($seq, $item)` - Find position(s)
- `fn:remove($seq, $pos)` - Remove at position
- `fn:insert-before($seq, $pos, $item)` - Insert
- `fn:head($seq)`, `fn:tail($seq)` - First/rest

### Type/Conversion

- `fn:data($item)` - Typed value
- `fn:string($item?)` - String conversion
- `fn:number($item?)` - Number conversion
- `fn:boolean($item)` - Boolean conversion

### Node

- `fn:name($node?)` - Node name
- `fn:local-name($node?)` - Local name (no prefix)
- `fn:namespace-uri($node?)` - Namespace URI
- `fn:root($node?)` - Root node

## XPath 3.1: Maps

### Constructor

```xpath
map { 'key': value, 'key2': value2 }
map:entry('key', value)
map:merge((map1, map2, ...))
```

### Lookup

```xpath
$map('key')           # Function call syntax
$map?key              # Lookup operator
$map?('key')          # Lookup with parens
?key                  # Unary lookup (context item)
```

### Functions

- `map:keys($map)` - All keys
- `map:contains($map, $key)` - Has key
- `map:get($map, $key)` - Get value
- `map:put($map, $key, $value)` - New map with added entry
- `map:remove($map, $key)` - New map without key
- `map:size($map)` - Entry count

## XPath 3.1: Arrays

### Constructor

```xpath
[value1, value2, value3]
array { $a, $b, $c }
```

### Lookup

```xpath
$array(1)             # Function call (1-based)
$array?1              # Lookup operator
?1                    # Unary lookup (context item)
?*                    # All members (flatten)
```

### Functions

- `array:size($array)` - Length
- `array:get($array, $index)` - Get (1-based)
- `array:put($array, $index, $value)` - New array with updated value
- `array:append($array, $value)` - New array with appended value
- `array:subarray($array, $start, $len?)` - Slice
- `array:remove($array, $index)` - New array without element
- `array:reverse($array)` - Reversed copy
- `array:join($arrays)` - Concatenate arrays
- `array:flatten($array)` - Flatten nested arrays
- `array:for-each($array, $func)` - Map function
- `array:filter($array, $func)` - Filter by function
- `array:fold-left($array, $zero, $func)`, `array:fold-right(...)` - Reduce

## Conditional Expressions

```xpath
if ($cond) then $a else $b
```

## Quantified Expressions

```xpath
some $var in $seq satisfies $expr    # Exists
every $var in $seq satisfies $expr   # For all
```

## Let Expression

```xpath
let $var := $expr return $result
let $a := 1, $b := 2 return $a + $b
```

## For Expression

```xpath
for $var in $seq return $expr
for $i in (1 to 10) return $i * 2
```

## Arrow Operator (=>)

```xpath
$seq => fn:distinct-values() => fn:reverse()
# Equivalent to: fn:reverse(fn:distinct-values($seq))
```

## Simple Map Operator (!)

```xpath
$seq ! (./child/@attr)
# Applies expression to each item, flattens results
```

## Type Tests

- `$item instance of xs:integer` - Type check
- `$item cast as xs:string` - Cast (errors on failure)
- `$item castable as xs:string` - Can cast?
- `$item treat as xs:string` - Assert type (errors if wrong)

## Common Patterns (PMD/AST Context)

### Find nodes with attribute

```xpath
//Node[@Attribute = 'value']
//Method[@Static = true()]
```

### Find nodes with child condition

```xpath
//Parent[child/@attr = 'val']
//Method[BlockStatement//ReturnStatement]
```

### Position/Count

```xpath
//Node[position() = 1]
//Node[last()]
//Node[count(child::*) > 0]
```

### Ancestor/Descendant

```xpath
//Node[ancestor::Class[@Name = 'MyClass']]
//Class[descendant::Method[@Name = 'test']]
```

### Siblings

```xpath
//Node[following-sibling::Node[@Type = 'expected']]
//Node[preceding-sibling::Node[1]]
```

### String operations

```xpath
//Node[string-length(@Image) = 1]
//Node[starts-with(@Name, 'get')]
//Node[contains(@Name, 'Test')]
```

### Logical combinations

```xpath
//Node[@A = true() and @B = false()]
//Node[@A = true() or @B = true()]
//Node[not(@Static)]
```

### Quantified

```xpath
//Node[some $child in child::* satisfies $child/@Type = 'expected']
//Node[every $param in Parameter satisfies string-length($param/@Name) > 1]
```

### Functions in predicates

```xpath
//Method[count(Parameter) > 2]
//Class[exists(descendant::Method)]
//Sequence[empty(child::*)]
```

## Important Notes

- **Atomization:** Comparisons auto-atomize sequences
- **Effective Boolean Value:** Non-empty sequences = true (except `""`, `0`, `NaN`, `false()`)
- **Document Order:** Nodes processed in document order
- **Context:** `.` = current item, `position()` = current position, `last()` = sequence size
- **Namespaces:** Use prefixes or `Q{uri}local` syntax
- **Errors:** Dynamic errors can be caught with `try/catch` (XPath 3.1)
