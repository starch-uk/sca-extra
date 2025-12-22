---
name: Bug Report
about: Report a bug or issue with a rule
title: '[BUG] '
labels: bug
assignees: ''
---

## Motivation / Problem

<!-- Why is this bug a problem? What does it prevent? -->

## Examples

<!-- Provide code examples that demonstrate the bug -->

```apex
// Example code that demonstrates the bug
```

## Expected Behavior

<!-- What should happen? -->

## Actual Behavior

<!-- What actually happens? -->

## Versions

### How to Find Versions

**Salesforce Code Analyzer Version:**
- Run: `sf scanner:version` or check your `package.json` if using npm
- Or check the output of: `sf scanner:run --help`

**Rule Version:**
- Check the rule XML file in `rulesets/{category}/{RuleName}.xml`
- Look for version information in the rule metadata or description
- Or check the git commit/tag where the rule was last updated

**Please provide:**
- Salesforce Code Analyzer version: [version here]
- Rule version: [version here]
- Rule name: [rule name here]
- Operating System: [OS and version]

## Additional Context

<!-- Any other information that would be helpful -->
- Steps to reproduce
- Error messages or logs
- Screenshots (if applicable)
- Related issues or PRs

