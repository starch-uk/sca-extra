# Code Analyzer Configuration Quick Reference for AI Agents

## Overview

Salesforce Code Analyzer is a static code analysis tool that helps ensure code
quality, security, and adherence to best practices across Salesforce codebases.
It supports multiple analysis engines including PMD, ESLint, CPD (Copy/Paste
Detector), Regex, Flow Scanner, RetireJS, and Salesforce Graph Engine (SFGE).

**Key Features:**

- Multi-engine static analysis (PMD, ESLint, CPD, Regex, Flow Scanner, RetireJS,
  SFGE)
- Configurable rule sets and severity levels
- Integration with Salesforce CLI, VS Code, and CI/CD pipelines
- Custom rule creation and configuration
- Support for Apex, JavaScript, TypeScript, Lightning Web Components (LWC), and
  more

**Reference:**
[Overview of Salesforce Code Analyzer](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/code-analyzer.md)

## Getting Started

### Prerequisites

- Salesforce CLI installed
  ([Install Salesforce CLI](https://developer.salesforce.com/tools/salesforcecli))
- Code Analyzer CLI plugin installed:
  `sf plugins install @salesforce/sfdx-scanner`
- Access to your Salesforce project codebase

### Quick Start

1. **Install Code Analyzer:**

    ```bash
    sf plugins install @salesforce/sfdx-scanner
    ```

2. **Run Your First Analysis:**

    ```bash
    sf scanner:run --target "force-app/main/default/classes"
    ```

3. **Create Configuration File:** Create `code-analyzer.yml` in your project
   root to customize analysis:

    ```yaml
    engines:
        pmd:
            custom_rulesets:
                - rulesets/design/InnerClassesCannotBeStatic.xml
    ```

4. **View Available Rules:**
    ```bash
    sf scanner:rule:list
    ```

**For detailed getting started instructions, see:**

- **[Salesforce CLI Commands](SFCLI.md)** - Using Code Analyzer via CLI
- **[VS Code Extension](VSCODE.md)** - Using Code Analyzer in VS Code
- **[CI/CD Integration](CICD.md)** - Integrating into CI/CD pipelines
- **[MCP Tools](MCP.md)** - Using Model Context Protocol tools

## Configuration File

Salesforce Code Analyzer uses `code-analyzer.yml` (or `code-analyzer.yaml`) in
the project root. File is auto-discovered; use `--config-file` to specify a
different path.

## Top-Level Properties

| Property      | Type   | Default | Description                                                                    |
| ------------- | ------ | ------- | ------------------------------------------------------------------------------ |
| `config_root` | string | null    | Absolute path for relative paths. Auto: parent of config file or CWD.          |
| `log_folder`  | string | null    | Log file directory (absolute or relative to `config_root`). Auto: system temp. |
| `log_level`   | number | 4       | `1`/`Error`, `2`/`Warn`, `3`/`Info`, `4`/`Debug`, `5`/`Fine`                   |
| `rules`       | object | {}      | Rule overrides: `rules.{engine}.{rule}.{property}`                             |
| `engines`     | object | {}      | Engine config: `engines.{engine}.{property}`                                   |

## Rule Overrides

Override rule severity/tags:

```yaml
rules:
    eslint:
        sort-vars:
            severity: 'Info' # or 1-5
            tags: ['Recommended', 'Suggestion']
    pmd:
        RuleName:
            severity: 'High'
            tags: ['Custom']
```

## Engine Configuration

### PMD Engine

For PMD rulesets, CLI usage, and configuration details, see
[PMD Quick Reference](PMD.md).

**Ruleset XML Format:** PMD rulesets follow the
[PMD Ruleset XML Schema](https://pmd.sourceforge.io/ruleset_2_0_0.xsd). Rules
can include `<example>` elements (optional, multiple allowed) to show violations
and valid code patterns.

| Property          | Type    | Default | Description                                           |
| ----------------- | ------- | ------- | ----------------------------------------------------- |
| `disable_engine`  | boolean | false   | Disable PMD engine                                    |
| `custom_rulesets` | array   | []      | PMD ruleset XML file paths (relative to project root) |
| `java_command`    | string  | null    | Java command/path for PMD. Auto-discovered if null.   |

**Example:**

```yaml
engines:
    pmd:
        custom_rulesets:
            - rulesets/design/InnerClassesCannotBeStatic.xml
            - rulesets/code-style/NoSingleLetterVariableNames.xml
```

### Regex Engine

| Property         | Type    | Default | Description          |
| ---------------- | ------- | ------- | -------------------- |
| `disable_engine` | boolean | false   | Disable Regex engine |
| `custom_rules`   | object  | {}      | Custom regex rules   |

**Custom Rule Format:**

```yaml
engines:
    regex:
        custom_rules:
            RuleName:
                regex: /pattern/flags # Must include global flag (g)
                file_extensions: ['.cls', '.trigger']
                description: 'Rule description'
                violation_message: 'Optional message'
                severity: 'Moderate' # or 1-5
                tags: ['Tag1', 'Tag2']
```

**Note:** Regex must include global modifier (`g`). Valid: `/Todo/gi`. Invalid:
`/Todo/i`.

### ESLint Engine

| Property                         | Type    | Default   | Description                                                   |
| -------------------------------- | ------- | --------- | ------------------------------------------------------------- |
| `disable_engine`                 | boolean | false     | Disable ESLint engine                                         |
| `eslint_config_file`             | string  | null      | Path to ESLint config (absolute or relative to `config_root`) |
| `auto_discover_eslint_config`    | boolean | false     | Auto-find ESLint config files                                 |
| `disable_javascript_base_config` | boolean | false     | Disable base JavaScript rules                                 |
| `disable_lwc_base_config`        | boolean | false     | Disable base LWC rules                                        |
| `disable_slds_base_config`       | boolean | false     | Disable base SLDS rules                                       |
| `disable_typescript_base_config` | boolean | false     | Disable base TypeScript rules                                 |
| `file_extensions`                | object  | See below | File extensions per language                                  |

**Default file_extensions:**

```yaml
file_extensions:
    javascript: ['.js', '.cjs', '.mjs']
    typescript: ['.ts']
    html: ['.html', '.htm', '.cmp']
    css: ['.css', '.scss']
    other: []
```

### CPD Engine

For CPD (Copy-Paste Detector) usage, configuration details, and supported
languages, see [CPD Engine Reference](CPD.md). For PMD CLI usage and suppression
details, see [PMD Quick Reference](PMD.md#cpd-copy-paste-detector).

| Property               | Type    | Default   | Description                                 |
| ---------------------- | ------- | --------- | ------------------------------------------- |
| `disable_engine`       | boolean | false     | Disable CPD engine                          |
| `java_command`         | string  | null      | Java command/path. Auto-discovered if null. |
| `file_extensions`      | object  | See below | File extensions per language                |
| `minimum_tokens`       | object  | See below | Min tokens threshold per language           |
| `skip_duplicate_files` | boolean | false     | Ignore same-name/length files               |

**Default file_extensions:**

```yaml
file_extensions:
    apex: ['.cls', '.trigger']
    html: ['.html', '.htm', '.xhtml', '.xht', '.shtml', '.cmp']
    javascript: ['.js', '.cjs', '.mjs']
    typescript: ['.ts']
    visualforce: ['.page', '.component']
    xml: ['.xml']
```

**Default minimum_tokens:**

```yaml
minimum_tokens:
    apex: 100
    html: 100
    javascript: 100
    typescript: 100
    visualforce: 100
    xml: 100
```

## Complete Example

```yaml
name: Salesforce Code Analyzer Configuration
version: 1.0.0

config_root: null # Auto: parent of config file or CWD
log_folder: null # Auto: system temp
log_level: 4 # Debug

rules:
    pmd:
        NoSingleLetterVariableNames:
            severity: 'High'
            tags: ['Recommended']

engines:
    pmd:
        custom_rulesets:
            - rulesets/design/InnerClassesCannotBeStatic.xml
            - rulesets/code-style/NoSingleLetterVariableNames.xml

    regex:
        custom_rules:
            NoConsecutiveBlankLines:
                regex: /\n\s*\n\s*\n/g
                file_extensions: ['.cls', '.trigger']
                description: 'Prevents consecutive blank lines'
                severity: 'Moderate'
                tags: ['CodeStyle']

    eslint:
        auto_discover_eslint_config: true
        file_extensions:
            javascript: ['.js', '.cjs', '.mjs']
```

## Common Patterns

### Enable PMD Rulesets

```yaml
engines:
    pmd:
        custom_rulesets:
            - rulesets/category/RuleName.xml
```

### Override Rule Properties

**Important:** Salesforce Code Analyzer does not support property overrides for
PMD rules via `code-analyzer.yml`. Only `severity` and `tags` can be overridden.

**For XPathRule (custom rules in this repository):**

- PMD 7+ does not support dynamic properties for `XPathRule`
- To customize rules, edit the XPath expression directly in the rule XML file
- Rules use easy-to-edit variables at the top of XPath expressions (e.g.,
  `let $minValues := 3`)
- See [Customizing Rules](#customizing-rules) section in README.md for examples

**For Java-based PMD rules (standard PMD rules):**

- Property overrides are supported using `ref=` syntax in custom ruleset XML
  files
- Create a custom ruleset that references the original rule and overrides
  properties

**Example - Override Java-based Rule Properties:**

1. Create `rulesets/custom-overrides.xml` (per
   [PMD Ruleset XML Schema](https://pmd.sourceforge.io/ruleset_2_0_0.xsd)):

```xml
<?xml version="1.0" ?>
<ruleset
    name="Custom Rule Overrides"
    xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd"
>
    <description>
        Custom property overrides for Java-based PMD rules
    </description>

    <!-- Override a Java-based rule property -->
    <rule ref="category/apex/design.xml/NPathComplexity">
        <properties>
            <property name="reportLevel">
                <value>150</value>
            </property>
        </properties>
    </rule>
</ruleset>
```

2. Reference in `code-analyzer.yml`:

```yaml
engines:
    pmd:
        custom_rulesets:
            - rulesets/custom-overrides.xml
```

**Key Points:**

- The `ref` attribute format is `{ruleset-path}/{rule-name}` (e.g.,
  `category/apex/design.xml/NPathComplexity`)
- Property values in XML use `<value>` tags (per
  [PMD Ruleset XML Schema](https://pmd.sourceforge.io/ruleset_2_0_0.xsd))
- Property elements support attributes: `name` (required), `value` (optional),
  `description`, `type`, `delimiter`, `min`, `max`

**Override Severity and Tags (supported in code-analyzer.yml):**

```yaml
rules:
    pmd:
        RuleName:
            severity: 'High'
            tags: ['Recommended']
```

### Custom Regex Rule

```yaml
engines:
    regex:
        custom_rules:
            RuleName:
                regex: /pattern/gi
                file_extensions: ['.cls']
                description: 'Description'
                severity: 'Moderate'
                tags: ['Tag']
```

## Important Notes

- **File location:** `code-analyzer.yml` or `code-analyzer.yaml` in project root
- **Path resolution:** Relative paths use `config_root` (auto if null)
- **Regex flags:** Must include global (`g`) modifier
- **Rule overrides:** Use `rules.{engine}.{rule}.{property}` format (severity
  and tags only for PMD rules)
- **Property overrides:** PMD rule properties cannot be overridden via
  `code-analyzer.yml` - use custom ruleset XML files with `ref=` syntax instead
- **Engine config:** Use `engines.{engine}.{property}` format
- **PMD rulesets:** Use `engines.pmd.custom_rulesets` (not `rulesets:`) to
  reference PMD rulesets
- **PMD rulesets:** List XML file paths under `engines.pmd.custom_rulesets` (not
  `rulesets:`)
- **Auto-discovery:** Many properties auto-discover if set to `null`

## Related Documentation

### Usage Guides

- **[Salesforce CLI Commands](SFCLI.md)** - Using Code Analyzer via Salesforce
  CLI
- **[VS Code Extension](VSCODE.md)** - Using Code Analyzer in Visual Studio Code
- **[CI/CD Integration](CICD.md)** - Integrating Code Analyzer into CI/CD
  pipelines
- **[MCP Tools](MCP.md)** - Using Model Context Protocol tools with Code
  Analyzer

### Engine Documentation

- **[PMD Quick Reference](PMD.md)** - PMD essentials (rulesets, CLI, CPD,
  configuration)
- **[CPD Engine Reference](CPD.md)** - CPD (Copy/Paste Detector) engine usage
  and configuration
- **[ESLint Engine](ESLINT.md)** - ESLint engine configuration for
  JavaScript/TypeScript/LWC
- **[Regex Engine Reference](REGEX.md)** - Regex custom rule creation
- **[Flow Scanner Engine](FLOWSCANNER.md)** - Flow Scanner engine for Salesforce
  Flows
- **[RetireJS Engine](RETIREJS.md)** - RetireJS engine for JavaScript dependency
  security
- **[Graph Engine](GRAPHENGINE.md)** - Salesforce Graph Engine (SFGE) data-flow
  analysis

### Rule Development

- **[AI Agent Rule Guide](AI_AGENT_RULE_GUIDE.md)** - PMD rule configuration
  examples
- **[XPath 3.1 Reference](XPATH31.md)** - XPath syntax for PMD rules
- **[PMD Apex AST Reference](APEX_PMD_AST.md)** - AST structure for PMD rules
- **[Suppressing Warnings](SUPPRESS_WARNINGS.md)** - Suppressing PMD rule
  violations using annotations, comments, and rule properties

## Salesforce Documentation

- **[Overview of Salesforce Code Analyzer](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/code-analyzer.md)** -
  Official Salesforce documentation
- **[Get Started with Code Analyzer](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/get-started.html)** -
  Getting started guide
- **[Use CLI Commands](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/analyze.html)** -
  CLI command reference
- **[Use VS Code Extension](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/analyze-vscode.html)** -
  VS Code extension guide
- **[Use MCP Tools](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/mcp.html)** -
  MCP tools guide
- **[CI/CD Integration](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/ci-cd-integration.html)** -
  CI/CD integration guide
