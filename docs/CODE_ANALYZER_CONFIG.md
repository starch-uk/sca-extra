# Code Analyzer Configuration Quick Reference for AI Agents

## Overview

Salesforce Code Analyzer uses `code-analyzer.yml` (or `code-analyzer.yaml`) in the project root. File is auto-discovered; use `--config-file` to specify a different path.

## Top-Level Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `config_root` | string | null | Absolute path for relative paths. Auto: parent of config file or CWD. |
| `log_folder` | string | null | Log file directory (absolute or relative to `config_root`). Auto: system temp. |
| `log_level` | number | 4 | `1`/`Error`, `2`/`Warn`, `3`/`Info`, `4`/`Debug`, `5`/`Fine` |
| `rules` | object | {} | Rule overrides: `rules.{engine}.{rule}.{property}` |
| `engines` | object | {} | Engine config: `engines.{engine}.{property}` |

## Rule Overrides

Override rule severity/tags:

```yaml
rules:
  eslint:
    sort-vars:
      severity: "Info"  # or 1-5
      tags: ["Recommended", "Suggestion"]
  pmd:
    RuleName:
      severity: "High"
      tags: ["Custom"]
```

## Engine Configuration

### PMD Engine

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `disable_engine` | boolean | false | Disable PMD engine |
| `rulesets` | array | [] | PMD ruleset XML file paths (relative to project root) |
| `java_command` | string | null | Java command/path for PMD. Auto-discovered if null. |

**Example:**
```yaml
engines:
  pmd:
    rulesets:
      - rulesets/structure/InnerClassesCannotBeStatic.xml
      - rulesets/naming/NoSingleLetterVariableNames.xml
```

### Regex Engine

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `disable_engine` | boolean | false | Disable Regex engine |
| `custom_rules` | object | {} | Custom regex rules |

**Custom Rule Format:**
```yaml
engines:
  regex:
    custom_rules:
      RuleName:
        regex: /pattern/flags  # Must include global flag (g)
        file_extensions: [".cls", ".trigger"]
        description: "Rule description"
        violation_message: "Optional message"
        severity: "Moderate"  # or 1-5
        tags: ["Tag1", "Tag2"]
```

**Note:** Regex must include global modifier (`g`). Valid: `/Todo/gi`. Invalid: `/Todo/i`.

### ESLint Engine

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `disable_engine` | boolean | false | Disable ESLint engine |
| `eslint_config_file` | string | null | Path to ESLint config (absolute or relative to `config_root`) |
| `auto_discover_eslint_config` | boolean | false | Auto-find ESLint config files |
| `disable_javascript_base_config` | boolean | false | Disable base JavaScript rules |
| `disable_lwc_base_config` | boolean | false | Disable base LWC rules |
| `disable_slds_base_config` | boolean | false | Disable base SLDS rules |
| `disable_typescript_base_config` | boolean | false | Disable base TypeScript rules |
| `file_extensions` | object | See below | File extensions per language |

**Default file_extensions:**
```yaml
file_extensions:
  javascript: [".js", ".cjs", ".mjs"]
  typescript: [".ts"]
  html: [".html", ".htm", ".cmp"]
  css: [".css", ".scss"]
  other: []
```

### CPD Engine

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `disable_engine` | boolean | false | Disable CPD engine |
| `java_command` | string | null | Java command/path. Auto-discovered if null. |
| `file_extensions` | object | See below | File extensions per language |
| `minimum_tokens` | object | See below | Min tokens threshold per language |
| `skip_duplicate_files` | boolean | false | Ignore same-name/length files |

**Default file_extensions:**
```yaml
file_extensions:
  apex: [".cls", ".trigger"]
  html: [".html", ".htm", ".xhtml", ".xht", ".shtml", ".cmp"]
  javascript: [".js", ".cjs", ".mjs"]
  typescript: [".ts"]
  visualforce: [".page", ".component"]
  xml: [".xml"]
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

config_root: null  # Auto: parent of config file or CWD
log_folder: null   # Auto: system temp
log_level: 4       # Debug

rules:
  pmd:
    NoSingleLetterVariableNames:
      severity: "High"
      tags: ["Recommended"]

engines:
  pmd:
    rulesets:
      - rulesets/structure/InnerClassesCannotBeStatic.xml
      - rulesets/naming/NoSingleLetterVariableNames.xml
  
  regex:
    custom_rules:
      NoConsecutiveBlankLines:
        regex: /\n\s*\n\s*\n/g
        file_extensions: [".cls", ".trigger"]
        description: "Prevents consecutive blank lines"
        severity: "Moderate"
        tags: ["CodeStyle"]
  
  eslint:
    auto_discover_eslint_config: true
    file_extensions:
      javascript: [".js", ".cjs", ".mjs"]
```

## Common Patterns

### Enable PMD Rulesets
```yaml
engines:
  pmd:
    rulesets:
      - rulesets/category/RuleName.xml
```

### Override Rule Properties
```yaml
rules:
  pmd:
    RuleName:
      properties:
        propertyName: "value"
```

### Custom Regex Rule
```yaml
engines:
  regex:
    custom_rules:
      RuleName:
        regex: /pattern/gi
        file_extensions: [".cls"]
        description: "Description"
        severity: "Moderate"
        tags: ["Tag"]
```

## Important Notes

- **File location:** `code-analyzer.yml` or `code-analyzer.yaml` in project root
- **Path resolution:** Relative paths use `config_root` (auto if null)
- **Regex flags:** Must include global (`g`) modifier
- **Rule overrides:** Use `rules.{engine}.{rule}.{property}` format
- **Engine config:** Use `engines.{engine}.{property}` format
- **PMD rulesets:** List XML file paths under `engines.pmd.rulesets`
- **Auto-discovery:** Many properties auto-discover if set to `null`

## Related Documentation

- **[AI Agent Rule Guide](AI_AGENT_RULE_GUIDE.md)** - PMD rule configuration examples
- **[Regex Engine Reference](REGEX.md)** - Regex custom rule creation
- **[XPath 3.1 Reference](XPATH31.md)** - XPath syntax for PMD rules
- **[PMD Apex AST Reference](APEX_PMD_AST.md)** - AST structure for PMD rules
- **[Suppressing Warnings](SUPPRESS_WARNINGS.md)** - Suppressing PMD rule violations using annotations, comments, and rule properties

