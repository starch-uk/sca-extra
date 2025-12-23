# sca-extra

Additional PMD rules for testing Salesforce Apex code using Salesforce Code Analyzer. These rules are implemented as XPath 3.1 expressions that operate on the PMD Apex AST.

**Repository:** [https://github.com/starch-uk/sca-extra](https://github.com/starch-uk/sca-extra)

> **Note:** This entire project has been vibe coded. The original plan for the project can be found in [PLAN.md](PLAN.md).

## Overview

This project provides a comprehensive set of PMD rules for Salesforce Apex code analysis. All rules are implemented using XPath 3.1 expressions only (no custom Java classes), making them easy to understand, modify, and maintain.

## What Makes a Good Rule vs. What Prettier Handles

**Important:** PMD rules should focus on **code quality, logic, and best practices**, not formatting. Formatting concerns should be handled by Prettier or similar formatters.

### Good PMD Rules Focus On:

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

### What Prettier Handles (Not PMD Rules):

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

### When to Create a Rule vs. Use Prettier:

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

### Examples:

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

## Installation

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

## Usage

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

## Rules Documentation

### Structure Rules

#### InnerClassesCannotBeStatic
**Priority:** P1 (Critical)  
**Description:** Inner classes in Apex cannot be static. Remove the static modifier from inner class declarations.

**Violations:**
```apex
public class Outer {
    public static class Inner {  // ❌ Static inner class not allowed
    }
}
```

**Valid Code:**
```apex
public class Outer {
    public class Inner {  // ✅ Non-static inner class
    }
}
```

#### InnerClassesCannotHaveStaticMembers
**Priority:** P1 (Critical)  
**Description:** Inner classes in Apex cannot have static attributes or methods. Remove static modifiers from inner class members.

**Violations:**
```apex
public class Outer {
    public class Inner {
        public static Integer value;  // ❌ Static field not allowed
        public static void method() { }  // ❌ Static method not allowed
    }
}
```

**Valid Code:**
```apex
public class Outer {
    public class Inner {
        public Integer value;  // ✅ Non-static field
        public void method() { }  // ✅ Non-static method
    }
}
```

### Naming Rules

#### NoSingleLetterVariableNames
**Priority:** P2 (High)  
**Description:** Single-letter variable names are not allowed except for loop counters (i, c) or exception variables (e).

**Violations:**
```apex
Integer x = 5;  // ❌ Single-letter variable name
String s = 'test';  // ❌ Single-letter variable name
```

**Valid Code:**
```apex
Integer index = 5;  // ✅ Descriptive name
for (Integer i = 0; i < 10; i++) { }  // ✅ Loop counter allowed
catch (Exception e) { }  // ✅ Exception variable allowed
```

#### NoAbbreviations
**Priority:** P2 (High)  
**Description:** Variable names must not use abbreviations. Use complete, descriptive words so that code is clear and self-explanatory.

**Violations:**
```apex
Integer acc = 5;      // ❌ Uses abbreviation instead of full word
String cfg = 'test';  // ❌ Uses abbreviation instead of full word
Boolean isMgr = true; // ❌ Uses abbreviation instead of full word
```

**Valid Code:**
```apex
Integer accountCount = 5;    // ✅ Descriptive and explicit
String configuration = 'x';  // ✅ Uses full word
Boolean isManager = true;    // ✅ Descriptive and readable
```

**Configurable Properties:**
- `disallowedAbbreviations` (string): Comma-separated list of **exact variable names** to flag as abbreviations (e.g., `"ctx,idx,msg,cfg"`).  
- `allowedSuffixes` (string): **Regex-style list of suffixes** (joined with `|`) that are treated as complete words when they appear at the end of a variable name (e.g., `"Id|Api|Url|Html|Dto"`).

These properties are defined in `rulesets/naming/NoAbbreviations.xml` and can be customized in `code-analyzer.yml` under the `NoAbbreviations` rule.

### Code Style Rules

#### NoMethodCallsInConditionals
**Priority:** P2 (High)  
**Description:** Method calls should not be used in conditional expressions to prevent side effects and make code more predictable.

**Violations:**
```apex
if (getValue() > 0) {  // ❌ Method call in conditional
    // ...
}
```

**Valid Code:**
```apex
Integer value = getValue();  // ✅ Extract to variable
if (value > 0) {
    // ...
}
```

### Modifier Rules

#### FinalVariablesMustBeFinal
**Priority:** P2 (High)  
**Description:** Variables declared as final must actually be final (immutable).

**Violations:**
```apex
final Integer value = 5;
value = 10;  // ❌ Cannot reassign final variable
```

**Valid Code:**
```apex
final Integer value = 5;  // ✅ Final variable not reassigned
```

#### StaticMethodsMustBeStatic
**Priority:** P2 (High)  
**Description:** Methods that don't use instance state should be declared as static.

**Violations:**
```apex
public class Utils {
    public Integer add(Integer a, Integer b) {  // ❌ Should be static
        return a + b;
    }
}
```

**Valid Code:**
```apex
public class Utils {
    public static Integer add(Integer a, Integer b) {  // ✅ Static method
        return a + b;
    }
}
```

## Rule Categories

Rules are organized into the following categories:

- **code-style/** - Code style and formatting rules
- **documentation/** - Documentation quality rules
- **method-signatures/** - Method signature rules
- **modifiers/** - Modifier and access control rules
- **naming/** - Naming convention rules
- **structure/** - Code structure and organization rules

For a complete list of all rules, see the `rulesets/` directory. Each rule XML file contains detailed descriptions and XPath expressions.

## Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
pnpm install
```

### Running Tests

```bash
pnpm test              # Run all tests
pnpm run test:watch    # Run tests in watch mode
pnpm run test:coverage # Run tests with coverage
```

### Formatting

```bash
pnpm run format        # Format all files
pnpm run format:check  # Check formatting without modifying
```

### Linting

```bash
pnpm run lint          # Lint JavaScript files
pnpm run lint:fix      # Fix linting issues automatically
```

### Validation

```bash
pnpm run validate      # Validate all rulesets
```

### Benchmarking

```bash
pnpm run benchmark     # Run performance benchmarks
pnpm run check-regressions  # Check for performance regressions
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Development setup
- Adding new rules
- Testing requirements
- Pull request process
- Code style guidelines

## Security

For security vulnerabilities, please see [SECURITY.md](SECURITY.md) for reporting instructions.

## Documentation

- [XPath 3.1 Reference](docs/XPATH31.md) - XPath 3.1 syntax and functions
- [PMD Apex AST Reference](docs/APEX_PMD_AST.md) - PMD Apex AST node types and patterns
- [AI Agent Rule Guide](docs/AI_AGENT_RULE_GUIDE.md) - Machine-readable rule configuration guide for AI coding assistants
- [Migration Guides](docs/MIGRATION_GUIDES.md) - Rule migration and versioning information

## AI Agent Configuration

The [AI Agent Rule Guide](docs/AI_AGENT_RULE_GUIDE.md) provides a machine-readable reference for AI coding assistants (like Cursor's Agent) to help developers configure PMD rules. This guide contains structured information about each rule including violations, valid code examples, and configuration properties.

### Required Documentation Files

When setting up AI agent rules, you should reference these three documentation files:

- **[AI Agent Rule Guide](docs/AI_AGENT_RULE_GUIDE.md)** - Rule configuration reference with examples
- **[XPath 3.1 Reference](docs/XPATH31.md)** - XPath 3.1 syntax and functions for writing rule queries
- **[PMD Apex AST Reference](docs/APEX_PMD_AST.md)** - PMD Apex AST node types and patterns

### Setting Up in Cursor

To configure Cursor's Agent to use this guide, create a Cursor Project Rule:

1. **Create a Project Rule:**
   - Open Cursor Settings → Rules, Commands
   - Click `+ Add Rule` next to `Project Rules`
   - Or use the `New Cursor Rule` command
   - This creates a new rule folder in `.cursor/rules`

2. **Rule Structure:**
   Create a folder like `.cursor/rules/salesforce-pmd-guide/` containing `RULE.md`:

   ```markdown
   ---
   description: "Guide for configuring PMD rules for Salesforce Apex code analysis. Reference docs/AI_AGENT_RULE_GUIDE.md when helping with code-analyzer.yml configuration or creating new rules."
   alwaysApply: false
   ---

   When helping with Salesforce Code Analyzer configuration or creating PMD rules:
   - Reference @docs/AI_AGENT_RULE_GUIDE.md for rule information and examples
   - Reference @docs/XPATH31.md for XPath 3.1 syntax when writing rule queries
   - Reference @docs/APEX_PMD_AST.md for PMD Apex AST node types and patterns
   - Use the structured format to provide accurate rule information
   - Include code examples from the guides
   - When configuring code-analyzer.yml, use property examples from the guide
   - Suggest appropriate property values based on the rule's purpose
   - Provide complete YAML examples when needed
   ```

3. **Rule Types:**
   - **Always Apply**: Apply to every chat session
   - **Apply Intelligently**: When Agent decides it's relevant based on description
   - **Apply to Specific Files**: When file matches a specified pattern (use `globs` in frontmatter)
   - **Apply Manually**: When @-mentioned in chat (e.g., `@salesforce-pmd-guide`)

### Cursor Rules Overview

Cursor supports four types of rules:

- **Project Rules**: Stored in `.cursor/rules`, version-controlled and scoped to your codebase
- **User Rules**: Global to your Cursor environment, used by Agent (Chat)
- **Team Rules**: Team-wide rules managed from the dashboard (Team/Enterprise plans)
- **AGENTS.md**: Agent instructions in markdown format, simple alternative to `.cursor/rules`

### Best Practices

- Keep rules focused and under 500 lines
- Split large rules into multiple, composable rules
- Provide concrete examples or reference files using `@filename`
- Write rules like clear internal documentation
- Use `@filename` syntax to include relevant files in rule context

For more information about Cursor rules, see the [Cursor Rules Documentation](https://cursor.com/docs/context/rules).

## License

This project is licensed under the **MIT License**. See the [LICENSE.md](LICENSE.md) file for details.

## Support

- **Issues:** [GitHub Issues](https://github.com/starch-uk/sca-extra/issues)
- **Repository:** [https://github.com/starch-uk/sca-extra](https://github.com/starch-uk/sca-extra)

