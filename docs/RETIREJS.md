# RetireJS Engine Quick Reference for AI Agents

## Overview

RetireJS analyzes third-party JavaScript dependencies and identifies security
vulnerabilities. It uses a community-maintained database that is updated
frequently.

**Reference:** See [Code Analyzer Configuration](CODE_ANALYZER_CONFIG.md) for
RetireJS engine configuration details.

**Purpose:** Security vulnerability detection in JavaScript dependencies.

## Engine Configuration

Configure RetireJS in `code-analyzer.yml`:

```yaml
engines:
    retire-js:
        disable_engine: false # Set true to disable RetireJS engine
```

## Configuration Properties

| Property         | Type    | Default | Description                                                                                          |
| ---------------- | ------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `disable_engine` | boolean | false   | Whether to turn off the 'retire-js' engine so it is not included when running Code Analyzer commands |

## Rule Customization

RetireJS rules can be customized (severity, tags) using the same process as
ESLint and Regex engines:

```yaml
rules:
    retire-js:
        RuleName:
            severity: 'High' # or 1-5
            tags: ['Security', 'Recommended']
```

## Usage

After configuration in `code-analyzer.yml`:

```bash
# List all RetireJS rules
sf scanner:rule:list --engine retire-js

# Run Code Analyzer (includes RetireJS rules)
sf scanner:run
```

## Important Notes

- **Database:** RetireJS uses a community-maintained database of vulnerable
  libraries
- **Updates:** Database is updated frequently
- **Scope:** Analyzes JavaScript dependencies only
- **Configuration:** Use `engines.retire-js.disable_engine` to disable the
  engine
- **Rule overrides:** Use `rules.retire-js.{RuleName}.{property}` format
  (severity and tags)

## Related Documentation

- **[Code Analyzer Configuration](CODE_ANALYZER_CONFIG.md)** - Complete
  `code-analyzer.yml` configuration reference including RetireJS engine settings
- **[ESLint Engine](CODE_ANALYZER_CONFIG.md#eslint-engine)** - Similar rule
  customization patterns for ESLint
- **[Regex Engine](REGEX.md)** - Similar rule customization patterns for Regex
