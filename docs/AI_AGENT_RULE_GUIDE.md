````markdown
# AI Agent PMD Rule Configuration Guide

Configure PMD rules for Salesforce Apex code analysis. Provides rule info,
violations, valid examples, and configuration properties.

## Related Docs

- **[PMD.md](PMD.md)** - PMD essentials
- **[CODE_ANALYZER_CONFIG.md](CODE_ANALYZER_CONFIG.md)** - `code-analyzer.yml`
  config
- **[XPATH31.md](XPATH31.md)** - XPath 3.1 for rule queries
- **[APEX_PMD_AST.md](APEX_PMD_AST.md)** - PMD Apex AST nodes
- **[REGEX.md](REGEX.md)** - Regex engine rules
- **[SUPPRESS_WARNINGS.md](SUPPRESS_WARNINGS.md)** - Suppression methods
- **[APEXDOC.md](APEXDOC.md)** - ApexDoc syntax
- **[MIGRATION_GUIDES.md](MIGRATION_GUIDES.md)** - PMD 7 migration and rule
  versioning

## Creating Rules

1. **AST Structure** - Reference APEX_PMD_AST.md for node types
2. **XPath** - Use XPATH31.md syntax; test against positive/negative cases
3. **Format** - Follow PMD Rule Format below; use property substitution
4. **Config** - Show `code-analyzer.yml` examples with properties

**Important Notes:**

- **XML Schema Location**: The `xsi:schemaLocation` attribute must use
  `http://pmd.sourceforge.net/ruleset/2.0.0` (with dots) for the namespace and
  `https://pmd.sourceforge.io/ruleset_2_0_0.xsd` (with underscores) for the
  schema URL. Do not use `2_0_0.xsd` in the namespace.
- **Apex File Structure**: Apex files can only contain one top-level class. Test
  fixtures must use a single class with multiple methods/fields, not multiple
  top-level classes.
- **Single-Line Comments**: PMD's Apex parser does not include single-line
  comments (`//`) in the AST. Use regex-based rules (see `docs/REGEX.md`) for
  detecting patterns in single-line comments.

### Java Rules: Defining Properties (PMD 7)

For Java-based rules, use `PropertyFactory` to define properties (PMD 7):

**PMD 6 (deprecated):**

```java
StringProperty.named("propertyName")
    .desc("Description")
    .defaultValue("default")
    .uiOrder(1.0f)  // Removed in PMD 7
    .build();
```
````

**PMD 7:**

```java
import net.sourceforge.pmd.properties.PropertyFactory;

PropertyFactory.stringProperty("propertyName")
    .desc("Description")
    .defaultValue("default")
    .build();
```

**Property Types:**

- `PropertyFactory.stringProperty()` - String properties
- `PropertyFactory.intProperty()` - Integer properties
- `PropertyFactory.doubleProperty()` - Double properties
- `PropertyFactory.booleanProperty()` - Boolean properties
- `PropertyFactory.enumProperty()` - Enum properties
- `PropertyFactory.stringListProperty()` - List of strings
- `PropertyFactory.regexProperty()` - Regular expression properties

**Example:**

```java
private static final PropertyDescriptor<Integer> MIN_VALUE =
    PropertyFactory.intProperty("minValue")
        .desc("Minimum value threshold")
        .defaultValue(10)
        .build();

private static final PropertyDescriptor<List<String>> ALLOWED_NAMES =
    PropertyFactory.stringListProperty("allowedNames")
        .desc("List of allowed names")
        .defaultValues("i", "j", "k")
        .build();
```

**Retrieving Property Values:**

```java
int minValue = getProperty(MIN_VALUE);
List<String> allowedNames = getProperty(ALLOWED_NAMES);
```

### Java Rules: Reporting Violations (PMD 7)

**PMD 6 (deprecated):**

```java
addViolation(data, node, message);
addViolation(data, node, message, args);
```

**PMD 7:**

```java
asCtx(data).addViolation(node, message);
asCtx(data).addViolation(node, message, args);
```

**Example:**

```java
@Override
public Object visit(ASTMethod node, Object data) {
    if (violatesRule(node)) {
        asCtx(data).addViolation(node, "Method violates rule");
    }
    return super.visit(node, data);
}
```

**Note:** `uiOrder` property is removed in PMD 7. Just remove it from property
definitions.

**References:**

- [Defining Rule Properties](https://pmd.github.io/pmd/pmd_userdocs_extending_defining_properties.html)
- [PMD 7 Migration Guide](https://pmd.github.io/pmd/pmd_userdocs_migrating_to_pmd7.html)

### XPath Patterns

**`let` in predicates** - wrap in parentheses with `and`/`or`:

```xpath
//IfBlockStatement[
    StandardCondition/BooleanExpression[@Op='==']/VariableExpression
    and (
        let $var := StandardCondition/BooleanExpression[@Op='==']/VariableExpression/@Image
        return count(following-sibling::IfBlockStatement[
            StandardCondition/BooleanExpression[@Op='==']/VariableExpression/@Image = $var
        ]) + 1 >= 2
    )
]
```

**Consecutive siblings:**

```xpath
not(preceding-sibling::*[1][self::IfBlockStatement[...]])  // First in sequence only
let $var := .../@Image return count(following-sibling::...) + 1 >= 2  // Count matches
```

**Count across method:**

```xpath
let $var := ..., $method := ancestor::Method[1], $allBlocks := $method//IfBlockStatement
return sum(for $block in $allBlocks return if (...) then 1 else 0) >= 5
```

## PMD Rule Format

**Note:** This format is based on the
[PMD Ruleset XML Schema](https://pmd.sourceforge.io/ruleset_2_0_0.xsd). All
rules should include `<example>` elements in their XML files.

````markdown
## RuleName

**Category:**
[best-practices|code-style|design|documentation|error-prone|multithreading|performance|security]
**Priority:** [P1|P2|P3|P4] **Description:** What the rule checks

### Violations

\`\`\`apex // Code that violates \`\`\`

### Valid Code

\`\`\`apex // Code that passes \`\`\`

### XML Structure

Rules should follow this structure (per
[PMD Ruleset XML Schema](https://pmd.sourceforge.io/ruleset_2_0_0.xsd)).
**Element order matters!** Elements must appear in this specific order:

1. `<description>`: Rule description (optional)
2. `<priority>`: Priority level 1-5 (optional)
3. `<properties>`: Rule properties like XPath (optional)
4. `<exclude>`: Exclusion patterns (optional, multiple allowed)
5. `<example>`: Example code snippets (optional, multiple allowed)

**Important:** The XML schema location in the `<ruleset>` element must be:

```xml
xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd"
```
````

Note that the namespace uses dots (`2.0.0`) while the schema URL uses
underscores (`2_0_0.xsd`). Do not use `2_0_0.xsd` in the namespace.

**Note:** Use `pnpm check-xml-order` to verify element order, or
`pnpm fix-xml-order` to automatically fix it.

### Usage

**Basic configuration (code-analyzer.yml):** \`\`\`yaml engines: pmd:
custom_rulesets: - rulesets/category/RuleName.xml rules: pmd: RuleName:
severity: "High" tags: ["Recommended"] \`\`\`

````

---

## Design Rules

### InnerClassesCannotBeStatic

**Category:** design | **Priority:** P1
Inner classes cannot be static. Remove static modifier.

❌ `public static class Inner { }`
✅ `public class Inner { }`

### InnerClassesCannotHaveStaticMembers

**Category:** design | **Priority:** P1
Inner classes cannot have static members.

❌ `public class Inner { public static Integer value; }`
✅ `public class Inner { public Integer value; }`

### EnumMinimumValues

**Category:** design | **Priority:** P3
Enums must have minimum values (default: 3).

❌ `public enum Status { ACTIVE, INACTIVE }`
✅ `public enum Status { ACTIVE, INACTIVE, PENDING }`

### PreferSwitchOverIfElseChains

**Category:** design | **Priority:** P3
If-else chains, consecutive ifs, or OR conditions comparing same variable should
use switch.

❌ `if (x=='a') {} else if (x=='b') {} else if (x=='c') {}`
❌ `if (x=='a' || x=='b' || x=='c') {}`
✅ `switch on x { when 'a' {} when 'b' {} when 'c' {} }`

**Note:** Only applies to switch-compatible types: `Integer`, `Long`, `String`,
`sObject`, or `Enum`.
Non-switch types like `Boolean`, `Decimal`, `Date`, `DateTime`, `Time`, `Id`,
`Blob` are not flagged.

---

## Code Style Rules (including Naming)

### NoSingleLetterVariableNames

**Category:** code-style | **Priority:** P2
No single-letter names except loop counters/exception vars.

❌ `Integer x = 5;`
✅ `Integer index = 5;` | `for (Integer i...)` | `catch (Exception e)`

### NoAbbreviations

**Category:** code-style | **Priority:** P2
No abbreviations in variable names.

❌ `Integer acc = 5; String cfg = 'x'; Boolean isMgr = true;`
✅ `Integer accountCount = 5; String configuration = 'x';`

---

### NoMethodCallsInConditionals

**Category:** code-style | **Priority:** P2
Extract method calls to variables before conditionals.

❌ `if (getValue() > 0) {}`
✅ `Integer value = getValue(); if (value > 0) {}`

### MultipleStringContainsCalls

**Category:** code-style | **Priority:** P3
Replace multiple contains() with regex.

❌ `if (str.contains('a') || str.contains('b')) {}`
✅ `if (Pattern.matches('.*(a|b).*', str)) {}`

---

## Design Rules (Method Signatures)

### NoCustomParameterObjects

**Category:** design | **Priority:** P3
Avoid inner classes with only fields/constructors for passing parameters.

❌ `public class Param { String f1; }` (1+ fields)
✅ `public void method(String f1) {}`

---

## Best Practices Rules (Modifiers)

### FinalVariablesMustBeFinal

**Category:** best-practices | **Priority:** P2
Final variables cannot be reassigned.

❌ `final Integer v = 5; v = 10;`
✅ `final Integer v = 5;`

### StaticMethodsMustBeStatic

**Category:** best-practices | **Priority:** P2
Methods not using instance state should be static.

❌ `public Integer add(Integer a, Integer b) { return a+b; }`
✅ `public static Integer add(Integer a, Integer b) { return a+b; }`

---

## Example Config

```yaml
name: My Config
version: 1.0.0

rulesets:
    - rulesets/design/InnerClassesCannotBeStatic.xml
    - rulesets/design/InnerClassesCannotHaveStaticMembers.xml
    - rulesets/best-practices/FinalVariablesMustBeFinal.xml
    - rulesets/code-style/NoSingleLetterVariableNames.xml

rules:
    # Override severity and tags only
    NoSingleLetterVariableNames:
        severity: 'High'
        tags: ['Recommended', 'Naming']
````

---

For complete rules, see `rulesets/` directory. For setup instructions and
configuration details, see:

- [CODE_ANALYZER_CONFIG.md](CODE_ANALYZER_CONFIG.md) - Complete configuration
  reference
- [PMD.md](PMD.md) - PMD ruleset and property configuration
- [Salesforce CLI Commands](SFCLI.md) - Using Code Analyzer via CLI
- [VS Code Extension](VSCODE.md) - Using Code Analyzer in VS Code
- [CI/CD Integration](CICD.md) - Integrating into CI/CD pipelines
- [MCP Tools](MCP.md) - Using Model Context Protocol tools
- Repository root for installation and usage instructions

```

```
