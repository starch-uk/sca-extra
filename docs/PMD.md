```markdown
# PMD Quick Reference

Condensed PMD guide for Salesforce Code Analyzer integration.

**Schema:** [PMD Ruleset XML Schema](https://pmd.sourceforge.io/ruleset_2_0_0.xsd)

## Related Docs
- [Code Analyzer Config](CODE_ANALYZER_CONFIG.md) - `code-analyzer.yml` reference
- [XPath 3.1](XPATH31.md) - XPath syntax for rules
- [Apex AST](APEX_PMD_AST.md) - AST node types/patterns
- [AI Agent Rule Guide](AI_AGENT_RULE_GUIDE.md) - Rule config examples

## Installation
Download from [GitHub releases](https://github.com/pmd/pmd/releases), extract, add `bin/` to PATH.
Salesforce Code Analyzer bundles PMD—direct install only for standalone CLI.

## Rulesets

XML files defining rules to execute. Reference in `code-analyzer.yml`:

```yaml
engines:
  pmd:
    rulesets:
      - rulesets/design/InnerClassesCannotBeStatic.xml
```

### Design

```xml
<?xml version="1.0"?>
<ruleset name="Custom Rules"
    xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd">
    <description>My custom rules</description>
    <exclude-pattern>.*/test/.*</exclude-pattern>
    <include-pattern>.*/src/.*</include-pattern>
    <!-- Rules here -->
</ruleset>
```

**Elements:** `<description>` (required), `<exclude-pattern>` (optional, multiple), `<include-pattern>` (optional, multiple), `<rule>` (required, multiple)

### Referencing Rules

```xml
<!-- Single rule -->
<rule ref="category/apex/codestyle.xml/NoMethodCallsInConditionals" />

<!-- Category with exclusions -->
<rule ref="category/apex/codestyle.xml">
    <exclude name="WhileLoopsMustUseBraces"/>
</rule>
```

## Rule Configuration

### Priority
1=High, 5=Low. Filter via `--minimum-priority`:
```xml
<rule ref="category/apex/errorprone.xml/EmptyCatchBlock">
    <priority>5</priority>
</rule>
```

### Properties

**Property attributes:** `name` (required), `value` (optional—attr or child), `description`, `type`, `delimiter`, `min`, `max`

**Important:** Code Analyzer only supports `severity`/`tags` overrides in `code-analyzer.yml`. Property overrides require ruleset XML.

```xml
<!-- Value as child element (recommended) -->
<property name="reportLevel"><value>150</value></property>

<!-- Value as attribute -->
<property name="reportLevel" value="150" />

<!-- Multivalued (comma-separated) -->
<property name="legalCollectionTypes" value="java.util.ArrayList,java.util.Vector"/>
```

**Override custom rules:**
```xml
<rule ref="rulesets/design/EnumMinimumValues.xml/EnumMinimumValues">
    <properties>
        <property name="minValues"><value>4</value></property>
    </properties>
</rule>
```

**code-analyzer.yml (severity/tags only):**
```yaml
rules:
  pmd:
    NPathComplexity:
      severity: "High"
      tags: ["Recommended"]
```

**Complete Override Example:**

1. Create `rulesets/custom-overrides.xml`:
```xml
<?xml version="1.0"?>
<ruleset name="Custom Property Overrides"
    xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd">
    <description>Custom property overrides</description>
    <rule ref="rulesets/design/EnumMinimumValues.xml/EnumMinimumValues">
        <properties><property name="minValues"><value>4</value></property></properties>
    </rule>
    <rule ref="rulesets/design/PreferSwitchOverIfElseChains.xml/PreferSwitchOverIfElseChains">
        <properties><property name="minElseIfStatements"><value>4</value></property></properties>
    </rule>
</ruleset>
```

2. Reference in `code-analyzer.yml`:
```yaml
engines:
  pmd:
    custom_rulesets:
      - rulesets/design/EnumMinimumValues.xml        # Original first
      - rulesets/design/PreferSwitchOverIfElseChains.xml
      - rulesets/custom-overrides.xml                   # Override after
```

**Ref format:** `{ruleset-path}/{rule-name}`

**XPathRule Custom Properties:** PMD 7.x doesn't validate custom XPathRule properties. Use substitution pattern:
```xpath
if ('${propertyName}' = '${propertyName}') then 'defaultValue' else '${propertyName}'
```
When undefined, `${propertyName}` stays literal → check true → default used. See [AI Agent Rule Guide](AI_AGENT_RULE_GUIDE.md#property-configuration-for-xpathrule).

### Examples
```xml
<rule name="MyRule" language="apex" ...>
    <description>Rule description</description>
    <priority>3</priority>
    <properties><!-- XPath --></properties>
    <example><![CDATA[
// Violation
public void badExample() { }
// Valid
public void goodExample() { }
    ]]></example>
</rule>
```

### Custom Messages
```xml
<rule ref="category/apex/errorprone.xml/EmptyCatchBlock"
      message="Empty catch blocks should be avoided" />
```

### Rule Element Structure

**Child elements (order required):** `description` → `priority` → `properties` → `exclude` → `example`

Verify: `pnpm check-xml-order` | Fix: `pnpm fix-xml-order`

**Attributes:** `name`, `language`, `minimumLanguageVersion`, `maximumLanguageVersion`, `ref`, `message`, `class`, `since`, `externalInfoUrl`, `deprecated` (default: false), `dfa`, `typeResolution` (default: false)

## CLI Usage

```bash
pmd check -d <source> -R <ruleset> -f <format>
```

**Options:**
| Option | Description |
|--------|-------------|
| `-d`, `--dir` | Source directory |
| `-R`, `--rulesets` | Ruleset file |
| `-f`, `--format` | Report format |
| `--minimum-priority` | Filter priority (1-5 or High/Medium/Low) |
| `-l`, `--language` | Language (apex, java, etc.) |
| `--use-version` | Language version (PMD 7+) |
| `--fail-on-violation` | Exit with error on violations |
| `--no-cache` | Disable cache |
| `--cache` | Enable cache with file |

**PMD 6→7 changes:** `-no-cache`→`--no-cache`, `-failOnViolation`→`--fail-on-violation`, `-reportfile`→`--report-file`, `-language`→`--use-version`

```bash
pmd check -d src/main/apex -R rulesets/all.xml -f html -l apex --use-version 60
```

## Report Formats
`text`, `xml`, `html`, `csv`, `json`, `sarif`, `codeclimate`, `junit`

## CPD (Copy-Paste Detector)

Finds duplicated code for refactoring.

```bash
pmd cpd --minimum-tokens 100 --language apex --files src/
```

**Options:** `--minimum-tokens` (required), `--language`, `--format` (text/xml/csv/csv_with_linecount_per_file/vs/json), `--ignore-identifiers`, `--ignore-literals`, `--ignore-annotations`, `--skip-duplicate-files`

**Suppression:**
```java
// CPD-OFF
public void duplicateCode() { }
// CPD-ON
```

**GUI:** `pmd cpd-gui`

## Incremental Analysis
```bash
pmd --cache <cache_file> -d <source> -R <ruleset>
```
Code Analyzer handles automatically.

## Rule Categories
1. Best Practices 2. Code Style 3. Design 4. Documentation 5. Error Prone 6. Multithreading 7. Performance 8. Security

## GitHub Actions

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-java@v4
    with:
      distribution: 'temurin'
      java-version: '11'
  - uses: pmd/pmd-github-action@v2
    with:
      rulesets: 'rulesets/design/InnerClassesCannotBeStatic.xml'
```

**Inputs:** `rulesets` (required), `version` (default: "latest"), `sourcePath` (default: "."), `analyzeModifiedFilesOnly` (default: "true"), `createGitHubAnnotations` (default: "true"), `uploadSarifReport` (default: "true")

**Output:** `violations` (count)

```yaml
- uses: pmd/pmd-github-action@v2
  id: pmd
  with:
    rulesets: 'rulesets/all.xml'
- name: Fail on violations
  if: steps.pmd.outputs.violations != 0
  run: exit 1
```

**Limits:** No `auxclasspath`, XPath rules only, no custom env vars, max 300 files with `analyzeModifiedFilesOnly`

## Language Versions

Use `--use-version` to specify. Rules can set `minimumLanguageVersion`/`maximumLanguageVersion`. Check `pmd check --help` for available versions.

## Code Metrics

**ApexMetrics:** `CYCLO`, `COGNITIVE_COMPLEXITY`, `NCSS`, `WEIGHED_METHOD_COUNT`

```java
import net.sourceforge.pmd.lang.apex.metrics.ApexMetrics;
import net.sourceforge.pmd.lang.metrics.MetricsUtil;

int cyclo = MetricsUtil.computeMetric(ApexMetrics.CYCLO, node);
int cognitive = MetricsUtil.computeMetric(ApexMetrics.COGNITIVE_COMPLEXITY, node);
```

**Refs:** [ApexMetrics API](https://docs.pmd-code.org/apidocs/pmd-apex/7.20.0-SNAPSHOT/net/sourceforge/pmd/lang/apex/metrics/ApexMetrics.html), [MetricsUtil API](https://docs.pmd-code.org/apidocs/pmd-core/7.20.0-SNAPSHOT/net/sourceforge/pmd/lang/metrics/MetricsUtil.html)

## Apex Support

Built-in rules, Summit AST parser (PMD 7+), metrics, language-specific config.

**Refs:** [Apex Language Docs](https://pmd.github.io/pmd/pmd_languages_apex.html), [APEX_PMD_AST.md](APEX_PMD_AST.md)

## Code Analyzer Integration

Configure via `code-analyzer.yml`:
- **Rulesets:** `engines.pmd.rulesets` (array)
- **Properties:** `rules.pmd.{RuleName}.properties`
- **Severity/Tags:** `rules.pmd.{RuleName}.severity`, `rules.pmd.{RuleName}.tags`

See [CODE_ANALYZER_CONFIG.md](CODE_ANALYZER_CONFIG.md).
```
