# Project Plan: Salesforce Apex PMD Rules

## Overview

This project maintains additional PMD rules for testing Salesforce Apex code using Salesforce Code Analyzer. The rules are implemented as XPath 3.1 expressions that operate on the PMD Apex AST.

**Repository:** [https://github.com/starch-uk/sca-extra](https://github.com/starch-uk/sca-extra)

## Implementation Status

**Note:** This plan document describes the project as if it hasn't been built yet, but includes all features and capabilities that are currently implemented. The following sections document what will be built, including:

- **44 PMD rules** across 6 categories (code-style, documentation, method-signatures, modifiers, naming, structure)
- **Comprehensive test infrastructure** with positive and negative test fixtures for all rules
- **Benchmarking system** with stress-test fixtures (580+ violations across 7 fixture files)
- **CI/CD pipeline** with PMD 7.19.0, Java 21, Node.js 24, pnpm 10.26.1, and Codecov integration
- **Documentation** including AI Agent-friendly rule guide, XPath 3.1 reference, and PMD AST reference
- **Development tooling** including AST dump helper, validation scripts, version bumping, and changelog generation

### Changes from Original Plan

- **License:** Project uses MIT License (not BSD 3-Clause as originally planned)
- **ESLint:** Uses ESLint 9.x with flat config (`eslint.config.mjs`) instead of ESLint 8.x
- **Dependencies:** Updated to newer versions (Jest 30.x, Husky 9.x, etc.)
- **CI/CD:** PMD 7.19.0 with Java 21, Node.js 24, pnpm 10.26.1 (not PMD 7.0.0 with Node 18)
- **Benchmark PR Comments:** Not implemented in CI (benchmarking can be run manually)
- **Performance Regression Alerts:** Not implemented in CI (can be checked manually with `pnpm run check-regressions`)
- **Rule Count:** 44 rules implemented (more comprehensive than originally scoped)

## Project Structure

```
sca-extra/
├── README.md                          # Project documentation
├── LICENSE.md                         # MIT License
├── CONTRIBUTING.md                    # Contribution guidelines
├── SECURITY.md                        # Security policy
├── package.json                       # pnpm configuration and scripts
├── .gitignore                         # Git ignore patterns
├── .prettierrc                        # Prettier configuration
├── .husky/                            # Pre-commit hooks
│   └── pre-commit                     # Automatic formatting hook
├── .github/                           # GitHub configuration
│   ├── workflows/
│   │   └── ci.yml                     # CI/CD workflow (lint + test on PRs)
│   ├── ISSUE_TEMPLATE/                 # Issue templates
│   │   ├── bug_report.md               # Bug report template
│   │   ├── feature_request.md          # Feature request template
│   │   └── rule_request.md             # New rule request template
│   └── pull_request_template.md       # Pull request template
├── docs/                              # Documentation
│   ├── XPATH31.md                     # XPath 3.1 reference (moved from root)
│   ├── APEX_PMD_AST.md                # PMD Apex AST reference (moved from root)
│   ├── AI_AGENT_RULE_GUIDE.md         # AI Agent-friendly rule configuration guide
│   └── MIGRATION_GUIDES.md             # Rule migration guides between versions
├── rulesets/                          # PMD ruleset XML files (organized by category)
│   ├── code-style/                    # Code style rules
│   ├── documentation/                 # Documentation rules
│   ├── method-signatures/             # Method signature rules
│   ├── modifiers/                     # Modifier rules
│   ├── naming/                        # Naming convention rules
│   └── structure/                     # Code structure rules
├── code-analyzer.yml                  # Prevents Salesforce Code Analyzer VS Code extension from running any rules
├── jest.config.js                     # Jest test configuration
├── tests/                             # Test files
│   ├── fixtures/                      # Test Apex code files
│   │   ├── positive/                  # Code that should NOT trigger rules
│   │   │   ├── code-style/            # Positive test fixtures for code-style rules
│   │   │   ├── documentation/         # Positive test fixtures for documentation rules
│   │   │   ├── method-signatures/     # Positive test fixtures for method-signature rules
│   │   │   ├── modifiers/             # Positive test fixtures for modifier rules
│   │   │   ├── naming/                # Positive test fixtures for naming rules
│   │   │   └── structure/             # Positive test fixtures for structure rules
│   │   └── negative/                  # Code that SHOULD trigger rules
│   │       ├── code-style/            # Negative test fixtures for code-style rules
│   │       ├── documentation/         # Negative test fixtures for documentation rules
│   │       ├── method-signatures/     # Negative test fixtures for method-signature rules
│   │       ├── modifiers/            # Negative test fixtures for modifier rules
│   │       ├── naming/                # Negative test fixtures for naming rules
│   │       └── structure/             # Negative test fixtures for structure rules
│   ├── helpers/                       # Test helper utilities
│   │   └── pmd-helper.js              # PMD test helper functions
│   ├── rulesets/                      # Test-specific rulesets
│   │   └── test-ruleset.xml           # Combined ruleset for testing (generated)
│   └── unit/                          # Unit test files
│       ├── code-style.test.js
│       ├── documentation.test.js
│       ├── method-signatures.test.js
│       ├── modifiers.test.js
│       ├── naming.test.js
│       └── structure.test.js
├── scripts/                           # Utility scripts
│   ├── generate-test-ruleset.js      # Generate combined test ruleset from all rules
│   ├── validate-rules.js             # Validate XML ruleset syntax and rule quality
│   ├── benchmark.js                  # Performance benchmarking script (tests all rules against stress fixtures)
│   ├── check-performance-regressions.js  # Check for performance regressions against baseline
│   ├── version-bump.js               # Automated version bumping (major/minor/patch)
│   ├── generate-changelog.js         # Generate changelog from git commits
│   ├── list-test-files.js            # List test fixture files for inventory
│   └── ast-dump.sh                    # Helper for AST debugging (PMD AST dump wrapper)
├── benchmarks/                        # Benchmark test files
│   ├── fixtures/                      # Large Apex files for benchmarking
│   │   ├── stress-test-all-rules.cls  # Comprehensive stress test (100+ violations across all rules)
│   │   ├── stress-code-style.cls      # Code style stress test (200+ violations, 18 rules)
│   │   ├── stress-structure.cls       # Structure stress test (100+ violations, 13 rules)
│   │   ├── stress-modifiers.cls       # Modifier stress test (100+ violations, 5 rules)
│   │   ├── stress-naming.cls          # Naming stress test (100+ violations, 4 rules)
│   │   ├── stress-documentation.cls   # Documentation stress test (30+ violations, 2 rules)
│   │   └── stress-method-signatures.cls # Method signature stress test (30+ violations, 2 rules)
│   ├── results/                      # Benchmark results (gitignored)
│   ├── README.md                      # Benchmark documentation
│   └── FIXTURES.md                    # Benchmark fixture documentation
└── .github/                           # GitHub Actions
    └── workflows/
        └── ci.yml                     # CI/CD workflow (lint + test on PRs)
```

## Critical Prerequisites

### PMD CLI Installation

**IMPORTANT:** This project uses PMD CLI directly as an external tool. PMD is NOT an npm package and must be installed separately.

1. **Install PMD CLI:**
   - **macOS:** `brew install pmd`
   - **Linux/Windows:** Download from https://pmd.github.io/pmd/pmd_userdocs_installation.html
   - **Verify installation:** `pmd --version` and `pmd check --help`

2. **PMD Requirements:**
   - PMD version 7.19.0+ (supports Apex language)
   - Apex language support enabled
   - XPath 3.1 support
   - Java 21+ (required for PMD 7.19.0)

3. **Test PMD with Apex:**
   ```bash
   pmd check -d <apex-file> -R <ruleset> -l apex -f xml
   ```

4. **Note for Tests:**
   - Tests will fail if PMD CLI is not installed
   - Test helper should check for PMD availability and provide clear error messages
   - PMD CLI must be in system PATH

## Implementation Steps

### Phase 1: Project Setup

1. **Initialize pnpm project**
   - Create `package.json` with project metadata
   - **Important:** No runtime dependencies - PMD is external CLI tool
   - Add dev dependencies:
     - `jest` (^30.0.0) - Test framework
     - `@types/jest` (^30.0.0) - TypeScript definitions for Jest
     - `eslint` (^9.0.0) - JavaScript linting (flat config)
     - `@eslint/js` (^9.0.0) - ESLint JavaScript plugin
     - `globals` (^16.0.0) - Global variables for ESLint
     - `prettier` (^3.0.0) - Code formatting
     - `@prettier/plugin-xml` (^3.0.0) - XML formatting support
     - `husky` (^9.0.0) - Git hooks
     - `lint-staged` (^16.0.0) - Staged file linting
     - `xml2js` (^0.6.0) - XML parsing
     - `xmldom` (^0.6.0) - DOM implementation for XML parsing
   - Configure pnpm scripts for testing, validation, linting, and development
   - Add Prettier for XML formatting of rulesets

2. **Reorganize files**
   - Move `XPATH31.md` → `docs/XPATH31.md`
   - Move `APEX_PMD_AST.md` → `docs/APEX_PMD_AST.md`
   - Keep `rulesets/` structure as-is (already well-organized)

3. **Create LICENSE.md file**
   - Add MIT License file
   - Include copyright notice with year and organization
   - Reference license in README and package.json

4. **Create `.gitignore`**
   - Ignore `node_modules/`, test artifacts, AST dumps, benchmark results, coverage reports, etc.
   - Example patterns:
     - `node_modules/`
     - `coverage/`
     - `benchmarks/results/`
     - `*.ast.xml` (AST dump files)
     - `.DS_Store`
     - IDE-specific files

5. **Set up Prettier for XML formatting**
   - Configure Prettier with XML plugin (`@prettier/plugin-xml` or similar)
   - Create `.prettierrc` configuration for XML formatting rules
   - Add pnpm script to format all XML rulesets
   - Ensure consistent XML formatting across all ruleset files

6. **Set up pre-commit hooks**
   - Install husky for Git hooks
   - Create `.husky/pre-commit` hook to automatically format XML files
   - Use `lint-staged` to format only staged files
   - Configure `.lintstagedrc` to format XML files with Prettier
   - Ensure all committed XML files are formatted with Prettier before commit
   - Hook should run automatically on `git commit`

7. **Set up GitHub Actions CI/CD**
   - Create `.github/workflows/ci.yml` workflow
   - Run on pull requests and pushes to main/develop branches
   - Setup Java 21 (required for PMD 7.19.0)
   - Setup Node.js 24
   - Setup pnpm 10.26.1
   - Cache pnpm store and node_modules
   - Install PMD CLI 7.19.0 (download and cache)
   - Run on pull requests: lint (Prettier check), ESLint, and unit tests with coverage
   - Fail PR if files are not properly formatted or tests fail
   - Upload coverage to Codecov (requires CODECOV_TOKEN secret)
   - **Note:** Benchmark PR comments and performance regression alerts are not implemented in CI (benchmarking can be run manually)

8. **Create `README.md`**
   - Project overview
   - **Prerequisites section:**
     - PMD CLI installation requirements
     - Node.js version requirements
     - How to verify PMD installation
   - **What Makes a Good Rule vs. What Prettier Handles** (important guidance section)
     - Explain when to create PMD rules (code quality, logic, best practices)
     - Explain what Prettier handles (formatting, spacing, indentation)
     - Provide examples of good rules vs. formatting concerns
     - Help developers understand when to contribute rules vs. use formatters
   - Installation instructions
   - **Usage instructions for Salesforce projects:**
     - How to add rules to a Salesforce project
     - How to enable rules in `code-analyzer.yml`
     - How to configure rule properties
     - Examples of rule configuration
     - Create example `code-analyzer.yml` file
   - Usage examples
   - Development section (running tests, benchmarks, etc.)
   - Link to CONTRIBUTING.md for contribution guidelines
   - Link to SECURITY.md for security reporting
   - Reference to documentation files
   - Link to repository: https://github.com/starch-uk/sca-extra

9. **Create `CONTRIBUTING.md`**
   - Welcome message for contributors
   - Code of conduct reference
   - Development setup instructions
   - How to add new rules
   - Testing requirements
   - Pull request process
   - Code style guidelines
   - Commit message conventions

10. **Create `SECURITY.md`**
    - Security policy and reporting process
    - How to report security vulnerabilities
    - Supported versions
    - Disclosure policy
    - Contact information for security issues

11. **Create GitHub issue templates**
    - `.github/ISSUE_TEMPLATE/bug_report.md` - Template for bug reports
    - `.github/ISSUE_TEMPLATE/feature_request.md` - Template for feature requests
    - `.github/ISSUE_TEMPLATE/rule_request.md` - Template for new rule requests
    - All templates should ask for:
      - **Motivation**: Why is this needed? What problem does it solve?
      - **Examples**: Code examples showing the issue/request
      - Context and background information

12. **Create GitHub pull request template**
    - `.github/pull_request_template.md`
    - Should ask for:
      - **Motivation**: Why is this change needed?
      - **Examples**: Code examples demonstrating the change
      - Description of changes
      - Testing information
      - Checklist of requirements

### Phase 2: Test Infrastructure

1. **Set up test framework**
   - Choose testing library: Jest (recommended for Node.js)
   - Create `jest.config.js` with configuration:
     - Test environment: "node"
     - Test match: `**/tests/unit/**/*.test.js`
     - Test timeout: 10000ms (10 seconds)
     - Coverage collection from `tests/**/*.js` and `scripts/**/*.js`
     - Exclude fixtures and helpers from coverage
     - Verbose output enabled
   - Create test utilities for:
     - Running PMD against Apex files
     - Parsing PMD XML output
     - Asserting rule violations
     - Comparing expected vs actual violations

2. **Create test helper functions** (`tests/helpers/pmd-helper.js`)
   - `runPMD(rulesetPath, apexFile)` - Execute PMD CLI and return results
     - Uses `pmd check --no-cache -d <file> -R <ruleset> -f xml`
     - Handles PMD exit codes (non-zero when violations found is expected)
     - Extracts XML from output (handles warnings before XML)
     - Timeout: 30 seconds
     - Error handling for missing PMD CLI
   - `parseViolations(pmdOutput)` - Parse PMD XML output
     - Uses `xmldom` DOMParser
     - Extracts: file, rule, message, line, column
     - Returns array of violation objects
   - `assertViolation(violations, ruleName, lineNumber)` - Assert specific violation exists
   - `assertNoViolations(violations, ruleName)` - Assert rule doesn't fire
   - `readFixture(category, ruleName, type)` - Read test fixture files
     - Type: 'positive' or 'negative'
     - Returns file contents as string

3. **Create test fixture structure**
   - For each rule, create:
     - `tests/fixtures/positive/{category}/{RuleName}.cls` - Should pass
     - `tests/fixtures/negative/{category}/{RuleName}.cls` - Should fail

4. **Generate combined test ruleset**
   - Create `scripts/generate-test-ruleset.js` to combine all rulesets into single XML
   - Output: `tests/rulesets/test-ruleset.xml`
   - Script should:
     - Read all rule XML files from `rulesets/` directories
     - Combine into single ruleset
     - Preserve rule structure and properties
   - Create `pnpm run generate-test-ruleset` script
   - Or maintain separate test runs per category (current approach)

5. **Set up benchmarking infrastructure**
   - Create `scripts/benchmark.js` to measure rule performance
   - Test rules against large Apex codebases
   - Track execution time per rule
   - Store benchmark results for comparison
   - Add benchmark fixtures in `benchmarks/fixtures/`:
     - `stress-test-all-rules.cls` - Comprehensive (100+ violations across all rules)
     - `stress-code-style.cls` - Code style focused (200+ violations)
     - `stress-structure.cls` - Structure focused (100+ violations)
     - `stress-modifiers.cls` - Modifiers focused (100+ violations)
     - `stress-naming.cls` - Naming focused (100+ violations)
     - `stress-documentation.cls` - Documentation focused (30+ violations)
     - `stress-method-signatures.cls` - Method signatures focused (30+ violations)
   - Create `benchmarks/README.md` - Benchmark documentation
   - Create `benchmarks/FIXTURES.md` - Fixture statistics and coverage
   - Create `scripts/check-performance-regressions.js` - Regression detection
   - Results stored in `benchmarks/results/` (gitignored)
   - Support baseline comparison and JSON output for CI
   - Create `pnpm run benchmark` script
   - Create `pnpm run check-regressions` script

### Phase 3: Test Implementation (Priority Order)

**Note:** All 44 rules will be implemented with comprehensive test coverage. The following represents the implementation order, but all rules will eventually have tests.

#### P1 Rules (Start Here)
1. **InnerClassesCannotBeStatic**
   - Positive: Inner class without static modifier
   - Negative: Inner class with static modifier

2. **InnerClassesCannotHaveStaticMembers**
   - Positive: Inner class with non-static members only
   - Negative: Inner class with static method/field

#### P2 Rules
3. **NoMethodCallsInConditionals**
4. **NoSingleLetterVariableNames**
5. **Multi-line formatting rules** (ListInitializationMustBeMultiLine, MapInitializationMustBeMultiLine, SingleArgumentMustBeSingleLine, SingleParameterMustBeSingleLine)
6. **Modifier rules** (FinalVariablesMustBeFinal, StaticMethodsMustBeStatic, StaticVariablesMustBeFinalAndScreamingSnakeCase, RegexPatternsMustBeStaticFinal, TestClassIsParallel)

#### P3 Rules
7. **Code Style Rules** (18 total):
   - AvoidOneLinerMethods
   - ListInitializationMustBeMultiLine
   - MapInitializationMustBeMultiLine
   - MapShouldBeInitializedWithValues
   - MultipleStringContainsCalls
   - NoConsecutiveBlankLines
   - NoMethodCallsAsArguments
   - NoMethodCallsInConditionals
   - NoMethodChaining
   - PreferBuilderPatternChaining
   - PreferConcatenationOverStringJoinWithEmpty
   - PreferMethodCallsInLoopConditions
   - PreferNullCoalescingOverTernary
   - PreferSafeNavigationOperator
   - PreferStringJoinOverConcatenation
   - PreferStringJoinOverMultipleNewlines
   - PreferStringJoinWithSeparatorOverEmpty
   - SingleArgumentMustBeSingleLine

8. **Documentation Rules** (2 total):
   - ExceptionDocumentationRequired
   - SingleLineDocumentationFormat

9. **Method Signature Rules** (2 total):
   - NoCustomParameterObjects
   - SingleParameterMustBeSingleLine

10. **Naming Rules** (4 total):
    - InnerClassesMustBeOneWord
    - NoAbbreviations
    - NoSingleLetterVariableNames
    - VariablesMustNotShareNamesWithClasses

11. **Structure Rules** (13 total):
    - AvoidLowValueWrapperMethods
    - AvoidTrivialPropertyGetters
    - ClassesMustHaveMethods
    - CombineNestedIfStatements
    - EnumMinimumValues
    - InnerClassesCannotBeStatic
    - InnerClassesCannotHaveStaticMembers
    - NoParameterClasses
    - NoThisOutsideConstructors
    - NoUnnecessaryAttributeVariables
    - NoUnnecessaryReturnVariables
    - PreferPropertySyntaxOverGetterMethods
    - PreferSwitchOverIfElseChains

**Total: 44 rules across 6 categories**

### Phase 4: Validation & Quality

1. **Create validation scripts**
   - `scripts/validate-rules.js` - Validate all rulesets
     - XML schema validation for rulesets
     - XPath syntax validation
     - Rule name consistency checks
     - Rule quality checks (descriptions, properties, etc.)
   - `scripts/version-bump.js` - Automated version bumping
     - Support major/minor/patch versions
     - Update version in package.json
     - Update version in rules (if versioned in XML)
   - `scripts/generate-changelog.js` - Changelog generation from commits
     - Parse git commits
     - Generate formatted changelog
   - `scripts/list-test-files.js` - List test fixture files
     - Help identify missing test fixtures
     - Generate test file inventory

2. **Add linting and formatting**
   - ESLint 9.x with flat config (`eslint.config.mjs`) for JavaScript test files
   - Prettier for XML ruleset formatting (required)
   - XML schema validation for rulesets
   - Pre-commit hooks configured (via husky) to format XML before commit

3. **Rule quality validation**
   - Ensure all rules have clear, descriptive names
   - Validate all rules have comprehensive descriptions
   - Check that configurable properties are exposed where applicable
   - Verify all rules use XPath only (no custom Java classes)
   - Validate rule naming consistency

4. **Documentation**
   - **All rules must be documented in README.md with examples**
   - For each rule, include:
     - Rule name and category
     - Clear description of what the rule checks
     - Code examples showing violations (what triggers the rule)
     - Code examples showing valid code (what doesn't trigger the rule)
     - Configurable properties (if any) with default values
     - Priority level
   - **Create AI Agent-friendly rule guide** (`docs/AI_AGENT_RULE_GUIDE.md`)
     - Structured format for all rules
     - Instructions for using in Cursor and other AI coding environments
     - Machine-readable format for AI agents
   - **Rule migration guides** (`docs/MIGRATION_GUIDES.md`)
     - Guide for migrating between rule versions
     - Breaking changes documentation
     - How to update code when rules change
     - Examples of code changes needed for rule updates
     - Version-specific migration paths
   - Update README with test coverage
   - Add troubleshooting guide
   - Include benchmark results in documentation

## Pre-commit Hook Configuration

### `.lintstagedrc` Configuration

```json
{
  "*.xml": ["prettier --write"],
  "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"]
}
```

### `.husky/pre-commit` Hook

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

This ensures:
- All staged XML files are automatically formatted with Prettier
- All staged JavaScript files are formatted and linted
- Commits are blocked if formatting fails
- No manual formatting step required before commit

## Package.json Configuration

```json
{
  "name": "sca-extra",
  "version": "1.0.0",
  "description": "Additional PMD rules for Salesforce Apex code analysis",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/starch-uk/sca-extra.git"
  },
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:rules": "node scripts/validate-rules.js && pnpm test",
    "validate": "node scripts/validate-rules.js",
    "format": "prettier --write \"rulesets/**/*.xml\" \"tests/**/*.js\" \"scripts/**/*.js\"",
    "format:check": "prettier --check \"rulesets/**/*.xml\" \"tests/**/*.js\" \"scripts/**/*.js\"",
    "lint": "eslint tests/**/*.js scripts/**/*.js",
    "lint:fix": "eslint --fix tests/**/*.js scripts/**/*.js",
    "benchmark": "node scripts/benchmark.js",
    "check-regressions": "node scripts/check-performance-regressions.js",
    "version:bump": "node scripts/version-bump.js",
    "changelog": "node scripts/generate-changelog.js",
    "ci": "pnpm run format:check && pnpm run lint && pnpm test",
    "generate-test-ruleset": "node scripts/generate-test-ruleset.js",
    "ast-dump": "bash scripts/ast-dump.sh",
    "prepare": "husky install"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "@prettier/plugin-xml": "^3.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0",
    "xml2js": "^0.6.0",
    "xmldom": "^0.6.0"
  },
  "dependencies": {}
}
```

## Test File Structure Example

### Unit Test (`tests/unit/structure.test.js`)
```javascript
const { runPMD, parseViolations, assertViolation } = require('../helpers/pmd-helper');

```


## PMD Integration

### Running PMD

**Critical:** PMD is used as a CLI tool, NOT an npm package.

- **Command format:** `pmd check --no-cache -d <apex-file> -R <ruleset> -f xml`
  - `--no-cache` - Disable PMD cache for consistent test results
  - `-d` - Directory or file to analyze
  - `-R` - Ruleset file path
  - `-f xml` - Output format (XML for parsing)
  - `-l apex` - Language (Apex)
- **Output parsing:** Parse XML output to extract violations
  - Violation attributes: file, rule, message, beginline, begincol
  - PMD may exit with non-zero code when violations found (expected)
  - Output may contain warnings before XML - extract XML portion
- **Error handling:**
  - Check if PMD CLI is available (ENOENT error)
  - Handle timeout (30 seconds recommended)
  - Extract XML from stdout even on non-zero exit

### AST Debugging

- **Command:** `pmd ast-dump -d <apex-file> -l apex`
- **XML format:** `pmd ast-dump -d <apex-file> -l apex -f xml > output.ast.xml`
- **Helper script:** Create `scripts/ast-dump.sh`
  - Accepts apex file as argument
  - Checks if PMD is available
  - Outputs AST in text format
  - Optionally saves to XML file
  - Usage: `pnpm run ast-dump <apex-file>` or `bash scripts/ast-dump.sh <apex-file>`
- **Documentation:** Document common AST patterns in `docs/APEX_PMD_AST.md`
  - Node types and relationships
  - Common XPath patterns
  - AST traversal examples

## Rule Requirements

### Rule Implementation Standards

1. **XPath Only**: All rules MUST use XPath 3.1 expressions only. No custom Java classes or rule implementations beyond `XPathRule` are permitted.

2. **Clear Naming**: Rule names must be:
   - Descriptive and self-explanatory
   - Follow consistent naming conventions (PascalCase)
   - Clearly indicate what the rule checks
   - Examples: `NoSingleLetterVariableNames`, `InnerClassesCannotBeStatic`

3. **Comprehensive Descriptions**: Each rule must have:
   - Clear description of what the rule checks
   - Explanation of why the rule exists
   - Examples of violations (in description or documentation)
   - Any exceptions or edge cases documented

4. **Configurable Properties**: Rules should expose configurable properties where applicable:
   - Thresholds (e.g., max line count, min method length)
   - Allowed exceptions (e.g., allowed variable names, excluded patterns)
   - Behavior toggles (e.g., strict vs. lenient mode)
   - Use PMD property syntax with default values

5. **Versioning**: All rules must be versioned:
   - Rules follow semantic versioning (major.minor.patch)
   - Version is tracked in the rule XML or a separate version file
   - Breaking changes increment major version
   - New features increment minor version
   - Bug fixes increment patch version
   - Version information should be accessible for bug reports and documentation

## Rule Template Reference

Each rule follows this structure with configurable properties and versioning:
```xml
<ruleset name="Category">
    <rule
        name="RuleName"
        language="apex"
        message="User-friendly message"
        class="net.sourceforge.pmd.lang.rule.xpath.XPathRule"
    >
        <description>
            Detailed description explaining what the rule checks and why it exists.
            Include examples of violations if helpful.
            
            Version: 1.0.0
        </description>
        <priority>1-5</priority>
        <properties>
            <property name="xpath">
                <value><![CDATA[//XPath expression]]></value>
            </property>
            <!-- Configurable properties where applicable -->
            <property name="maxLength" description="Maximum allowed length">
                <value>100</value>
            </property>
            <property name="allowedNames" description="Comma-separated list of allowed names">
                <value>i,c,e</value>
            </property>
        </properties>
    </rule>
</ruleset>
```

**Note:** Version can be included in the description or tracked in a separate version file. The version should be easily accessible for bug reports.

### Property Configuration Guidelines

- Use properties for any configurable thresholds or lists
- Provide sensible defaults
- Document each property with a description
- Use appropriate types (string, integer, boolean)
- Consider backward compatibility when adding properties

## Testing Strategy

1. **Positive Tests**: Code that should NOT trigger the rule
   - Verify rule doesn't produce false positives
   - Test edge cases and exceptions
   - Test with different property configurations

2. **Negative Tests**: Code that SHOULD trigger the rule
   - Verify rule detects violations correctly
   - Test at correct line numbers
   - Test multiple violations in same file
   - Test with different property configurations

3. **Integration Tests**: Test multiple rules together
   - Ensure rules don't conflict
   - Test performance with all rules enabled

4. **Property Configuration Tests**: Test configurable properties
   - Verify default values work correctly
   - Test custom property values
   - Ensure properties are properly exposed and documented

## Benchmarking Strategy

### Built-in Performance Benchmarking

1. **Benchmark Infrastructure**
   - Create `scripts/benchmark.js` to measure rule performance
   - Test each rule individually against large Apex codebases
   - Measure execution time, memory usage, and violation count
   - Compare performance across rule versions

2. **Benchmark Fixtures**
   - Large Apex files (1000+ lines) in `benchmarks/fixtures/`
   - Real-world code samples from Salesforce projects
   - Synthetic test files for stress testing

3. **Benchmark Metrics**
   - Execution time per rule (milliseconds)
   - Total time for all rules combined
   - Memory usage
   - Number of violations detected
   - Performance regression detection

4. **Benchmark Reporting**
   - Generate benchmark reports in `benchmarks/results/`
   - **Output JSON format** for GitHub Actions integration
   - Compare current results with baseline
   - Track performance trends over time
   - Include in CI/CD for performance regression detection
   - **Automatically post results as PR comments** via GitHub Actions
   - **Performance regression alerts**: Automatically detect and alert on performance regressions
     - Configurable thresholds (e.g., >10% slower triggers alert)
     - Fail CI or add warnings for significant regressions
     - Compare against baseline and previous runs

5. **Usage**
   - Run `pnpm run benchmark` to execute all benchmarks
   - Results stored in `benchmarks/results/` (gitignored)
   - JSON output: `pnpm run benchmark -- --json` (for CI/CD integration)
   - Baseline generation: `pnpm run benchmark -- --baseline` (creates baseline.json)
   - Compare mode: `pnpm run benchmark -- --compare` (doesn't fail on regressions)
   - Check regressions: `pnpm run check-regressions` (compares against baseline)

## Development Workflow

1. **Create/Modify Rule**
   - Edit XML in `rulesets/{category}/`
   - Ensure rule uses XPath only (no custom Java classes)
   - Add configurable properties where applicable
   - Use clear, descriptive rule name
   - Write comprehensive description
   - **Version the rule** (semantic versioning: major.minor.patch)
   - Pre-commit hook will automatically format XML
   - Validate XPath syntax
   - Test with `ast-dump` if needed

2. **Write Tests**
   - Create positive and negative fixtures
   - Write unit test
   - Run `pnpm test`

3. **Validate**
   - Pre-commit hook ensures XML formatting (automatic)
   - Run `pnpm run format:check` to verify formatting
   - Run `pnpm run lint` to check JavaScript code style
   - Run `pnpm run validate` to check XML schema and rule quality
   - Run `pnpm test` to verify behavior
   - Run `pnpm run benchmark` to check performance
   - Check coverage with `pnpm run test:coverage`

4. **Document**
   - **Add rule documentation to README.md** (required for all rules)
   - Include code examples showing violations and valid code
   - Document all configurable properties with examples
   - Ensure rule has clear name and comprehensive description
   - Update benchmark results if performance changed

5. **Create Pull Request**
   - GitHub Actions will automatically:
     - Check XML formatting with Prettier
     - Lint JavaScript files
     - Run all unit tests
   - PR will be blocked if any checks fail

## Priority Implementation Order

1. **P1** (Critical): InnerClassesCannotBeStatic, InnerClassesCannotHaveStaticMembers
2. **P2** (High): Method calls in conditionals, multi-line formatting, naming restrictions, modifier rules
3. **P3** (Medium): Remaining code-style, documentation, method-signatures, naming, and structure rules
4. **P4** (Low): Complex rules requiring thorough testing (e.g., AvoidOneLinerMethods)

**Total Implementation:** 44 rules across 6 categories:
- **Code Style:** 18 rules
- **Structure:** 13 rules
- **Modifiers:** 5 rules
- **Naming:** 4 rules
- **Documentation:** 2 rules
- **Method Signatures:** 2 rules

## GitHub Actions CI/CD

### Workflow Configuration (`.github/workflows/ci.yml`)

The CI workflow runs on every pull request and ensures:
1. **Code Formatting Check**: Verifies all XML rulesets are formatted with Prettier
2. **Linting**: Checks JavaScript/TypeScript files with ESLint
3. **Unit Tests**: Runs all test suites and ensures they pass

```yaml
name: CI

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main, develop ]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Java
        uses: actions/setup-java@v5
        with:
          distribution: "temurin"
          java-version: "21"
      
      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: "24"
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10.26.1
      
      - name: Cache pnpm store
        uses: actions/cache@v5
        with:
          path: ~/.local/share/pnpm/store
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-
      
      - name: Cache dependencies
        uses: actions/cache@v5
        with:
          path: node_modules
          key: ${{ runner.os }}-node-modules-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-node-modules-
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Check XML formatting
        run: pnpm run format:check
      
      - name: Lint JavaScript
        run: pnpm run lint
      
      - name: Cache PMD
        id: cache-pmd
        uses: actions/cache@v5
        with:
          path: ~/pmd
          key: pmd-${{ env.PMD_VERSION }}
          restore-keys: |
            pmd-
      
      - name: Install PMD CLI
        if: steps.cache-pmd.outputs.cache-hit != 'true'
        run: |
          mkdir -p ~/pmd
          curl -L -o pmd-bin.zip "https://github.com/pmd/pmd/releases/download/pmd_releases%2F${PMD_VERSION}/pmd-dist-${PMD_VERSION}-bin.zip"
          unzip -q pmd-bin.zip
          mv pmd-bin-${PMD_VERSION} ~/pmd
          rm pmd-bin.zip
      
      - name: Setup PMD CLI
        run: |
          PMD_DIR="$HOME/pmd/pmd-bin-${PMD_VERSION}"
          PMD_BIN="$PMD_DIR/bin/pmd"
          sudo ln -sf "$PMD_BIN" /usr/local/bin/pmd
          pmd --version
        env:
          PMD_VERSION: "7.19.0"
      
      - name: Run tests with coverage
        run: pnpm test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v5
        if: always()
        with:
          files: ./coverage/lcov.info
          token: ${{ secrets.CODECOV_TOKEN }}
```

### Required Checks for PRs

- ✅ All XML files must be formatted with Prettier (enforced by pre-commit hook)
- ✅ All JavaScript files must pass ESLint
- ✅ All unit tests must pass
- ✅ All rules must use XPath only (no custom Java classes)
- ✅ All rules must have clear names and comprehensive descriptions
- ✅ Configurable properties must be exposed where applicable
- ✅ No merge conflicts

## Success Criteria

- [ ] All P1 rules have comprehensive tests (positive + negative)
- [ ] Test infrastructure is set up and working
- [ ] pnpm test runs successfully for all implemented tests
- [ ] Documentation is complete and accurate
- [ ] All rulesets validate against PMD schema
- [ ] All XML rulesets are formatted with Prettier
- [ ] Pre-commit hooks are configured and working
- [ ] GitHub Actions CI passes on all PRs
- [ ] Test coverage > 80% for test utilities
- [ ] README provides clear usage instructions
- [ ] CONTRIBUTING.md is complete with contribution guidelines
- [ ] SECURITY.md is complete with security policy
- [ ] GitHub issue templates are created (bug, feature, rule request)
- [ ] GitHub pull request template is created
- [ ] BSD 3-Clause License file is included
- [ ] All rules use XPath only (no custom Java classes)
- [ ] All rules have clear names and comprehensive descriptions
- [ ] **All rules are versioned** (semantic versioning)
- [ ] **All rules are documented in README.md with code examples** (violations and valid code)
- [ ] Configurable properties are exposed for applicable rules
- [ ] AI Agent-friendly rule guide (`docs/AI_AGENT_RULE_GUIDE.md`) is created
- [ ] Benchmarking infrastructure is set up and functional
- [ ] Baseline benchmark results are established
- [ ] **Note:** Benchmark PR comments and performance regression alerts in CI are not implemented (benchmarking can be run manually)
- [ ] Versioning tooling is implemented (automated version bumping, changelog generation)
- [ ] Rule migration guides are created and documented
- [ ] All 44 rules are implemented with comprehensive test coverage
- [ ] Codecov integration is configured for coverage reporting

## License

This project is licensed under the **MIT License**. See the `LICENSE.md` file for details.

**Copyright:** 2025 Beech Horn (or appropriate copyright holder)

The MIT License allows:
- Commercial use
- Modification
- Distribution
- Private use
- Sublicensing

With requirements:
- Include copyright notice
- Include license text

**Note:** The original plan mentioned BSD 3-Clause License, but the project uses MIT License instead.

## README Content Requirements

The README.md should include comprehensive instructions for using these rules in Salesforce projects:

### What Makes a Good Rule vs. What Prettier Handles

**Important:** PMD rules should focus on **code quality, logic, and best practices**, not formatting. Formatting concerns should be handled by Prettier or similar formatters.

#### Good PMD Rules Focus On:

1. **Code Quality & Logic**
   - Detecting anti-patterns and code smells
   - Enforcing best practices and design patterns
   - Identifying potential bugs or logic errors
   - Examples:
     - `NoMethodCallsInConditionals` - Prevents side effects in conditionals
     - `InnerClassesCannotBeStatic` - Enforces Apex language constraints

2. **Structural Issues**
   - Code organization and architecture
   - Class and method structure
   - Inheritance and composition patterns
   - Examples:
     - `ClassesMustHaveMethods` - Ensures classes have purpose
     - `AvoidTrivialPropertyGetters` - Prevents unnecessary wrappers
     - `NoParameterClasses` - Enforces proper class design

3. **Naming & Conventions**
   - Meaningful names that affect code readability and maintainability
   - Naming patterns that indicate intent
   - Examples:
     - `NoSingleLetterVariableNames` - Ensures descriptive variable names
     - `NoAbbreviations` - Prevents cryptic abbreviations
     - `VariablesMustNotShareNamesWithClasses` - Prevents confusion

4. **Modifiers & Access Control**
   - Appropriate use of modifiers (final, static, etc.)
   - Access control best practices
   - Examples:
     - `FinalVariablesMustBeFinal` - Ensures immutability where intended
     - `StaticMethodsMustBeStatic` - Prevents unnecessary instance methods
     - `TestClassIsParallel` - Enforces test best practices

5. **Documentation Quality**
   - Meaningful documentation, not formatting
   - Documentation completeness
   - Examples:
     - `ExceptionDocumentationRequired` - Ensures exceptions are documented

#### What Prettier Handles (Not PMD Rules):

1. **Formatting & Style**
   - Indentation and spacing
   - Line breaks and line length
   - Brace placement
   - Quote style (single vs. double)
   - Trailing commas
   - Examples of what NOT to create rules for:
     - ❌ "Methods must be on separate lines" (formatting)
     - ❌ "Indentation must be 4 spaces" (formatting)
     - ❌ "No trailing whitespace" (formatting)
     - ❌ "Line length must be < 120 characters" (formatting)

2. **Whitespace & Spacing**
   - Spaces around operators
   - Spaces in function calls
   - Blank lines between methods
   - Examples:
     - ❌ "No consecutive blank lines" (formatting - though this could be a code quality rule if it's about readability)
     - ❌ "Spaces around operators" (formatting)

3. **Syntax Formatting**
   - Semicolon placement
   - Comma placement
   - Parentheses spacing
   - Examples:
     - ❌ "Always use semicolons" (formatting)
     - ❌ "No space before opening parenthesis" (formatting)

#### When to Create a Rule vs. Use Prettier:

**Create a PMD Rule When:**
- The issue affects code quality, maintainability, or correctness
- The check requires understanding code semantics (not just syntax)
- The rule helps prevent bugs or enforces architectural decisions
- The rule is about "what" the code does, not "how" it looks

**Use Prettier When:**
- The issue is purely about code appearance
- The check is about spacing, indentation, or line breaks
- The rule would just reformat code without changing meaning
- The rule is about "how" the code looks, not "what" it does

#### Examples:

**Good Rule (PMD):**
```apex
// Rule: NoMethodCallsInConditionals
// Why: Prevents side effects and makes code more predictable
if (getValue() > 0) {  // ❌ Method call in conditional
    // ...
}
```

**Formatting (Prettier):**
```apex
// Prettier handles: Indentation, spacing, line breaks
if(getValue()>0){  // Prettier formats to:
if (getValue() > 0) {  // Proper spacing
```

**Good Rule (PMD):**
```apex
// Rule: NoSingleLetterVariableNames
// Why: Ensures code is readable and maintainable
Integer x = 5;  // ❌ Unclear what 'x' represents
```

**Formatting (Prettier):**
```apex
// Prettier handles: Spacing around operators
Integer x=5;  // Prettier formats to:
Integer x = 5;  // Proper spacing
```

**Note:** Some rules may appear to overlap with formatting (e.g., `NoConsecutiveBlankLines`), but if they're about code readability and structure rather than pure formatting, they can be appropriate PMD rules. The key distinction is: **Does this affect code quality and understanding, or just appearance?**

### Adding Rules to a Salesforce Project

1. **Clone or download the repository**
   ```bash
   git clone https://github.com/starch-uk/sca-extra.git
   ```

2. **Copy rulesets to your Salesforce project**
   - Copy the `rulesets/` directory to your Salesforce project root
   - Or copy specific category folders (e.g., `rulesets/structure/`) as needed
   - Maintain the directory structure for organization

3. **Reference rulesets in your project**
   - Rulesets can be referenced by relative path from your project root
   - Example: `rulesets/structure/InnerClassesCannotBeStatic.xml`

### Enabling Rules in code-analyzer.yml

The `code-analyzer.yml` file (Salesforce Code Analyzer configuration) should reference the rulesets:

```yaml
rulesets:
  - rulesets/structure/InnerClassesCannotBeStatic.xml
  - rulesets/structure/InnerClassesCannotHaveStaticMembers.xml
  - rulesets/modifiers/FinalVariablesMustBeFinal.xml
  - rulesets/naming/NoSingleLetterVariableNames.xml
  # Add more rulesets as needed
```

**Full example `code-analyzer.yml`:**
```yaml
name: Salesforce Code Analyzer Configuration
version: 1.0.0

rulesets:
  # Structure rules
  - rulesets/structure/InnerClassesCannotBeStatic.xml
  - rulesets/structure/InnerClassesCannotHaveStaticMembers.xml
  
  # Modifier rules
  - rulesets/modifiers/FinalVariablesMustBeFinal.xml
  - rulesets/modifiers/StaticMethodsMustBeStatic.xml
  
  # Naming rules
  - rulesets/naming/NoSingleLetterVariableNames.xml
  - rulesets/naming/NoAbbreviations.xml
  
  # Code style rules
  - rulesets/code-style/NoMethodCallsInConditionals.xml
  - rulesets/code-style/PreferSafeNavigationOperator.xml
```

### Configuring Rule Properties

Many rules expose configurable properties that can be customized in `code-analyzer.yml`:

```yaml
rulesets:
  - rulesets/naming/NoSingleLetterVariableNames.xml

rules:
  NoSingleLetterVariableNames:
    properties:
      allowedNames: "i,c,e,x"  # Customize allowed single-letter names
      strictMode: true          # Enable strict mode
```

**Example with multiple rules:**
```yaml
rulesets:
  - rulesets/naming/NoSingleLetterVariableNames.xml
  - rulesets/code-style/SingleArgumentMustBeSingleLine.xml

rules:
  NoSingleLetterVariableNames:
    properties:
      allowedNames: "i,c,e"
  
  SingleArgumentMustBeSingleLine:
    properties:
      maxLineLength: 120
      allowExceptions: false
```

**Property configuration format:**
- Properties are defined in the rule XML with default values
- Override defaults in `code-analyzer.yml` under the `rules` section
- Use the rule name as the key
- Properties can be strings, integers, or booleans
- Check each rule's XML for available properties and their descriptions

**Finding available properties:**
1. Open the rule XML file (e.g., `rulesets/naming/NoSingleLetterVariableNames.xml`)
2. Look for `<property>` elements in the `<properties>` section
3. Each property has a `name` and `description` attribute
4. The default value is in the `<value>` element

### Complete Example

```yaml
name: My Salesforce Project Code Analyzer Config
version: 1.0.0

rulesets:
  # P1 - Critical rules
  - rulesets/structure/InnerClassesCannotBeStatic.xml
  - rulesets/structure/InnerClassesCannotHaveStaticMembers.xml
  
  # P2 - High priority rules
  - rulesets/modifiers/FinalVariablesMustBeFinal.xml
  - rulesets/naming/NoSingleLetterVariableNames.xml
  - rulesets/code-style/NoMethodCallsInConditionals.xml

rules:
  NoSingleLetterVariableNames:
    properties:
      allowedNames: "i,c,e,x,y,z"  # Allow loop counters and common exceptions
  
  FinalVariablesMustBeFinal:
    properties:
      strictMode: true
      checkLocalVariables: true
```

## AI Agent-Friendly Rule Configuration Guide

### Purpose

Create `docs/AI_AGENT_RULE_GUIDE.md` - A concise, structured markdown file designed for AI coding assistants (like Cursor, GitHub Copilot, etc.) to help developers configure and use PMD rules effectively.

### Content Structure

The guide should be:
- **Concise**: Easy for AI agents to parse and understand
- **Structured**: Consistent format for all rules
- **Example-rich**: Clear code examples for each rule
- **Property-focused**: All configurable properties clearly documented

### Format for Each Rule

```markdown
## RuleName

**Category:** [code-style/documentation/method-signatures/modifiers/naming/structure]
**Priority:** [P1/P2/P3/P4]
**Description:** Brief description of what the rule checks

### Violations (Code that triggers the rule)
\`\`\`apex
// Example code that violates the rule
\`\`\`

### Valid Code (Code that doesn't trigger the rule)
\`\`\`apex
// Example code that is valid
\`\`\`

### Configurable Properties
- `propertyName` (type): Description. Default: `defaultValue`
  - Example: `propertyName: "customValue"`

### Usage in code-analyzer.yml
\`\`\`yaml
rulesets:
  - rulesets/category/RuleName.xml

rules:
  RuleName:
    properties:
      propertyName: "customValue"
\`\`\`
```

### Instructions for Using in Cursor

Include a section at the beginning of the guide:

```markdown
# AI Agent Rule Configuration Guide

This guide is designed for AI coding assistants to help developers configure PMD rules for Salesforce Apex code analysis.

## How to Use This Guide in Cursor

1. **Add to Cursor Rules:**
   - Open Cursor Settings
   - Navigate to Rules or create `.cursorrules` file in your project
   - Add: "When helping with Salesforce Code Analyzer configuration, refer to docs/AI_AGENT_RULE_GUIDE.md"

2. **Reference in Conversations:**
   - When asked about PMD rules, reference this guide
   - Use the structured format to provide accurate rule information
   - Include code examples from the guide

3. **Configuration Help:**
   - When configuring `code-analyzer.yml`, use property examples from this guide
   - Suggest appropriate property values based on the rule's purpose
   - Provide complete YAML examples when needed
```

### Benefits

- Enables AI agents to provide accurate, consistent rule information
- Reduces errors in rule configuration
- Provides quick reference for developers
- Ensures all rules are documented in a machine-readable format
- Supports automated rule suggestion and configuration

## CONTRIBUTING.md Content Requirements

The CONTRIBUTING.md file should include:

### Welcome
- Thank contributors for their interest
- Explain the project's goals
- Link to code of conduct (if applicable)

### Development Setup
- Prerequisites:
  - Node.js version 18 or higher
  - pnpm (latest version)
  - **PMD CLI version 7.0+** (NOT an npm package - must be installed separately)
    - macOS: `brew install pmd`
    - Linux/Windows: Download from PMD website
    - Verify: `pmd --version` and `pmd check --help`
    - Must be in system PATH
- Installation steps:
  - Clone repository
  - Run `pnpm install`
  - Run `pnpm run prepare` to set up husky hooks
- How to run tests locally:
  - `pnpm test` - Run all tests
  - `pnpm run test:watch` - Watch mode
  - `pnpm run test:coverage` - With coverage report
- How to run benchmarks:
  - `pnpm run benchmark` - Run all benchmarks
  - `pnpm run benchmark -- --baseline` - Generate baseline
  - `pnpm run benchmark -- --json` - JSON output for CI
  - `pnpm run check-regressions` - Check for performance regressions

### Adding New Rules
- Step-by-step guide for creating a new rule
- Rule naming conventions
- XPath-only requirement reminder
- Property configuration guidelines
- Testing requirements (positive and negative cases)

### Pull Request Process
- Branch naming conventions
- Commit message format
- PR checklist
- Review process
- Required tests and documentation

### Code Style
- XML formatting (Prettier)
- JavaScript/TypeScript style (ESLint)
- Documentation requirements

### Testing Requirements
- All rules must have positive and negative test cases
- Test coverage expectations
- How to run tests locally

### Community-Contributed Rules
- Guidelines for submitting community-contributed rules
- Review process for new rules
- Requirements for community rules (same as core rules):
  - Must use XPath only
  - Must have clear names and descriptions
  - Must be versioned
  - Must have comprehensive tests
  - Must be documented in README.md
  - Must expose configurable properties where applicable
- How to propose new rules via issue templates
- Attribution and credit for contributors

## SECURITY.md Content Requirements

The SECURITY.md file should include:

### Supported Versions
- Which versions receive security updates
- End-of-life policy

### Reporting a Vulnerability
- How to report security issues privately
- Contact information (email or security advisory)
- What information to include
- Expected response time

### Disclosure Policy
- How vulnerabilities are disclosed
- Timeline for fixes
- Credit policy for reporters

### Security Best Practices
- Guidelines for contributors
- Dependency management
- Regular security audits

## GitHub Issue Templates

### Bug Report Template (`.github/ISSUE_TEMPLATE/bug_report.md`)

Should include:
- **Motivation/Problem**: What problem does this bug cause?
- **Examples**: Code examples showing the bug
- **Versions**: Code Analyzer version and rule version with instructions on how to find them

Example structure:
```markdown
## Motivation / Problem
<!-- Why is this bug a problem? What does it prevent? -->

## Examples
<!-- Provide code examples that demonstrate the bug -->

## Versions

### How to Find Versions

**Salesforce Code Analyzer Version:**
- Run: `sf scanner:version` or check your `package.json` if using pnpm
- Or check the output of: `sf scanner:run --help`

**Rule Version:**
- Check the rule XML file in `rulesets/{category}/{RuleName}.xml`
- Look for version information in the rule metadata or description
- Or check the git commit/tag where the rule was last updated

**Please provide:**
- Salesforce Code Analyzer version: [version here]
- Rule version: [version here]
- Rule name: [rule name here]
```

### Feature Request Template (`.github/ISSUE_TEMPLATE/feature_request.md`)

Should include:
- **Motivation**: Why is this feature needed? What problem does it solve?
- **Examples**: Code examples showing how the feature would be used

Example structure:
```markdown
## Motivation
<!-- Why is this feature needed? What problem does it solve? -->

## Examples
<!-- Provide code examples showing how this feature would be used -->
```

### Rule Request Template (`.github/ISSUE_TEMPLATE/rule_request.md`)

Should include:
- **Motivation**: Why is this rule needed? What code quality issue does it address?
- **Examples**: 
  - Code examples that SHOULD trigger the rule (violations)
  - Code examples that should NOT trigger the rule (valid code)
- Rule description
- Priority/severity
- Category (code-style, documentation, naming, etc.)
- Configurable properties (if applicable)

Example structure:
```markdown
## Motivation
<!-- Why is this rule needed? What code quality issue does it address? -->

## Examples of Violations
<!-- Code examples that SHOULD trigger this rule -->

```apex
// Example 1: ...
```

## Examples of Valid Code
<!-- Code examples that should NOT trigger this rule -->

```apex
// Example 1: ...
```

## Rule Details
- **Category**: [code-style/documentation/method-signatures/modifiers/naming/structure]
- **Priority**: [P1/P2/P3/P4]
- **Configurable Properties**: [List any properties that should be configurable]

## Additional Context
<!-- Any other information that would be helpful -->
```

## Pull Request Template (`.github/pull_request_template.md`)

Should include:
- **Motivation**: Why is this change needed? What problem does it solve?
- **Examples**: Code examples demonstrating the change
- Description of changes
- Type of change (bug fix, new rule, enhancement, etc.)
- Testing information
- Checklist

Example structure:
```markdown
## Motivation
<!-- Why is this change needed? What problem does it solve? -->

## Examples
<!-- Provide code examples that demonstrate this change -->

### Before
```apex
// Example code before the change
```

### After
```apex
// Example code after the change
```

## Description
<!-- Describe your changes in detail -->

## Type of Change
- [ ] Bug fix
- [ ] New rule
- [ ] Rule enhancement
- [ ] Documentation
- [ ] Other (please describe)

## Testing
<!-- Describe the tests you added/updated and how to verify the changes -->

- [ ] Added positive test cases
- [ ] Added negative test cases
- [ ] All existing tests pass
- [ ] Test coverage maintained/improved

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests pass locally
- [ ] Pre-commit hooks pass
```
