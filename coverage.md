# XPath Code Coverage in SCA-Extra

## Overview

The `pnpm test:coverage` command provides comprehensive code coverage analysis
for PMD rules in the SCA-Extra project. Unlike traditional code coverage that
measures which lines of source code are executed during testing, this coverage
system measures:

1. **Rule Test Coverage**: Whether each rule has corresponding unit tests
2. **XPath Expression Coverage**: Whether XPath expressions in PMD rules are
   properly tested with appropriate fixtures
3. **AST Node Type Coverage**: Whether test fixtures contain code patterns that
   exercise all AST node types targeted by XPath expressions

## How It Works

### Architecture

The coverage system consists of three main scripts:

- **`scripts/check-rule-coverage.js`** - Main orchestrator
- **`scripts/check-xpath-coverage.js`** - XPath-specific coverage analysis
- **`scripts/generate-lcov.js`** - LCOV format output generation

### Coverage Types

#### 1. Rule Test Coverage

**Purpose**: Ensures every rule has at least one unit test.

**Process**:

1. Scans all XML rule files in `rulesets/` directories
2. Extracts regex rules from `code-analyzer.yml`
3. Parses all `*.test.js` files in `tests/unit/`
4. Matches rule references in test files against rule names
5. Reports coverage statistics

**Coverage Criteria**:

- ✅ **Covered**: Rule has corresponding test file with matching rule name
- ❌ **Uncovered**: Rule has no test file or test file doesn't reference the
  rule

#### 2. XPath Expression Coverage

**Purpose**: Ensures XPath expressions are thoroughly tested against real code
patterns.

**Process**:

1. Extracts XPath expressions from rule XML files using DOM parsing
2. Analyzes XPath to identify targeted AST node types
3. Scans test fixtures for code patterns matching those node types
4. Validates fixture completeness

**Coverage Levels**:

##### Fully Covered ✅

- Rule has both positive and negative test fixtures
- All AST node types in XPath are represented in fixture code
- XPath expressions are exercised by realistic code patterns

##### Partially Covered ⚠️

- Rule has fixtures but some AST node types are missing
- XPath targets node types not present in test code
- Union operators (`|`) or complex logic may not be fully tested

##### Not Covered ❌

- Missing positive fixture (valid code that should pass)
- Missing negative fixture (invalid code that should fail)
- No fixtures exist for the rule

### AST Node Type Analysis

The system analyzes XPath expressions to extract targeted AST node types:

```xml
<!-- Example XPath from AvoidMagicNumbers.xml -->
<property name="xpath">
    <value>
    <![CDATA[
    //LiteralExpression[
      @String = false()
      and @Null = false()
      and (@LiteralType = 'INTEGER' or @LiteralType = 'LONG')
      and not(@Image = $allowedNumbers)
      ...
    ]
    ]]>
  </value>
</property>
```

**Extracted Node Types**:

- `LiteralExpression` - The primary target
- Attributes: `@String`, `@Null`, `@LiteralType`, `@Image`
- Operators: `and`, `or`, `not`

### Fixture Validation

For each XPath expression, the system validates that test fixtures contain
appropriate code patterns:

#### Node Type Mapping

The system uses a heuristic mapping to check if fixtures contain relevant code:

```javascript
const nodeTypeMap = {
    IfBlockStatement: ['if', 'else if'],
    WhileLoopStatement: ['while'],
    LiteralExpression: ['null', 'true', 'false', '0', '1'],
    MethodCallExpression: ['(', 'method'],
    // ... more mappings
};
```

#### Coverage Validation

For each node type in the XPath:

1. Check if fixture contains keywords associated with that node type
2. Report missing node types that aren't covered by test code
3. Flag complex XPath features (unions, let expressions) for manual review

## Running Coverage

### Basic Coverage Report

```bash
pnpm test:coverage
```

**Output**:

```
📊 Rule Test Coverage Report

Total Rules: 49
Covered: 49 (100.0%)
Uncovered: 0 (0.0%)

✅ Rules with tests:
  - code-style/AvoidMagicNumbers.xml
  - design/CombineNestedIfStatements.xml
  ...

🔍 Checking XPath coverage for XML rules...

📊 XPath Coverage Report

Total XML Rules: 45
Fully Covered: 45 (100.0%)
Partially Covered: 0 (0.0%)
Not Covered: 0 (0.0%)

✅ All XPath expressions have full coverage!
```

### Coverage Files

The system generates LCOV format coverage files in `coverage/lcov.info`:

```
TN:
SF:rulesets/code-style/AvoidMagicNumbers.xml
FN:1,AvoidMagicNumbers
FNF:1
FNH:1
FNDA:1,AvoidMagicNumbers
DA:1,1
DA:2,1
...
LF:38
LH:38
end_of_record
```

**LCOV Format Explanation**:

- `SF:` - Source file path
- `FN:` - Function definition (rule name)
- `FNF:`/`FNH:` - Functions found/hit
- `DA:` - Line coverage (line number, hit count)
- `LF:`/`LH:` - Lines found/hit

## Coverage Metrics

### Rule Coverage Metrics

- **Total Rules**: All PMD XML rules + regex rules from `code-analyzer.yml`
- **Coverage Percentage**: Rules with tests / Total rules
- **Uncovered Rules**: Rules requiring test implementation

### XPath Coverage Metrics

- **Fully Covered**: Rules with complete fixture coverage
- **Partially Covered**: Rules missing some node type coverage
- **Not Covered**: Rules without adequate fixtures

### Node Type Coverage

For each XPath expression:

- **Node Types Found**: AST node types targeted by XPath
- **Node Types Covered**: Node types with matching fixture code
- **Missing Node Types**: Node types not represented in tests

## Best Practices

### Writing Test Fixtures

#### Positive Fixtures (`tests/fixtures/positive/`)

- Contain valid code that should NOT trigger violations
- Exercise all code paths in XPath expressions
- Include edge cases and boundary conditions
- Use realistic code patterns developers actually write

#### Negative Fixtures (`tests/fixtures/negative/`)

- Contain invalid code that SHOULD trigger violations
- Demonstrate problematic patterns the rule detects
- Include multiple violation examples per rule
- Test rule boundaries and exceptions

### XPath Expression Design

#### Coverage-Friendly XPath

```xml
<!-- Good: Clear node type targeting -->
//IfBlockStatement[not(ElseBlockStatement)]

<!-- Good: Explicit attribute checks -->
//Method[@Static = true() and @Final = true()]

<!-- Avoid: Complex logic that may need manual verification -->
//Method[let $params := count(Parameter) return $params > 5]
```

#### Node Type Completeness

Ensure XPath expressions target specific, testable node types:

- Use concrete AST node names (`IfBlockStatement`, `Method`, `Field`)
- Avoid overly generic expressions that match everything
- Consider performance implications of broad XPath selectors

### Coverage Maintenance

#### Regular Validation

- Run `pnpm test:coverage` after rule modifications
- Ensure XPath changes don't break fixture coverage
- Update fixtures when rule logic changes

#### Benchmark Integration

- Coverage results feed into benchmark fixtures
- Maintain realistic violation counts (10-20 per rule)
- Update `benchmarks/FIXTURES.md` with coverage changes

## Troubleshooting

### Common Issues

#### Missing Node Type Coverage

```
⚠️  Rules with coverage issues:
  - code-style/ExampleRule.xml
    Missing coverage for node types: IfBlockStatement, WhileLoopStatement
```

**Solution**: Add code patterns to fixtures that use `if` statements and `while`
loops.

#### Fixture Content Mismatch

```
⚠️  Rules with coverage issues:
  - design/ComplexRule.xml
    XPath contains union operators (|) - ensure all branches are tested
```

**Solution**: Verify test fixtures exercise all union branches in XPath.

#### Regex Rule Coverage

Regex rules from `code-analyzer.yml` are validated differently:

- Test files must use `describe('RuleName', ...)` format
- Coverage based on test suite existence, not fixture analysis

### Debugging XPath Coverage

#### AST Inspection

Use the AST dump tool to understand actual node structures:

```bash
pnpm ast-dump tests/fixtures/negative/code-style/ExampleRule.cls
```

#### Manual XPath Testing

Test XPath expressions directly against fixtures:

```bash
pmd check --file fixture.cls -R rule.xml -f xml
```

#### Coverage Analysis

Run individual coverage components:

```bash
# Check only XPath coverage
node scripts/check-xpath-coverage.js

# Generate only LCOV files
node scripts/generate-lcov.js
```

## Integration with CI/CD

### Automated Coverage Checks

- Coverage runs as part of `pnpm ci` pipeline
- Failures block merges when rules lack test coverage
- LCOV files can be uploaded to coverage reporting services

### Coverage Thresholds

- 100% rule coverage required for all XML and regex rules
- XPath coverage must be "fully covered" for all rules
- Partial coverage generates warnings but doesn't fail builds

## Advanced Topics

### XPath Complexity Analysis

The system detects complex XPath features requiring extra scrutiny:

#### Union Operators (`|`)

```xml
<!-- XPath with union - needs testing of both branches -->
//IfBlockStatement | //WhileLoopStatement
```

#### Let Expressions

```xml
<!-- Complex logic - manual verification required -->
let $params := count(Parameter)
return //Method[$params > 3]
```

#### Attribute Patterns

```xml
<!-- Attribute checking - ensure fixtures test all conditions -->
//Method[@Static = true() and @Final = false()]
```

### Performance Considerations

#### XPath Execution Cost

- Broad XPath expressions (e.g., `//*`) scan entire AST
- Complex predicates add computational overhead
- Coverage ensures rules remain performant through realistic testing

#### Test Fixture Size

- Large fixtures increase analysis time
- Balance completeness with execution speed
- Use representative samples rather than exhaustive examples

### Future Enhancements

#### Planned Improvements

- **XPath Branch Coverage**: Track which XPath conditions are exercised
- **AST Mutation Testing**: Generate test cases from XPath expressions
- **Coverage Differentials**: Compare coverage across rule versions
- **Interactive Coverage Reports**: Web-based coverage visualization

#### Research Areas

- **XPath Optimization**: Automatically suggest more efficient XPath patterns
- **Fixture Generation**: AI-assisted creation of comprehensive test fixtures
- **Coverage Prediction**: Estimate coverage impact of XPath changes

## Conclusion

XPath code coverage in SCA-Extra ensures rule reliability through comprehensive
testing. By validating both rule existence and XPath expression coverage, the
system guarantees that PMD rules work correctly against real Salesforce Apex
code patterns. The combination of automated analysis and LCOV reporting provides
both development-time feedback and CI/CD integration for maintaining
high-quality code analysis rules.
