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

**In ruleset XML:**
```xml
<rule ref="category/apex/design.xml/NPathComplexity">
    <properties>
        <property name="reportLevel" value="150"/>
    </properties>
</rule>
```

**In code-analyzer.yml:**
```yaml
rules:
  NPathComplexity:
    properties:
      reportLevel: 150
```

**Multivalued properties** (comma-separated):
```xml
<property name="legalCollectionTypes" 
          value="java.util.ArrayList,java.util.Vector"/>
```

### Custom Messages

Override rule violation messages:

```xml
<rule ref="category/apex/errorprone.xml/EmptyCatchBlock"
      message="Empty catch blocks should be avoided" />
```

## CLI Usage

Basic PMD CLI syntax:

```bash
pmd -d <source_directory> -R <ruleset_file> -f <report_format>
```

Common options:
- `-d`: Source directory
- `-R`: Ruleset file path
- `-f`: Report format (text, xml, html, csv, json, etc.)
- `--minimum-priority`: Filter by priority (1-5 or High/Medium/Low)
- `-l`: Language (apex, java, etc.)
- `--fail-on-violation`: Exit with error code if violations found

**Example:**
```bash
pmd -d src/main/apex -R rulesets/all.xml -f html -l apex
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

## Integration with Salesforce Code Analyzer

Salesforce Code Analyzer uses PMD engine under the hood. Configure via `code-analyzer.yml`:

- **Rulesets**: Listed under `engines.pmd.rulesets` (array of XML file paths)
- **Rule Properties**: Override via `rules.pmd.{RuleName}.properties`
- **Severity/Tags**: Override via `rules.pmd.{RuleName}.severity` and `rules.pmd.{RuleName}.tags`

See [CODE_ANALYZER_CONFIG.md](CODE_ANALYZER_CONFIG.md) for complete configuration reference.

