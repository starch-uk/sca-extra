# Benchmark Fixtures Documentation

## Overview

The benchmark fixtures are comprehensive stress-test files designed to
explicitly stress each PMD rule with realistic, complex Apex code patterns.
These fixtures enable performance benchmarking and regression detection.

## Fixture Statistics

| Fixture                     | Size    | Estimated Violations | Primary Focus                                | Rules Covered    |
| --------------------------- | ------- | -------------------- | -------------------------------------------- | ---------------- |
| `stress-test-all-rules.cls` | 5.5 KB  | 100+                 | All rules (comprehensive)                    | All 41 PMD rules |
| `stress-code-style.cls`     | 15 KB   | 200+                 | Code style rules                             | 15 rules         |
| `stress-design.cls`         | 10.3 KB | 130+                 | Design rules (structure + method signatures) | 15 rules         |
| `stress-best-practices.cls` | 5.7 KB  | 100+                 | Best practices rules (modifiers)             | 5 rules          |
| `stress-code-style.cls`     | 18.2 KB | 300+                 | Code style rules (including naming)          | 19 rules         |
| `stress-documentation.cls`  | 3.9 KB  | 30+                  | Documentation rules                          | 2 rules          |

**Total: ~43 KB of stress-test code with 560+ potential violations across 41 PMD
rules**

**Note:** Regex rules (NoConsecutiveBlankLines, ProhibitSuppressWarnings) are
not included in PMD benchmark fixtures as they use a different engine.

## Rule Coverage

### Code Style Rules (200+ violations)

- ✅ AvoidOneLinerMethods (10 violations)
- ✅ MapShouldBeInitializedWithValues (10 violations)
- ✅ MultipleStringContainsCalls (10 violations)
- ✅ NoMethodCallsAsArguments (10 violations)
- ✅ NoMethodCallsInConditionals (20 violations)
- ✅ PreferBuilderPatternChaining (10 violations)
- ✅ PreferConcatenationOverStringJoinWithEmpty (10 violations)
- ✅ PreferMethodCallsInLoopConditions (10 violations)
- ✅ PreferNullCoalescingOverTernary (15 violations)
- ✅ PreferSafeNavigationOperator (15 violations)
- ✅ PreferStringJoinOverConcatenation (10 violations)
- ✅ PreferStringJoinOverMultipleNewlines (10 violations)
- ✅ PreferStringJoinWithSeparatorOverEmpty (10 violations)
- ✅ SingleArgumentMustBeSingleLine (10 violations)

**Note:** NoConsecutiveBlankLines is a Regex rule (not PMD), so it's not
included in PMD benchmark fixtures.

### Code Style Rules - Naming (100+ violations)

- ✅ NoSingleLetterVariableNames (30 violations)
- ✅ NoAbbreviations (90 violations: 50 variables + 20 parameters + 20 fields)
- ✅ VariablesMustNotShareNamesWithClasses (10 violations)
- ✅ InnerClassesMustBeOneWord (5 violations)

### Design Rules (130+ violations)

- ✅ InnerClassesCannotBeStatic (1 violation)
- ✅ InnerClassesCannotHaveStaticMembers (2 violations)
- ✅ InnerClassesMustBeOneWord (2 violations)
- ✅ NoParameterClasses (3 violations)
- ✅ ClassesMustHaveMethods (3 violations)
- ✅ AvoidTrivialPropertyGetters (10 violations)
- ✅ NoThisOutsideConstructors (5 violations)
- ✅ NoUnnecessaryReturnVariables (5 violations)
- ✅ NoUnnecessaryAttributeVariables (5 violations)
- ✅ CombineNestedIfStatements (4 violations)
- ✅ PreferSwitchOverIfElseChains (3 violations)
- ✅ PreferPropertySyntaxOverGetterMethods (5 violations)
- ✅ AvoidLowValueWrapperMethods (3 violations)
- ✅ EnumMinimumValues (2 violations)
- ✅ NoCustomParameterObjects (15 violations)
- ✅ SingleParameterMustBeSingleLine (15 violations)

### Best Practices Rules (100+ violations)

- ✅ StaticVariablesMustBeFinalAndScreamingSnakeCase (20 violations)
- ✅ RegexPatternsMustBeStaticFinal (20 violations)
- ✅ FinalVariablesMustBeFinal (20 violations)
- ✅ StaticMethodsMustBeStatic (20 violations)
- ✅ TestClassIsParallel (1 violation)

### Documentation Rules (30+ violations)

- ✅ ExceptionDocumentationRequired (20 violations)
- ✅ SingleLineDocumentationFormat (10 violations)

## Design Principles

### 1. Realistic Patterns

All violations use realistic Apex code patterns that developers might actually
write, making benchmarks representative of real-world performance.

### 2. Multiple Violations Per Rule

Each rule is stressed with multiple violations (typically 10-20) to:

- Test XPath expression performance at scale
- Measure rule efficiency with many matches
- Detect performance regressions

### 3. Complex Nesting

Fixtures include deeply nested structures to stress test:

- XPath traversal performance
- AST navigation efficiency
- Complex predicate evaluation

### 4. Mixed Patterns

Fixtures combine multiple rule violations in realistic combinations to test:

- Rule interaction performance
- Overall system performance
- Memory usage patterns

## Usage

### Running Benchmarks

```bash
# Run all benchmarks
pnpm benchmark

# Generate baseline
pnpm benchmark -- --baseline

# JSON output for CI
pnpm benchmark -- --json

# Compare mode (doesn't fail on regressions)
pnpm benchmark -- --compare
```

### Benchmark Output

The benchmark script:

1. Tests each rule against all fixtures
2. Measures execution time
3. Counts violations detected
4. Compares against baseline (if exists)
5. Detects performance regressions (>10% slower)

### Results Location

- Results: `benchmarks/results/results-{timestamp}.json`
- Baseline: `benchmarks/results/baseline.json`

## Performance Characteristics

These fixtures are designed to stress:

1. **XPath Expression Performance**
    - Complex nested queries
    - Multiple predicate evaluations
    - Deep AST traversal

2. **Rule Scalability**
    - Large files (up to 15 KB)
    - Many violations per file
    - Multiple rule categories

3. **Memory Efficiency**
    - Complex object structures
    - Deep nesting
    - Multiple rule evaluations

4. **Real-World Scenarios**
    - Common code patterns
    - Typical violation counts
    - Mixed rule interactions

## Maintenance

When adding new rules:

1. Add violations to `stress-test-all-rules.cls`
2. Add focused violations to category-specific fixture
3. Update this documentation
4. Regenerate baseline: `pnpm benchmark -- --baseline`

## Notes

- Fixtures use realistic Apex syntax
- Violations are intentionally placed to stress rules
- Some violations may overlap (realistic scenario)
- File sizes are optimized for performance testing
- All fixtures are formatted with Prettier
