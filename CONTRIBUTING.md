# Contributing to sca-extra

Thank you for your interest in contributing to sca-extra! This document provides guidelines and instructions for contributing to the project.

## Welcome

We appreciate your interest in improving sca-extra. Your contributions help make this project better for everyone. Please take a moment to review this guide before submitting contributions.

## Development Setup

### Prerequisites

- **Node.js:** Version 18 or higher
- **npm:** Version 8 or higher (or yarn)
- **PMD:** For testing rules (Salesforce Code Analyzer)
- **Git:** For version control

### Installation

1. **Fork the repository**
   ```bash
   git clone https://github.com/starch-uk/sca-extra.git
   cd sca-extra
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up pre-commit hooks**
   ```bash
   npm run prepare
   ```

### Running Tests Locally

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Running Benchmarks

```bash
npm run benchmark     # Run performance benchmarks
npm run check-regressions  # Check for performance regressions
```

## Adding New Rules

### Step-by-Step Guide

1. **Choose the appropriate category**
   - `code-style/` - Code style and formatting rules
   - `documentation/` - Documentation quality rules
   - `method-signatures/` - Method signature rules
   - `modifiers/` - Modifier and access control rules
   - `naming/` - Naming convention rules
   - `structure/` - Code structure and organization rules

2. **Create the rule XML file**
   - File name should match the rule name (PascalCase)
   - Example: `rulesets/structure/MyNewRule.xml`

3. **Follow the rule template**
   ```xml
   <?xml version="1.0" ?>
   <ruleset
       name="Category Name"
       xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd"
   >
       <description>Category description</description>

       <rule
           name="RuleName"
           language="apex"
           message="User-friendly violation message"
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
                   <value><![CDATA[
                   //XPath expression
                   ]]></value>
               </property>
               <!-- Configurable properties where applicable -->
               <property name="maxLength" description="Maximum allowed length">
                   <value>100</value>
               </property>
           </properties>
       </rule>
   </ruleset>
   ```

4. **Rule Requirements**
   - **XPath Only**: All rules MUST use XPath 3.1 expressions only. No custom Java classes.
   - **Clear Naming**: Use PascalCase and descriptive names (e.g., `NoSingleLetterVariableNames`)
   - **Comprehensive Description**: Include what the rule checks, why it exists, and examples
   - **Versioning**: Include version in description (semantic versioning: major.minor.patch)
   - **Configurable Properties**: Expose properties for thresholds, exceptions, and behavior toggles

5. **Write tests**
   - Create positive test case: `tests/fixtures/positive/{category}/{RuleName}.cls`
   - Create negative test case: `tests/fixtures/negative/{category}/{RuleName}.cls`
   - Write unit test: `tests/unit/{category}.test.js`

6. **Validate the rule**
   ```bash
   npm run validate    # Validate XML syntax and rule quality
   npm test            # Run tests
   ```

7. **Document the rule**
   - Add rule documentation to `README.md` with examples
   - Update `docs/AI_AGENT_RULE_GUIDE.md` with rule details

### Rule Naming Conventions

- Use PascalCase: `NoSingleLetterVariableNames`
- Be descriptive: `InnerClassesCannotBeStatic`
- Use action verbs: `ProhibitSuppressWarnings`, `PreferSafeNavigationOperator`
- Avoid abbreviations unless widely understood

### Property Configuration Guidelines

- Use properties for configurable thresholds or lists
- Provide sensible defaults
- Document each property with a description
- Use appropriate types (string, integer, boolean)
- Consider backward compatibility when adding properties

## Testing Requirements

### All Rules Must Have:

1. **Positive Test Cases** - Code that should NOT trigger the rule
   - Verify rule doesn't produce false positives
   - Test edge cases and exceptions
   - Test with different property configurations

2. **Negative Test Cases** - Code that SHOULD trigger the rule
   - Verify rule detects violations correctly
   - Test at correct line numbers
   - Test multiple violations in same file
   - Test with different property configurations

3. **Unit Tests** - Automated test cases
   - Use test helper functions: `runPMD`, `parseViolations`, `assertViolation`
   - Test both positive and negative cases
   - Test property configurations

### Test Coverage Expectations

- All rules must have positive and negative test cases
- Test coverage should be > 80% for test utilities
- Edge cases should be tested
- Property configurations should be tested

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Check test coverage
```

## Pull Request Process

### Branch Naming

- Use descriptive branch names: `feature/add-new-rule`, `fix/rule-bug`, `docs/update-readme`
- Prefix with type: `feature/`, `fix/`, `docs/`, `refactor/`

### Commit Message Format

Use clear, descriptive commit messages:

```
feat: Add NoMethodCallsInConditionals rule

- Implement XPath expression for detecting method calls in conditionals
- Add positive and negative test cases
- Update README with rule documentation
```

**Commit Types:**
- `feat:` - New feature (rule, functionality)
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test additions or changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

### PR Checklist

Before submitting a pull request, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm test`)
- [ ] Test coverage is maintained or improved
- [ ] XML files are formatted with Prettier (`npm run format:check`)
- [ ] JavaScript files pass ESLint (`npm run lint`)
- [ ] Rule validation passes (`npm run validate`)
- [ ] Documentation is updated (README.md, AI_AGENT_RULE_GUIDE.md)
- [ ] Rule has clear name and comprehensive description
- [ ] Rule uses XPath only (no custom Java classes)
- [ ] Configurable properties are exposed where applicable
- [ ] Rule is versioned (semantic versioning)
- [ ] Positive and negative test cases are included
- [ ] No merge conflicts
- [ ] Pre-commit hooks pass

### Review Process

1. **Automated Checks**
   - GitHub Actions will run:
     - Formatting check (Prettier)
     - Linting (ESLint)
     - Unit tests
     - Benchmarking (if applicable)

2. **Code Review**
   - Maintainers will review your PR
   - Address any feedback or requested changes
   - Ensure all checks pass

3. **Approval and Merge**
   - Once approved, your PR will be merged
   - Thank you for your contribution!

## Code Style

### XML Formatting

- All XML files are automatically formatted with Prettier
- Pre-commit hook ensures formatting before commit
- Run `npm run format` to format manually

### JavaScript/TypeScript Style

- Follow ESLint configuration
- Use consistent indentation (2 spaces)
- Use meaningful variable names
- Add comments for complex logic

### Documentation Requirements

- All rules must be documented in README.md
- Include code examples (violations and valid code)
- Document all configurable properties
- Update AI_AGENT_RULE_GUIDE.md for new rules

## Community-Contributed Rules

We welcome community-contributed rules! All community rules must meet the same requirements as core rules:

- Must use XPath only (no custom Java classes)
- Must have clear names and comprehensive descriptions
- Must be versioned (semantic versioning)
- Must have comprehensive tests (positive and negative)
- Must be documented in README.md
- Must expose configurable properties where applicable

### Proposing New Rules

1. **Create an issue** using the [Rule Request template](.github/ISSUE_TEMPLATE/rule_request.md)
   - Provide motivation and examples
   - Include violation and valid code examples
   - Specify category and priority

2. **Wait for feedback** from maintainers
   - Rule may need refinement
   - May be better suited as a different type of check

3. **Implement the rule** following the guidelines above

4. **Submit a pull request** with tests and documentation

### Attribution

Contributors will be credited in:
- Git commit history
- Release notes
- Project documentation (if applicable)

## Getting Help

- **Issues:** [GitHub Issues](https://github.com/starch-uk/sca-extra/issues)
- **Discussions:** Use GitHub Discussions for questions
- **Documentation:** See [README.md](README.md) and [docs/](docs/) directory

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming and inclusive community.

Thank you for contributing to sca-extra!

