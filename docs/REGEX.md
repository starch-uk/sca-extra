# Regex Engine Quick Reference for AI Agents

## Overview

The Regex engine (Code Analyzer v5+) uses regular expressions to search code for patterns. Useful for:
- Quick pattern searches across codebase
- Finding patterns in comments (PMD ignores comments)
- Simple text/string pattern matching

**Note:** For nuanced coding violations, use PMD engine instead.

## Custom Rule Configuration

Add custom Regex rules to `code-analyzer.yml` under `engines.regex.custom_rules`:

```yaml
engines:
  regex:
    custom_rules:
      RuleName:
        regex: /pattern/flags
        file_extensions: [".ext1", ".ext2"]
        description: "Rule description"
        violation_message: "Optional custom message"
        severity: "Info"  # or 1-5
        tags: ["Tag1", "Tag2"]
```

## Rule Properties

| Property | Required | Type | Default | Description |
|----------|----------|------|---------|-------------|
| `regex` | Yes | string | - | Regular expression pattern (with flags) |
| `file_extensions` | Yes | array | - | File extensions to test (e.g., `[".cls", ".trigger"]`) |
| `description` | Yes | string | - | Rule purpose and behavior |
| `violation_message` | No | string | Auto-generated | Message shown on violation |
| `severity` | No | string/int | `3` (Moderate) | `1`/`Critical`, `2`/`High`, `3`/`Moderate`, `4`/`Low`, `5`/`Info` |
| `tags` | No | array | `["Recommended"]` | Tags for categorization |

**Note:** Custom rules automatically get `"Custom"` tag.

## Example: No TODO Comments

```yaml
engines:
  regex:
    custom_rules:
      NoTodoComments:
        regex: /\/\/[ \t]*TODO/gi
        file_extensions: [".apex", ".cls", ".trigger"]
        description: "Prevents TODO comments in Apex code"
        violation_message: "TODO comment found. Remove TODO statements."
        severity: "Info"
        tags: ["TechDebt"]
```

## Engine Configuration

```yaml
engines:
  regex:
    disable_engine: false  # Set true to disable Regex engine
    custom_rules: {}       # Custom rules object
```

## Common Patterns

### Find TODO/FIXME comments
```yaml
regex: /\/\/[ \t]*(TODO|FIXME|HACK|XXX)/gi
```

### Find console.log/debug statements
```yaml
regex: /(console\.(log|debug|warn|error)|System\.debug)/gi
```

### Find hardcoded IDs
```yaml
regex: /['"](00[0-9A-Za-z]{15}|00[0-9A-Za-z]{18})['"]/g
```

### Find empty catch blocks
```yaml
regex: /catch\s*\([^)]+\)\s*\{\s*\}/g
```

### Find magic numbers
```yaml
regex: /\b([0-9]{2,})\b/g  # Numbers with 2+ digits
```

## Usage

After adding rules to `code-analyzer.yml`:

```bash
# List all Regex rules (including custom)
sf scanner:rule:list --engine regex

# Run Code Analyzer (includes Regex rules)
sf scanner:run
```

## Important Notes

- **Regex flags:** Use standard flags (`g` global, `i` case-insensitive, `m` multiline)
- **File matching:** Rules only run on files matching `file_extensions`
- **Performance:** Regex is fast but less precise than PMD for code analysis
- **Comments:** Regex can search comments; PMD cannot
- **Pattern precision:** Use PMD for AST-based analysis; Regex for simple text patterns

## Related Documentation

- **[Code Analyzer Configuration](CODE_ANALYZER_CONFIG.md)** - Complete `code-analyzer.yml` configuration reference including Regex engine settings

