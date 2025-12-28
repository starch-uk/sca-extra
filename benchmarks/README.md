# Benchmark Fixtures

This directory contains comprehensive stress-test fixtures designed to benchmark PMD rule performance.

## Fixture Files

### `stress-test-all-rules.cls`
A comprehensive fixture containing violations across all rule categories. This file is designed to stress test the entire rule set simultaneously.

### `stress-code-style.cls`
Focused stress test for code-style rules (including naming) with 300+ violations:
- AvoidOneLinerMethods (10 violations)
- ListInitializationMustBeMultiLine (10 violations)
- MapInitializationMustBeMultiLine (10 violations)
- MapShouldBeInitializedWithValues (10 violations)
- MultipleStringContainsCalls (10 violations)
- NoMethodCallsAsArguments (10 violations)
- NoMethodCallsInConditionals (20 violations)
- PreferBuilderPatternChaining (10 violations)
- PreferConcatenationOverStringJoinWithEmpty (10 violations)
- PreferMethodCallsInLoopConditions (10 violations)
- PreferNullCoalescingOverTernary (15 violations)
- PreferSafeNavigationOperator (15 violations)
- PreferStringJoinOverConcatenation (10 violations)
- PreferStringJoinOverMultipleNewlines (10 violations)
- PreferStringJoinWithSeparatorOverEmpty (10 violations)
- SingleArgumentMustBeSingleLine (10 violations)
- NoSingleLetterVariableNames (30 violations)
- NoAbbreviations (50 violations)
- VariablesMustNotShareNamesWithClasses (10 violations)
- InnerClassesMustBeOneWord (5 violations)

**Note:** NoConsecutiveBlankLines is a Regex rule (not PMD), so it's not included in PMD benchmark fixtures.

### `stress-design.cls`
Focused stress test for design rules (structure + method signatures) with 130+ violations:
- InnerClassesCannotBeStatic (1 violation)
- InnerClassesCannotHaveStaticMembers (2 violations)
- InnerClassesMustBeOneWord (2 violations)
- NoParameterClasses (3 violations)
- ClassesMustHaveMethods (3 violations)
- AvoidTrivialPropertyGetters (10 violations)
- NoThisOutsideConstructors (5 violations)
- NoUnnecessaryReturnVariables (5 violations)
- NoUnnecessaryAttributeVariables (5 violations)
- CombineNestedIfStatements (4 violations)
- PreferSwitchOverIfElseChains (3 violations)
- PreferPropertySyntaxOverGetterMethods (5 violations)
- AvoidLowValueWrapperMethods (3 violations)
- EnumMinimumValues (2 violations)
- NoCustomParameterObjects (15 violations)
- SingleParameterMustBeSingleLine (15 violations)

### `stress-best-practices.cls`
Focused stress test for best practices rules (modifiers) with 100+ violations:
- StaticVariablesMustBeFinalAndScreamingSnakeCase (20 violations)
- RegexPatternsMustBeStaticFinal (20 violations)
- FinalVariablesMustBeFinal (20 violations)
- StaticMethodsMustBeStatic (20 violations)
- TestClassIsParallel (1 violation)

## Usage

Run benchmarks with:

```bash
pnpm benchmark
```

Generate baseline:

```bash
pnpm benchmark -- --baseline
```

JSON output for CI:

```bash
pnpm benchmark -- --json
```

## Performance Characteristics

These fixtures are designed to:
1. **Stress test XPath expressions** - Complex nested structures challenge XPath performance
2. **Trigger multiple violations** - Each rule is tested with many violations
3. **Simulate real-world code** - Patterns reflect common Apex code issues
4. **Measure scalability** - Large files test rule performance at scale

## Benchmark Results

Results are saved to `benchmarks/results/` and include:
- Execution time per rule
- Number of violations detected
- Performance regression detection
- Comparison against baseline

