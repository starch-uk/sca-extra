# Contributing to sca-extra

Thank you for your interest in contributing to sca-extra! This document provides guidelines and instructions for contributing to the project.

## Welcome

We appreciate your interest in improving sca-extra. Your contributions help make this project better for everyone. Please take a moment to review this guide before submitting contributions.

## Development Setup

### Prerequisites

- **Node.js:** Version 18 or higher
- **pnpm:** Latest version
- **PMD CLI:** For testing rules (version 7.19.0 or higher)
- **Git:** For version control

### Installation

1. **Fork the repository**
   ```bash
   git clone https://github.com/starch-uk/sca-extra.git
   cd sca-extra
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up pre-commit hooks**
   ```bash
   pnpm run prepare
   ```

### Running Tests Locally

```bash
pnpm test              # Run all tests
pnpm run test:watch    # Run tests in watch mode
pnpm run test:coverage # Run tests with coverage report
```

For Jest API reference when writing tests, see [Jest 30.0 Reference](docs/JEST30.md).

### Running Benchmarks

```bash
pnpm run benchmark     # Run performance benchmarks
pnpm run check-regressions  # Check for performance regressions
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
                   // Use property substitution with default pattern:
                   // if ('${propertyName}' = '${propertyName}') then 'default' else '${propertyName}'
                   ]]></value>
               </property>
               <!-- 
                   NOTE: PMD 7.x doesn't validate custom properties for XPathRule.
                   Do NOT define properties here - use property substitution in XPath instead.
                   See Property Configuration Guidelines below for details.
               -->
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
   pnpm run validate    # Validate XML syntax and rule quality
   pnpm test            # Run tests
   ```

7. **Document the rule**
   - Add rule documentation to `README.md` with examples
   - Update `docs/AI_AGENT_RULE_GUIDE.md` with rule details

### Rule Naming Conventions

- Use PascalCase: `NoSingleLetterVariableNames`
- Be descriptive: `InnerClassesCannotBeStatic`
- Use action verbs: `PreferSafeNavigationOperator`, `AvoidOneLinerMethods`
- Avoid abbreviations unless widely understood

### Property Configuration Guidelines

**Important:** PMD 7.x does not validate custom properties for `XPathRule` when they're not defined. To make properties configurable, use property substitution in XPath with a default pattern.

**Pattern for Configurable Properties:**

1. **Define properties in the XML** - Properties must be defined in the rule XML for PMD to accept overrides via `ref=` syntax in override rulesets. Use empty default values.
2. **Use property substitution in XPath** with a default value pattern:
   ```xpath
   if ('${propertyName}' = '${propertyName}') then 'defaultValue' else '${propertyName}'
   ```

3. **How it works:**
   - When property is not defined: `${propertyName}` stays as literal string
   - The check `'${propertyName}' = '${propertyName}'` evaluates to `true`
   - Default value is used
   - When property is defined (manually added to XML): Substitution occurs, custom value is used

**Example:**

```xml
<property name="xpath">
    <value><![CDATA[
    //SomeNode[
        count(*) >= number(
            if ('${minItems}' = '${minItems}') 
            then '2' 
            else '${minItems}'
        )
    ]
    ]]></value>
</property>
```

**To configure the property:**

1. **For end users:** Create a custom ruleset XML file that references the original rule and overrides properties using `ref=` syntax (see README.md for examples).

2. **For testing:** Create override ruleset files in `tests/rulesets/` with the naming pattern `RuleName_DetailsOfPropertyChanges.xml`. These files use `ref=` to reference the original rule and override properties. Example:

   ```xml
   <?xml version="1.0"?>
   <ruleset name="Test Ruleset Override" ...>
       <rule ref="rulesets/code-style/ListInitializationMustBeMultiLine.xml/ListInitializationMustBeMultiLine">
           <properties>
               <property name="minItems">
                   <value>3</value>
               </property>
           </properties>
       </rule>
   </ruleset>
   ```

   Then use `runPMD('tests/rulesets/ListInitializationMustBeMultiLine_MinItems3.xml', 'tests/fixtures/...')` in your tests.

**Guidelines:**
- Use properties for configurable thresholds or lists
- Provide sensible defaults in the XPath expression
- Document each property in the rule description
- Consider backward compatibility when changing defaults

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
   - Use test helper functions: `runPMD`, `parseViolations`, `assertViolation`, `assertNoViolations`
   - Test both positive and negative cases
   - Test property configurations using pre-created override ruleset files in `tests/rulesets/`
   - For property override tests, create override ruleset files with naming pattern `RuleName_DetailsOfPropertyChanges.xml` and use `runPMD()` directly with the override file path
   - See [Jest 30.0 Reference](docs/JEST30.md) for Jest API usage

### Test Coverage Expectations

- All rules must have positive and negative test cases
- Test coverage should be > 80% for test utilities
- Edge cases should be tested
- Property configurations should be tested

### Running Tests

```bash
pnpm test              # Run all tests
pnpm run test:watch    # Run tests in watch mode
pnpm run test:coverage # Check test coverage
```

For Jest API reference, see [Jest 30.0 Reference](docs/JEST30.md).

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
- [ ] All tests pass (`pnpm test`)
- [ ] Test coverage is maintained or improved
- [ ] XML files are formatted with Prettier (`pnpm run format:check`)
- [ ] JavaScript files pass ESLint (`pnpm run lint`)
- [ ] Rule validation passes (`pnpm run validate`)
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
- Run `pnpm run format` to format manually

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

