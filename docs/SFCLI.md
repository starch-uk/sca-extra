# Salesforce CLI Commands for Code Analyzer

## Overview

Salesforce Code Analyzer is available as a Salesforce CLI plugin
(`@salesforce/sfdx-scanner`), enabling command-line static code analysis for
Salesforce codebases.

**Reference:**
[Use CLI Commands to Analyze Your Code](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/analyze.html)

## Prerequisites

- Salesforce CLI installed on your system
- Access to your Salesforce project files

## Installation

Install the Code Analyzer CLI plugin:

```bash
sf plugins install @salesforce/sfdx-scanner
```

Verify installation:

```bash
sf scanner --help
```

## Basic Commands

### List Available Rules

View all available rules across all engines:

```bash
sf scanner:rule:list
```

List rules for a specific engine:

```bash
sf scanner:rule:list --engine pmd
sf scanner:rule:list --engine eslint
sf scanner:rule:list --engine cpd
```

View detailed information about a specific rule:

```bash
sf scanner:rule:list --rule-selector RuleName --view detail
```

### Run Code Analysis

Analyze code in a directory:

```bash
sf scanner:run --target "path/to/source"
```

Analyze specific files:

```bash
sf scanner:run --target "path/to/file.cls"
```

Run analysis for a specific engine:

```bash
sf scanner:run --target "path/to/source" --engine pmd
```

### Output Formats

Generate reports in different formats:

```bash
# JSON format
sf scanner:run --target "path/to/source" --format json --outfile results.json

# HTML format
sf scanner:run --target "path/to/source" --format html --outfile results.html

# CSV format
sf scanner:run --target "path/to/source" --format csv --outfile results.csv

# XML format
sf scanner:run --target "path/to/source" --format xml --outfile results.xml

# SARIF format (for security scanning)
sf scanner:run --target "path/to/source" --format sarif --outfile results.sarif
```

### Data-Flow Analysis (SFGE)

Run Salesforce Graph Engine (SFGE) data-flow analysis:

```bash
sf scanner:run dfa --target "path/to/source" --rule-selector sfge
```

## Configuration

Code Analyzer automatically discovers `code-analyzer.yml` (or
`code-analyzer.yaml`) in your project root. You can specify a custom config
file:

```bash
sf scanner:run --target "path/to/source" --config-file "path/to/code-analyzer.yml"
```

For detailed configuration options, see
[Code Analyzer Configuration](CODE_ANALYZER_CONFIG.md).

## Rule Selection

### Filter by Category

Run rules from specific categories:

```bash
sf scanner:run --target "path/to/source" --category "Security,Best Practices"
```

### Filter by Engine

Run rules from specific engines:

```bash
sf scanner:run --target "path/to/source" --engine pmd,eslint
```

### Filter by Rule Name

Run specific rules:

```bash
sf scanner:run --target "path/to/source" --rule-selector "RuleName1,RuleName2"
```

### Filter by Severity

Run rules with specific severity levels:

```bash
sf scanner:run --target "path/to/source" --severity-threshold 2
```

Severity levels:

- `1` or `Critical`
- `2` or `High`
- `3` or `Moderate`
- `4` or `Low`
- `5` or `Info`

### Filter by Tags

Run rules with specific tags:

```bash
sf scanner:run --target "path/to/source" --tag "Recommended"
```

## Advanced Options

### Verbose Output

Enable verbose output for debugging:

```bash
sf scanner:run --target "path/to/source" --verbose
```

### Enforce Limits

Exit with error code if violations exceed threshold:

```bash
sf scanner:run --target "path/to/source" --violations-cause-error
```

### Include Test Code

Include test classes in analysis:

```bash
sf scanner:run --target "path/to/source" --normalize-severity
```

### Project Path

Specify project path for relative file resolution:

```bash
sf scanner:run --target "path/to/source" --project-dir "path/to/project"
```

## Common Workflows

### Quick Analysis

Run all recommended rules on source directory:

```bash
sf scanner:run --target force-app/main/default/classes --tag "Recommended"
```

### Security Scan

Run security-focused rules:

```bash
sf scanner:run --target force-app/main/default/classes --category Security --severity-threshold 2
```

### CI/CD Integration

Generate JSON output for CI/CD pipeline processing:

```bash
sf scanner:run --target force-app/main/default/classes --format json --outfile scanner-results.json --violations-cause-error
```

### Pre-commit Hook

Run analysis on staged files:

```bash
sf scanner:run --target $(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(cls|trigger|js|ts|html)$' | tr '\n' ',' | sed 's/,$//')
```

## Exit Codes

- `0`: Success (no violations or violations below threshold)
- `1`: Error (violations found above threshold or analysis error)
- Use `--violations-cause-error` to enable error exit on violations

## Related Documentation

- **[Code Analyzer Configuration](CODE_ANALYZER_CONFIG.md)** - Complete
  configuration reference for `code-analyzer.yml`
- **[PMD Engine](PMD.md)** - PMD engine details and usage
- **[ESLint Engine](ESLINT.md)** - ESLint engine configuration
- **[CPD Engine](CPD.md)** - Copy/Paste Detector engine
- **[Graph Engine](GRAPHENGINE.md)** - Salesforce Graph Engine (SFGE) data-flow
  analysis
