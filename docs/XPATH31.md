```markdown
# XPath 3.1 Reference

## Core
- **Model:** Sequences of items (nodes, atomics, maps, arrays, functions). `()` = empty.
- **Context:** `.` (current), `position()`, `last()`, `$var`
- **Paths:** `/` (root), `//` (descendant-or-self), `..` (parent), `@` (attribute)

## Operators
| Type | Operators |
|------|-----------|
| Arithmetic | `+ - * div idiv mod` |
| Value cmp | `= != < <= > >=` (atomizes) |
| General cmp | `eq ne lt le gt ge` (singleton) |
| Logical | `and or not()` |
| Other | `\|\|` (concat), `!` (map), `?` (lookup), `:=` (assign), `=>` (arrow) |
| Type | `instance of`, `cast as`, `castable as`, `treat as` |

## Axes
`child::` (default), `descendant::`, `descendant-or-self::` (//), `parent::` (..), `ancestor::`, `ancestor-or-self::`, `following-sibling::`, `preceding-sibling::`, `following::`, `preceding::`, `attribute::` (@), `namespace::`, `self::` (.)

## Node Tests
`*` (any element), `node()`, `text()`, `comment()`, `processing-instruction()`, `element(name?)`, `attribute(name?)`, `document-node()`

## Predicates
`[1]` (first), `[last()]`, `[position()=1]`, `[@attr='val']`, `[count(x)>0]`, `[some $x in y satisfies cond]`

## Functions

### String
`concat`, `substring($s,$start,$len?)`, `string-length`, `contains`, `starts-with`, `ends-with`, `matches($s,$regex)`, `replace($s,$pat,$repl)`, `lower-case`, `upper-case`, `normalize-space`, `substring-before`, `substring-after`

### Numeric
`count`, `sum`, `avg`, `min`, `max`, `abs`, `floor`, `ceiling`, `round`

### Boolean
`not`, `true`, `false`, `empty`, `exists`

### Sequence
`distinct-values`, `reverse`, `subsequence($seq,$start,$len?)`, `index-of`, `remove($seq,$pos)`, `insert-before`, `head`, `tail`

### Node
`name`, `local-name`, `namespace-uri`, `root`

### Type
`data`, `string`, `number`, `boolean`

## Maps
```xpath
map { 'k': v }                    # Constructor
$m('k')  $m?k  $m?('k')  ?k       # Lookup
map:keys  map:contains  map:get  map:put  map:remove  map:size  map:merge  map:entry
```

## Arrays
```xpath
[v1, v2]  array { $a, $b }       # Constructor (1-based)
$a(1)  $a?1  ?1  ?*              # Lookup (?* = all/flatten)
array:size  array:get  array:put  array:append  array:subarray  array:remove
array:reverse  array:join  array:flatten  array:for-each  array:filter  array:fold-left/right
```

## Expressions

### Conditional
```xpath
if ($cond) then $a else $b
```

### Quantified
```xpath
some $v in $seq satisfies $expr   # exists
every $v in $seq satisfies $expr  # forall
```

### Let (comma-separated bindings preferred)
```xpath
let $a := 1, $b := 2 return $a + $b
```

### For
```xpath
for $i in (1 to 10) return $i * 2
```

### Arrow
```xpath
$seq => distinct-values() => reverse()   # = reverse(distinct-values($seq))
```

### Simple Map
```xpath
$seq ! (./child/@attr)   # apply to each, flatten
```

## Common Patterns

### Basic
```xpath
//Node[@Attr='val']                      # attr match
//Parent[child/@a='v']                   # child condition
//Node[ancestor::Class[@Name='X']]       # ancestor check
//Node[following-sibling::Node[@T='x']]  # sibling check
```

### With let (must be parenthesized in predicates)
```xpath
//Node[
    condition1
    and (
        let $v := @Attr
        return count(following-sibling::Node[@Attr=$v]) >= 2
    )
]
```

### Ancestor scope aggregation
```xpath
//IfBlock[
    let $method := ancestor::Method[1],
        $all := $method//IfBlock
    return count($all) >= 5
]
```

### Sum with conditional for
```xpath
//Node[
    let $var := @Image, $method := ancestor::Method[1]
    return sum(
        for $b in $method//Node return
            if (exists($b/X)) then count($b//Y[@V=$var]) else 0
    ) >= 5
]
```

### Consecutive siblings
```xpath
//Node[
    @A='v'
    and not(preceding-sibling::*[1][self::Node[@A=current()/@A]])
    and (let $a := @A return count(following-sibling::Node[@A=$a]) + 1 >= 2)
]
```

### Quantified with parentheses (required with and/or)
```xpath
//Node[
    (some $x in $s1 satisfies $x/@v='a')
    and not((some $y in $s2 satisfies $y/@v='b'))
]
```

## Pitfalls

| Issue | Solution |
|-------|----------|
| `let` in predicate | Wrap in parens: `cond and (let $x:=... return ...)` |
| `let` in `not()` | Restructure: use `some`/`every` or move `let` outside |
| `some`/`every` after `and` | Wrap quantifier: `and (some $x in...)` |
| `tokenize('')` | Check `string-length($s)>0` first |
| Nested `let` | Use comma-separated: `let $a:=1, $b:=2 return...` |

## Notes
- Atomization: comparisons auto-atomize
- EBV: non-empty seq = true (except `""`, `0`, `NaN`, `false()`)
- Document order preserved
- Namespaces: prefixes or `Q{uri}local`
- Errors: `try/catch` in 3.1
```
