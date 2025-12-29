# Project Plan: Salesforce Apex PMD and Regex Rules

## Overview

This project will provide additional PMD and Regex rules for testing Salesforce Apex code using Salesforce Code Analyzer. Most rules will be implemented as XPath 3.1 expressions that operate on the PMD Apex AST. Some rules will use the Regex engine for pattern-based matching.

**Repository:** [https://github.com/starch-uk/sca-extra](https://github.com/starch-uk/sca-extra)

## Project Scope

This plan describes the project scope and components that will be implemented:

- **43 PMD rules and 3 Regex rules** across PMD's 8 standard categories (best-practices, code-style, design, documentation, error-prone, multithreading, performance, security)
- **Comprehensive test infrastructure** with positive and negative test fixtures for all rules, including Regex rule testing helpers
- **Benchmarking system** with stress-test fixtures targeting 580+ violations across 7 fixture files
- **CI/CD pipeline** with PMD 7.19.0, Java 21, Node.js 24, pnpm 10.26.2, and Codecov integration
- **Documentation** including AI Agent-friendly rule guide, XPath 3.1 reference, PMD AST reference, and Regex engine reference
- **Development tooling** including AST dump helper, validation scripts, version bumping, and changelog generation

## Project Structure

The project will have the following structure:

```
sca-extra/
├── README.md                          # Project documentation
├── LICENSE.md                         # MIT License
├── CONTRIBUTING.md                    # Contribution guidelines
├── SECURITY.md                        # Security policy
├── PLAN.md                            # This file - project plan
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
│   ├── XPATH31.md                     # XPath 3.1 reference
│   ├── APEX_PMD_AST.md                # PMD Apex AST reference
│   ├── REGEX.md                       # Regex engine reference and custom rule creation guide
│   ├── CODE_ANALYZER_CONFIG.md        # Code Analyzer configuration reference
│   ├── AI_AGENT_RULE_GUIDE.md         # AI Agent-friendly rule configuration guide
│   ├── MIGRATION_GUIDES.md             # Rule migration guides between versions
│   ├── APEXDOC.md                     # ApexDoc syntax and documentation format
│   ├── SUPPRESS_WARNINGS.md           # How to suppress PMD rule violations
│   ├── PMD.md                         # PMD quick reference
│   ├── JEST30.md                      # Jest 30.0 API reference
│   └── PNPM.md                        # pnpm package manager reference
├── rulesets/                          # PMD ruleset XML files (organized by PMD's 8 categories)
│   ├── best-practices/                # Best practices rules (modifiers, test classes)
│   ├── code-style/                    # Code style rules (formatting, naming conventions)
│   ├── design/                        # Design rules (structure, method signatures, class organization)
│   ├── documentation/                 # Documentation rules
│   ├── error-prone/                   # Error-prone patterns (currently empty)
│   ├── multithreading/                # Multithreading issues (currently empty)
│   ├── performance/                   # Performance rules (currently empty)
│   └── security/                      # Security rules (currently empty)
├── code-analyzer.yml                  # Contains Regex rules configuration (rulesets disabled for repository template)
├── jest.config.js                     # Jest test configuration
├── tests/                             # Test files
│   ├── fixtures/                      # Test Apex code files
│   │   ├── positive/                  # Code that should NOT trigger rules
│   │   │   ├── code-style/            # Positive test fixtures for code-style rules
│   │   │   ├── documentation/         # Positive test fixtures for documentation rules
│   │   │   ├── best-practices/        # Positive test fixtures for best-practices rules
│   │   │   ├── design/                # Positive test fixtures for design rules
│   │   │   ├── error-prone/           # Positive test fixtures for error-prone rules
│   │   │   ├── multithreading/        # Positive test fixtures for multithreading rules
│   │   │   ├── performance/           # Positive test fixtures for performance rules
│   │   │   └── security/               # Positive test fixtures for security rules
│   │   └── negative/                  # Code that SHOULD trigger rules
│   │       ├── best-practices/        # Negative test fixtures for best-practices rules
│   │       ├── code-style/            # Negative test fixtures for code-style rules
│   │       ├── design/                # Negative test fixtures for design rules
│   │       ├── documentation/         # Negative test fixtures for documentation rules
│   │       ├── error-prone/           # Negative test fixtures for error-prone rules
│   │       ├── multithreading/        # Negative test fixtures for multithreading rules
│   │       ├── performance/           # Negative test fixtures for performance rules
│   │       └── security/               # Negative test fixtures for security rules
│   ├── helpers/                       # Test helper utilities
│   │   └── pmd-helper.js              # PMD and Regex test helper functions (runPMD, runRegexRule)
│   ├── rulesets/                      # Test-specific rulesets
│   │   └── test-ruleset.xml           # Combined ruleset for testing (generated)
│   └── unit/                          # Unit test files
│       ├── code-style.test.js
│       ├── documentation.test.js
│       ├── best-practices.test.js
│       ├── design.test.js
│       ├── error-prone.test.js
│       ├── multithreading.test.js
│       ├── performance.test.js
│       └── security.test.js
├── scripts/                           # Utility scripts
│   ├── generate-test-ruleset.js      # Generate combined test ruleset from all rules
│   ├── validate-rules.js             # Validate XML ruleset syntax and rule quality
│   ├── benchmark.js                  # Performance benchmarking script (tests all rules against stress fixtures)
│   ├── check-performance-regressions.js  # Check for performance regressions against baseline
│   ├── version-bump.js               # Automated version bumping (major/minor/patch)
│   ├── generate-changelog.js         # Generate changelog from git commits
│   ├── list-test-files.js            # List test fixture files for inventory
│   ├── ast-dump.sh                    # Helper for AST debugging (PMD AST dump wrapper)
│   ├── check-xml-order.js             # Check XML element order in ruleset files
│   ├── fix-xml-element-order.js       # Automatically fix XML element order
│   └── clean.js                       # Clean build artifacts and temporary files
├── benchmarks/                        # Benchmark test files
│   ├── fixtures/                      # Large Apex files for benchmarking
│   │   ├── stress-test-all-rules.cls  # Comprehensive stress test (100+ violations across all rules)
│   │   ├── stress-code-style.cls      # Code style stress test (200+ violations, 17 rules)
│   │   ├── stress-design.cls          # Design stress test (130+ violations, 15 rules - structure + method signatures)
│   │   ├── stress-best-practices.cls  # Best practices stress test (100+ violations, 5 rules - modifiers)
│   │   ├── stress-code-style.cls      # Code style stress test (300+ violations, 21 rules - includes naming)
│   │   └── stress-documentation.cls   # Documentation stress test (30+ violations, 2 rules)
│   ├── results/                      # Benchmark results (gitignored)
│   ├── README.md                      # Benchmark documentation
│   └── FIXTURES.md                    # Benchmark fixture documentation
└── .github/                           # GitHub Actions
    └── workflows/
        └── ci.yml                     # CI/CD workflow (lint + test on PRs)
```

## Critical Prerequisites

### PMD CLI Installation

**IMPORTANT:** This project will use PMD CLI directly as an external tool. PMD is NOT an npm package and must be installed separately.

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
   pmd check -d <apex-file> -R <ruleset> -l apex -f xml -r <output-file>
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
     - `@xmldom/xmldom` (^0.8.11) - DOM implementation for XML parsing
     - `yaml` (^2.6.1) - YAML parsing
     - `sanitize-filename` (^1.6.3) - File path sanitization for scripts accepting user input
   - Configure pnpm scripts for testing, validation, linting, and development
   - Add Prettier for XML formatting of rulesets

2. **Documentation layout**
   - Create `docs/XPATH31.md` with the XPath 3.1 reference
   - Create `docs/APEX_PMD_AST.md` with the PMD Apex AST reference
   - Create `docs/REGEX.md` with Regex engine reference
   - Create `docs/CODE_ANALYZER_CONFIG.md` with Code Analyzer configuration reference
   - Create `docs/AI_AGENT_RULE_GUIDE.md` with AI Agent-friendly rule guide
   - Create `docs/MIGRATION_GUIDES.md` with rule migration guides
   - Create `docs/APEXDOC.md` with ApexDoc syntax reference
   - Create `docs/SUPPRESS_WARNINGS.md` with suppression guide
   - Create `docs/PMD.md` with PMD quick reference
   - Create `docs/JEST30.md` with Jest 30.0 API reference
   - Create `docs/PNPM.md` with pnpm reference
   - Organize `rulesets/` structure by category

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
   - Configure Prettier with XML plugin (`@prettier/plugin-xml`)
   - Create `.prettierrc` configuration for XML formatting rules
   - Add pnpm script to format all XML rulesets
   - Ensure consistent XML formatting across all ruleset files

6. **Set up pre-commit hooks**
   - Install husky for Git hooks
   - Create `.husky/pre-commit` hook to automatically format XML files
   - Use `lint-staged` to format only staged files
   - Configure `.lintstagedrc` or `package.json` lint-staged section to format XML files with Prettier
   - Ensure all committed XML files are formatted with Prettier before commit
   - Hook should run automatically on `git commit`

7. **Set up GitHub Actions CI/CD**
   - Create `.github/workflows/ci.yml` workflow
   - Run on pull requests and pushes to main/develop branches
   - Setup Java 21 (required for PMD 7.19.0)
   - Setup Node.js 24
   - Setup pnpm 10.26.2
   - Cache pnpm store and node_modules
   - Install PMD CLI 7.19.0 (download and cache)
   - Run on pull requests: lint (Prettier check), ESLint, and unit tests with coverage
   - Fail PR if files are not properly formatted or tests fail
   - Upload coverage to Codecov (requires CODECOV_TOKEN secret)
   - **Note:** Benchmark PR comments and performance regression alerts will not be implemented in CI (benchmarking can be run manually)

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
    - Contact information for security issues (email: security@starch.uk)

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
     - Uses `pmd check --no-cache -d <file> -R <ruleset> -f xml -r <output-file>`
     - Handles PMD exit codes (non-zero when violations found is expected)
     - Extracts XML from output (handles warnings before XML)
     - Timeout: 30 seconds
     - Error handling for missing PMD CLI
   - `parseViolations(pmdOutput)` - Parse PMD XML output
     - Uses `@xmldom/xmldom` DOMParser
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
   - Or maintain separate test runs per category (planned approach)

5. **Set up benchmarking infrastructure**
   - Create `scripts/benchmark.js` to measure rule performance
   - Test rules against large Apex codebases
   - Track execution time per rule
   - Store benchmark results for comparison
   - Add benchmark fixtures in `benchmarks/fixtures/`:
     - `stress-test-all-rules.cls` - Comprehensive (100+ violations across all rules)
     - `stress-code-style.cls` - Code style focused (200+ violations)
     - `stress-design.cls` - Design focused (130+ violations - structure + method signatures)
     - `stress-best-practices.cls` - Best practices focused (100+ violations - modifiers)
     - `stress-code-style.cls` - Code style focused (300+ violations - includes naming)
     - `stress-documentation.cls` - Documentation focused (30+ violations)
   - Create `benchmarks/README.md` - Benchmark documentation
   - Create `benchmarks/FIXTURES.md` - Fixture statistics and coverage
  - Create `scripts/check-performance-regressions.js` - Regression detection
  - Results stored in `benchmarks/results/` (gitignored)
  - Support baseline comparison and JSON output for CI
  - Create `pnpm run benchmark` script
  - Create `pnpm run check-regressions` script
  - **Script Security**: Scripts accepting file paths from user input must implement security measures:
    - Use `sanitize-filename` package to sanitize file paths
    - Validate paths to prevent path traversal attacks (reject `..` sequences)
    - Use `fs.realpathSync()` to resolve symbolic links and validate containment
    - Reject absolute paths when relative paths are expected

### Phase 3: Rule Implementation

**Note:** All 46 rules will be implemented with comprehensive test coverage. The following represents the planned implementation order.

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
7. **Code Style Rules** (17 total):
   - AvoidOneLinerMethods
   - ListInitializationMustBeMultiLine
   - MapInitializationMustBeMultiLine
   - MapShouldBeInitializedWithValues
   - MultipleStringContainsCalls
   - NoConsecutiveBlankLines (Regex rule)
   - NoMethodCallsAsArguments
   - NoMethodCallsInConditionals
   - PreferBuilderPatternChaining
   - PreferConcatenationOverStringJoinWithEmpty
   - PreferMethodCallsInLoopConditions
   - PreferNullCoalescingOverTernary
   - PreferSafeNavigationOperator
   - PreferStringJoinOverConcatenation
   - PreferStringJoinOverMultipleNewlines
   - PreferStringJoinWithSeparatorOverEmpty
   - ProhibitSuppressWarnings (Regex rule)
   - SingleArgumentMustBeSingleLine

8. **Documentation Rules** (2 total):
   - ExceptionDocumentationRequired
   - SingleLineDocumentationFormat

9. **Design Rules - Method Signatures** (2 total):
   - NoCustomParameterObjects
   - SingleParameterMustBeSingleLine

10. **Code Style Rules - Naming** (4 total):
    - InnerClassesMustBeOneWord
    - NoAbbreviations
    - NoSingleLetterVariableNames
    - VariablesMustNotShareNamesWithClasses

11. **Design Rules - Structure** (13 total):
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

**Total: 46 rules across PMD's 8 standard categories (43 PMD rules + 3 Regex rules)**

### Phase 4: Validation & Quality

1. **Create validation scripts**
   - `scripts/validate-rules.js` - Validate all rulesets
     - XML schema validation for rulesets
     - XPath syntax validation
     - Rule name consistency checks
     - Rule quality checks (descriptions, properties, etc.)
   - `scripts/check-xml-order.js` - Check XML element order in ruleset files
   - `scripts/fix-xml-element-order.js` - Automatically fix XML element order
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
   - `scripts/clean.js` - Clean build artifacts and temporary files

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
   - Ensure XML element order follows PMD schema

4. **Documentation**
   - **All rules will be documented in README.md with examples**
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
   - **Regex engine reference** (`docs/REGEX.md`)
     - Regex engine configuration guide
     - Custom Regex rule creation instructions
     - Pattern examples and best practices
   - **Code Analyzer configuration reference** (`docs/CODE_ANALYZER_CONFIG.md`)
     - Complete `code-analyzer.yml` configuration reference
     - All engine settings and properties
   - **Rule migration guides** (`docs/MIGRATION_GUIDES.md`)
     - Guide for migrating between rule versions
     - Breaking changes documentation
     - How to update code when rules change
     - Examples of code changes needed for rule updates
     - Version-specific migration paths
   - README will include test coverage information
   - Troubleshooting guide will be added
   - Benchmark results will be included in documentation

## Pre-commit Hook Configuration

### `.lintstagedrc` Configuration (or in package.json)

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
    "check-xml-order": "node scripts/check-xml-order.js",
    "fix-xml-order": "node scripts/fix-xml-element-order.js",
    "clean": "node scripts/clean.js"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.2",
    "@prettier/plugin-xml": "^3.4.2",
    "@types/jest": "^30.0.0",
    "eslint": "^9.39.2",
    "globals": "^16.5.0",
    "husky": "^9.0.11",
    "jest": "^30.2.0",
    "lint-staged": "^16.2.7",
    "prettier": "^3.2.5",
    "@xmldom/xmldom": "^0.8.11",
    "yaml": "^2.6.1"
  },
  "pnpm": {
    "onlyBuiltDependencies": [
      "unrs-resolver"
    ]
  },
  "lint-staged": {
    "*.xml": ["prettier --write"],
    "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"]
  }
}
```

## PMD Integration

### Running PMD

**Critical:** PMD will be used as a CLI tool, NOT an npm package.

- **Command format:** `pmd check --no-cache -d <apex-file> -R <ruleset> -f xml -r <output-file>`
  - `--no-cache` - Disable PMD cache for consistent test results
  - `-d` - Directory or file to analyze
  - `-R` - Ruleset file path
  - `-f xml` - Output format (XML for parsing)
  - `-l apex` - Language (Apex)
  - `-r <file>` - Output report to file (required to avoid progressbar conflicts)
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
  - **Security**: Must validate file paths to prevent path traversal attacks (reject `..` sequences, use `realpath` to resolve symlinks)
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

4. **XML Element Order**: Rules must follow PMD Ruleset XML Schema element order:
   - `<description>` → `<priority>` → `<properties>` → `<exclude>` → `<example>`
   - Scripts will be created to check and fix element order

5. **Test Coverage**: All rules must have:
   - Positive test cases (code that should NOT trigger the rule)
   - Negative test cases (code that SHOULD trigger the rule)
   - Tests in `tests/unit/{category}.test.js`
   - Test fixtures in `tests/fixtures/positive/` and `tests/fixtures/negative/`

6. **Benchmark Coverage**: All rules should be included in benchmark stress tests:
   - Add violations to `benchmarks/fixtures/stress-test-all-rules.cls`
   - Add focused violations to category-specific fixture
   - Target 10-20 violations per rule
   - Update `benchmarks/FIXTURES.md` with violation counts

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
  - **Output JSON format** that can be consumed by CI workflows
  - Compare results with baseline
  - Track performance trends over time
  - Benchmarking is run via scripts and is not enforced as part of CI by default

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
   - Pre-commit hook will ensure XML formatting (automatic)
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
   - Update benchmark results if performance changes

5. **Create Pull Request**
   - GitHub Actions will automatically:
     - Check XML formatting with Prettier
     - Lint JavaScript files
     - Run all unit tests
   - PR will be blocked if any checks fail

## Priority Implementation Order

1. **P1** (Critical): InnerClassesCannotBeStatic, InnerClassesCannotHaveStaticMembers
2. **P2** (High): Method calls in conditionals, multi-line formatting, naming restrictions, modifier rules
3. **P3** (Medium): Remaining code-style, documentation, design, and best practices rules
4. **P4** (Low): Complex rules requiring thorough testing (e.g., AvoidOneLinerMethods)

**Total Planned:** 46 rules across PMD's 8 standard categories (43 PMD rules + 3 Regex rules):
- **Code Style:** 20 PMD rules (includes naming conventions and code style patterns)
- **Design:** 16 PMD rules (structure, method signatures, class organization)
- **Best Practices:** 5 PMD rules (modifiers, test class rules)
- **Documentation:** 2 PMD rules
- **Regex Rules:** 3 rules (NoConsecutiveBlankLines, ProhibitSuppressWarnings, NoLongLines) - defined in code-analyzer.yml

## GitHub Actions CI/CD

### Workflow Configuration (`.github/workflows/ci.yml`)

The CI workflow will run on every pull request and ensure:
1. **Code Formatting Check**: Verifies all XML rulesets are formatted with Prettier
2. **Linting**: Checks JavaScript/TypeScript files with ESLint
3. **Unit Tests**: Runs all test suites and ensures they pass

```yaml
name: CI

on:
  pull_request:
    branches: [main]

# Cancel in-progress runs for the same workflow and branch
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read
      pull-requests: read
    env:
      PMD_VERSION: "7.19.0"
    steps:
      - uses: actions/checkout@v6
      
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
          version: "10.26.2"
      
      - name: Cache pnpm store
        uses: actions/cache@v5
        with:
          path: ~/.local/share/pnpm/store
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Check XML formatting
        run: pnpm format:check

      - name: Check XML element order
        run: pnpm check-xml-order

      - name: Validate rulesets
        run: pnpm validate

      - name: Lint JavaScript
        run: pnpm lint
      
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
          set -euo pipefail
          PMD_VERSION="${{ env.PMD_VERSION }}"
          PMD_DIR="$HOME/pmd/pmd-bin-${PMD_VERSION}"
          DOWNLOAD_URL="https://github.com/pmd/pmd/releases/download/pmd_releases%2F${PMD_VERSION}/pmd-dist-${PMD_VERSION}-bin.zip"
          
          echo "Downloading PMD ${PMD_VERSION} from ${DOWNLOAD_URL}"
          mkdir -p ~/pmd
          
          if ! curl -fsSL -o pmd-bin.zip "${DOWNLOAD_URL}"; then
            echo "Error: Failed to download PMD ${PMD_VERSION}"
            exit 1
          fi
          
          if [ ! -f pmd-bin.zip ]; then
            echo "Error: Download file not found"
            exit 1
          fi
          
          echo "Extracting PMD..."
          unzip -q pmd-bin.zip
          
          if [ ! -d "pmd-bin-${PMD_VERSION}" ]; then
            echo "Error: PMD extraction failed - directory not found"
            exit 1
          fi
          
          mv "pmd-bin-${PMD_VERSION}" ~/pmd
          rm -f pmd-bin.zip
          echo "PMD ${PMD_VERSION} installed successfully"
      
      - name: Setup PMD CLI
        run: |
          set -euo pipefail
          PMD_VERSION="${{ env.PMD_VERSION }}"
          PMD_DIR="$HOME/pmd/pmd-bin-${PMD_VERSION}"
          PMD_BIN="${PMD_DIR}/bin/pmd"
          
          if [ ! -d "${PMD_DIR}" ]; then
            echo "Error: PMD directory not found at ${PMD_DIR}"
            echo "Contents of ~/pmd:"
            ls -la "$HOME/pmd/" || echo "PMD cache directory does not exist"
            exit 1
          fi
          
          if [ ! -f "${PMD_BIN}" ]; then
            echo "Error: PMD binary not found at ${PMD_BIN}"
            echo "Contents of ${PMD_DIR}/bin:"
            ls -la "${PMD_DIR}/bin/" || echo "PMD bin directory does not exist"
            exit 1
          fi
          
          echo "${PMD_DIR}/bin" >> $GITHUB_PATH
          chmod +x "${PMD_BIN}"
          
          echo "Verifying PMD installation..."
          "${PMD_BIN}" --version
          
          echo "Verifying PMD check command..."
          if ! "${PMD_BIN}" check --help > /dev/null 2>&1; then
            echo "Error: PMD check command failed"
            exit 1
          fi
          
          echo "Verifying PMD with Apex language support..."
          if ! "${PMD_BIN}" check --help | grep -q "apex"; then
            echo "Warning: Apex language may not be available"
          fi
          
          echo "PMD CLI setup complete (version ${PMD_VERSION})"
      
      - name: Run tests with coverage
        run: pnpm test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v5
        if: always()
        with:
          files: ./coverage/lcov.info
          token: ${{ secrets.CODECOV_TOKEN }}
          fail_ci_if_error: false
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

The project will be considered complete when the following criteria are met:

- [ ] All P1 rules have comprehensive tests (positive + negative)
- [ ] Test infrastructure is set up and working
- [ ] pnpm test runs successfully for all tests
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
- [ ] MIT License file is included
- [ ] All rules use XPath only (no custom Java classes)
- [ ] All rules have clear names and comprehensive descriptions
- [ ] All rules are versioned (semantic versioning)
- [ ] All rules are documented in README.md with code examples (violations and valid code)
- [ ] Configurable properties are exposed for applicable rules
- [ ] AI Agent-friendly rule guide (`docs/AI_AGENT_RULE_GUIDE.md`) is created
- [ ] Benchmarking infrastructure is set up and functional
- [ ] Baseline benchmark results are established
- [ ] Benchmark PR comments and performance regression alerts in CI will not be implemented (benchmarking can be run manually)
- [ ] Versioning tooling is implemented (automated version bumping, changelog generation)
- [ ] Rule migration guides are created and documented
- [ ] All 46 rules are implemented with comprehensive test coverage
- [ ] Codecov integration is configured for coverage reporting

## License

This project will be licensed under the **MIT License**. The `LICENSE.md` file will contain the full license text.

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
