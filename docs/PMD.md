# PMD Quick Reference

Condensed guide to PMD (source code analyzer) essentials for Salesforce Code Analyzer integration.

## Related Documentation

- **[Code Analyzer Configuration](CODE_ANALYZER_CONFIG.md)** - `code-analyzer.yml` configuration reference
- **[XPath 3.1 Reference](XPATH31.md)** - XPath syntax for writing rules
- **[PMD Apex AST Reference](APEX_PMD_AST.md)** - AST node types and patterns
- **[AI Agent Rule Guide](AI_AGENT_RULE_GUIDE.md)** - Rule configuration examples

## Installation

Download PMD from [GitHub releases](https://github.com/pmd/pmd/releases), extract, add `bin/` to PATH.

**Note:** Salesforce Code Analyzer bundles PMD - direct installation only needed for standalone PMD CLI usage.

## Rulesets

Rulesets are XML files that define which rules to execute. Reference rulesets in `code-analyzer.yml`:

```yaml
engines:
  pmd:
    rulesets:
      - rulesets/structure/InnerClassesCannotBeStatic.xml
```

### Ruleset Structure

Basic ruleset template:

```xml
<?xml version="1.0"?>
<ruleset name="Custom Rules"
    xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd">
    <description>My custom rules</description>
    <!-- Rules here -->
</ruleset>
```

### Referencing Rules

**Single rule:**
```xml
<rule ref="category/apex/codestyle.xml/NoMethodCallsInConditionals" />
```

**Category (with exclusions):**
```xml
<rule ref="category/apex/codestyle.xml">
    <exclude name="WhileLoopsMustUseBraces"/>
</rule>
```

### File Filtering

Exclude/include patterns in ruleset:

```xml
<exclude-pattern>.*/test/.*</exclude-pattern>
<include-pattern>.*/test/ButNotThisClass.*</include-pattern>
```

## Rule Configuration

Configure rules in ruleset XML or `code-analyzer.yml`:

### Priority

Priority (1=High, 5=Low) filters rules via `--minimum-priority` CLI option:

```xml
<rule ref="category/apex/errorprone.xml/EmptyCatchBlock">
    <priority>5</priority>
</rule>
```

### Properties

Override rule properties:

**Important:** Salesforce Code Analyzer does not support property overrides for PMD rules via `code-analyzer.yml`. Only `severity` and `tags` can be overridden in `code-analyzer.yml`.

**In ruleset XML (required for property overrides):**
```xml
<rule ref="category/apex/design.xml/NPathComplexity">
    <properties>
        <property name="reportLevel">
            <value>150</value>
        </property>
    </properties>
</rule>
```

**For custom rules (using ref= syntax):**
```xml
<rule ref="rulesets/structure/EnumMinimumValues.xml/EnumMinimumValues">
    <properties>
        <property name="minValues">
            <value>4</value>
        </property>
    </properties>
</rule>
```

**In code-analyzer.yml (severity and tags only):**
```yaml
rules:
  pmd:
    NPathComplexity:
      severity: "High"
      tags: ["Recommended"]
```

**Complete Example - Override Multiple Rule Properties:**

1. Create a custom ruleset file (e.g., `rulesets/custom-overrides.xml`):

```xml
<?xml version="1.0"?>
<ruleset
    name="Custom Property Overrides"
    xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd"
>
    <description>Custom property overrides for rules</description>
    
    <!-- Override EnumMinimumValues to require 4 values instead of default 3 -->
    <rule ref="rulesets/structure/EnumMinimumValues.xml/EnumMinimumValues">
        <properties>
            <property name="minValues">
                <value>4</value>
            </property>
        </properties>
    </rule>
    
    <!-- Override PreferSwitchOverIfElseChains to require 4 conditions instead of default 2 -->
    <rule ref="rulesets/structure/PreferSwitchOverIfElseChains.xml/PreferSwitchOverIfElseChains">
        <properties>
            <property name="minElseIfStatements">
                <value>4</value>
            </property>
        </properties>
    </rule>
</ruleset>
```

2. Reference the override ruleset in `code-analyzer.yml`:

```yaml
engines:
  pmd:
    custom_rulesets:
      # Original rules (must be listed first)
      - rulesets/structure/EnumMinimumValues.xml
      - rulesets/structure/PreferSwitchOverIfElseChains.xml
      # Override ruleset (must come after the original rules)
      - rulesets/custom-overrides.xml
```

**Key Points:**
- The `ref` attribute format is `{ruleset-path}/{rule-name}` (e.g., `rulesets/structure/EnumMinimumValues.xml/EnumMinimumValues`)
- The ruleset path should be relative to your project root
- The override ruleset must be listed **after** the original ruleset in `custom_rulesets`
- Property values in XML use `<value>` tags (strings don't need quotes, but can have them)
- You can override multiple rules in a single custom ruleset file

**Multivalued properties** (comma-separated):
```xml
<property name="legalCollectionTypes" 
          value="java.util.ArrayList,java.util.Vector"/>
```

**Note on XPathRule Custom Properties:**

PMD 7.x does not validate custom properties for `XPathRule`. Custom rules using `XPathRule` should use property substitution in XPath with a default pattern instead of defining properties in XML:

```xpath
if ('${propertyName}' = '${propertyName}') then 'defaultValue' else '${propertyName}'
```

When the property is not defined, `${propertyName}` remains as a literal string, the check evaluates to `true`, and the default value is used. When the property is manually added to the XML, substitution occurs and the custom value is used.

See [AI Agent Rule Guide](AI_AGENT_RULE_GUIDE.md#property-configuration-for-xpathrule) for detailed examples.

### Custom Messages

Override rule violation messages:

```xml
<rule ref="category/apex/errorprone.xml/EmptyCatchBlock"
      message="Empty catch blocks should be avoided" />
```

## CLI Usage

Basic PMD CLI syntax:

```bash
pmd check -d <source_directory> -R <ruleset_file> -f <report_format>
```

**Note:** PMD 7 uses `pmd check` as the main command (replaces `pmd` in PMD 6).

Common options:
- `-d`, `--dir`: Source directory
- `-R`, `--rulesets`: Ruleset file path
- `-f`, `--format`: Report format (text, xml, html, csv, json, etc.)
- `--minimum-priority`: Filter by priority (1-5 or High/Medium/Low)
- `-l`, `--language`: Language (apex, java, etc.)
- `--use-version`: Specify language version (PMD 7+)
- `--fail-on-violation`: Exit with error code if violations found
- `--no-cache`: Disable incremental analysis cache
- `--cache`: Enable incremental analysis with cache file

**PMD 7 CLI Parameter Changes:**

| PMD 6 (deprecated) | PMD 7 |
|-------------------|-------|
| `-no-cache` | `--no-cache` |
| `-failOnViolation` | `--fail-on-violation` |
| `-reportfile` | `--report-file` |
| `-language` | `--use-version` |

**Example (PMD 7):**
```bash
pmd check -d src/main/apex -R rulesets/all.xml -f html -l apex
```

**Example with language version:**
```bash
pmd check -d src/main/apex -R rulesets/all.xml -l apex --use-version 60
```

**Check available language versions:**
```bash
pmd check --help
```

## Report Formats

Supported formats: `text`, `xml`, `html`, `csv`, `json`, `sarif`, `codeclimate`, `junit`.

Format specified via `-f` option. Most formats include violation details (file, line, message, rule).

## Copy-Paste Detector (CPD)

CPD finds duplicated code blocks across files. Helps identify code that should be refactored to reduce duplication and maintenance burden.

### Why Duplicates Matter

Duplicated code requires refactoring in multiple places, increasing risk of inconsistencies. CPD helps **identify duplicates for refactoring**, not for keeping them in sync.

### CLI Usage

CPD uses the same PMD CLI interface:

```bash
pmd cpd --minimum-tokens 100 --language apex --files src/
```

**Key options:**
- `--minimum-tokens` (required): Minimum token count for duplicate detection
- `--language` / `-l`: Source language (apex, java, javascript, etc.)
- `--format` / `-f`: Report format (text, xml, csv, csv_with_linecount_per_file, vs, json)
- `--ignore-identifiers`: Ignore identifier differences (Java)
- `--ignore-literals`: Ignore literal value differences (Java)
- `--ignore-annotations`: Ignore annotations (Java)
- `--skip-duplicate-files`: Ignore files with same name/length

**Example:**
```bash
pmd cpd --minimum-tokens 50 --language apex --format xml --files src/ --files test/
```

### CPD Report Formats

Available formats:
- `text` (default): Human-readable text output
- `xml`: Structured XML format (suitable for XSLT transformation)
- `csv`: Comma-separated values
- `csv_with_linecount_per_file`: CSV with line counts per file
- `vs`: Visual Studio format
- `json`: JSON format

**XML example:**
```bash
pmd cpd --minimum-tokens 100 --language apex --format xml --files src/ > cpd-report.xml
```

### Suppression

Suppress duplicate detection using comments:

```java
// CPD-OFF
public void duplicateCode() {
    // This code is ignored by CPD
}
// CPD-ON
```

**Java also supports annotations:**
```java
@SuppressWarnings("CPD-START")
public void method() { }
@SuppressWarnings("CPD-END")
```

Supported languages: Java, C/C++, C#, Dart, Go, Groovy, JavaScript, Kotlin, Lua, Matlab, Objective-C, PL/SQL, Python, Scala, Swift.

### GUI

CPD includes a GUI for interactive duplicate detection:

```bash
pmd cpd-gui
```

See [CPD documentation](https://pmd.github.io/pmd/pmd_userdocs_cpd.html) for details.

## Incremental Analysis

PMD supports incremental analysis (analyze only changed files). Uses cache files to track modifications. Enable via `--cache` option:

```bash
pmd --cache <cache_file> -d <source_directory> -R <ruleset_file>
```

Salesforce Code Analyzer handles incremental analysis automatically.

## Signed Releases

PMD releases are signed for integrity verification. Check signatures using standard GPG verification against PMD's public key. See [PMD documentation](https://pmd.github.io/pmd/pmd_userdocs_signed_releases.html) for verification steps.

## Rule Categories

PMD organizes rules into 8 categories (consistent across languages):
1. **Best Practices** - Generally accepted best practices
2. **Code Style** - Coding style enforcement
3. **Design** - Design issue detection
4. **Documentation** - Code documentation rules
5. **Error Prone** - Broken/confusing/runtime-error-prone constructs
6. **Multithreading** - Multi-threaded execution issues
7. **Performance** - Suboptimal code detection
8. **Security** - Potential security flaws

## GitHub Actions Integration

Use the [PMD GitHub Action](https://github.com/pmd/pmd-github-action) to run PMD in CI/CD workflows.

### Basic Usage

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-java@v4
    with:
      distribution: 'temurin'
      java-version: '11'
  - uses: pmd/pmd-github-action@v2
    with:
      rulesets: 'rulesets/structure/InnerClassesCannotBeStatic.xml'
```

### Key Inputs

- `rulesets` (required): Comma-separated list of ruleset files
- `version`: PMD version (default: "latest", requires PMD 6.31.0+)
- `sourcePath`: Root directory for sources (default: ".")
- `analyzeModifiedFilesOnly`: Analyze only PR/push modified files (default: "true")
- `createGitHubAnnotations`: Add violations as PR annotations (default: "true")
- `uploadSarifReport`: Upload SARIF report as artifact (default: "true")

### Outputs

- `violations`: Number of detected violations (use to fail build)

### Example: Fail Build on Violations

```yaml
- uses: pmd/pmd-github-action@v2
  id: pmd
  with:
    rulesets: 'rulesets/all.xml'
- name: Fail build if violations found
  if: steps.pmd.outputs.violations != 0
  run: exit 1
```

### Limitations

- Java: Cannot configure `auxclasspath` (Maven/Gradle recommended)
- Custom rules: Limited to XPath rules (no custom Java classes)
- Environment variables: Cannot set additional env vars
- File limit: Maximum 300 modified files when using `analyzeModifiedFilesOnly`

See [PMD GitHub Action repository](https://github.com/pmd/pmd-github-action) for full documentation.

## Language Versions

PMD 7 introduces language versioning:

- **Default versions**: Each language has a default version (usually the latest)
- **Version specification**: Use `--use-version` CLI option to specify a version
- **Rule versioning**: Rules can specify `minimumLanguageVersion` and `maximumLanguageVersion`
- **Available versions**: Check `pmd check --help` for available versions per language

**Example:**
```bash
# Use Apex version 60
pmd check -d src/main/apex -R rulesets/all.xml -l apex --use-version 60
```

## Code Metrics

PMD provides built-in metrics for code analysis. Metrics are available through the `ApexMetrics` class and `MetricsUtil` utilities.

### ApexMetrics

The `ApexMetrics` class provides built-in metrics for Apex code:

- **CYCLO** (Cyclomatic Complexity): Measures code complexity based on decision points
- **COGNITIVE_COMPLEXITY**: Measures code readability and maintainability
- **NCSS** (Non-Commenting Source Statements): Counts executable statements
- **WEIGHED_METHOD_COUNT**: Weighted method count metric

**Usage in Java rules:**
```java
import net.sourceforge.pmd.lang.apex.metrics.ApexMetrics;
import net.sourceforge.pmd.lang.metrics.MetricsUtil;

// Get cyclomatic complexity
int cyclo = MetricsUtil.computeMetric(ApexMetrics.CYCLO, node);

// Get cognitive complexity
int cognitive = MetricsUtil.computeMetric(ApexMetrics.COGNITIVE_COMPLEXITY, node);
```

### MetricsUtil

The `MetricsUtil` class provides utilities for computing metrics:

- **computeMetric()**: Compute a specific metric on a node
- **getStatistics()**: Get statistical data over sequences of nodes
- **Metric options**: Handle metric computation options

**Example:**
```java
import net.sourceforge.pmd.lang.metrics.MetricsUtil;
import net.sourceforge.pmd.lang.apex.metrics.ApexMetrics;

// Compute metric on a method
int complexity = MetricsUtil.computeMetric(ApexMetrics.CYCLO, methodNode);

// Get statistics for multiple methods
List<Method> methods = ...;
int maxComplexity = MetricsUtil.getStatistics(ApexMetrics.CYCLO, methods).getMax();
```

**References:**
- [ApexMetrics API](https://docs.pmd-code.org/apidocs/pmd-apex/7.20.0-SNAPSHOT/net/sourceforge/pmd/lang/apex/metrics/ApexMetrics.html)
- [MetricsUtil API](https://docs.pmd-code.org/apidocs/pmd-core/7.20.0-SNAPSHOT/net/sourceforge/pmd/lang/metrics/MetricsUtil.html)

## Apex Language Support

PMD provides comprehensive support for the Apex programming language:

- **Built-in rules**: Code style, design, error-prone, performance, and security rules
- **AST parsing**: Summit AST parser (PMD 7+) for accurate code analysis
- **Metrics**: Built-in metrics for complexity analysis (see Code Metrics section)
- **Configuration**: Language-specific configuration options

**References:**
- [Apex Language Documentation](https://pmd.github.io/pmd/pmd_languages_apex.html) - Complete Apex language support documentation
- [APEX_PMD_AST.md](APEX_PMD_AST.md) - Apex AST node reference

## Integration with Salesforce Code Analyzer

Salesforce Code Analyzer uses PMD engine under the hood. Configure via `code-analyzer.yml`:

- **Rulesets**: Listed under `engines.pmd.rulesets` (array of XML file paths)
- **Rule Properties**: Override via `rules.pmd.{RuleName}.properties`
- **Severity/Tags**: Override via `rules.pmd.{RuleName}.severity` and `rules.pmd.{RuleName}.tags`

See [CODE_ANALYZER_CONFIG.md](CODE_ANALYZER_CONFIG.md) for complete configuration reference.

