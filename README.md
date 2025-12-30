# sca-extra

Additional PMD and Regex rules for testing Salesforce Apex code using Salesforce
Code Analyzer. Most rules are implemented as XPath 3.1 expressions that operate
on the PMD Apex AST. Some rules use the Regex engine for pattern-based matching.

**Repository:**
[https://github.com/starch-uk/sca-extra](https://github.com/starch-uk/sca-extra)

> **Note:** This entire project has been vibe coded. The plan for the project
> can be found in [PLAN.md](PLAN.md).

## Overview

This project provides a comprehensive set of PMD and Regex rules for Salesforce
Apex code analysis. Most rules are implemented using XPath 3.1 expressions only
(no custom Java classes), making them easy to understand, modify, and maintain.
Some rules use the Regex engine for pattern-based matching (e.g.,
`NoConsecutiveBlankLines`, `ProhibitPrettierIgnore`, `ProhibitSuppressWarnings`,
`NoLongLines`).

## Configuring code-analyzer.yml

The `code-analyzer.yml` file is where you configure which rules to enable,
customize rule properties, and disable default rules. This section explains how
to customize your configuration.

**Where the rulesets live:**

- Most rules are defined as XML rulesets under the `rulesets/` directory,
  grouped by category (see **Rule Categories** below for an overview).
- Some rules (like `NoConsecutiveBlankLines`, `ProhibitPrettierIgnore`,
  `ProhibitSuppressWarnings`, and `NoLongLines`) are defined as Regex rules in
  the repository's `code-analyzer.yml` under `engines.regex.custom_rules`.
- You can copy the entire `rulesets/` folder into your Salesforce project, or
  just the specific category folders you want to enable.

**Add the rulesets to `code-analyzer.yml`:**

- Create or update a `code-analyzer.yml` file in the root of your Salesforce
  project.
- Reference the ruleset XML files you want to enable under
  `engines.pmd.custom_rulesets`, using paths relative to your project root (for
  full examples, see **Installation** and **Usage** below).
- **Important:** Do NOT copy the repository's `code-analyzer.yml` file in its
  entirety, as it has `rulesets: []` (disabled). Instead, copy only the Regex
  rules configuration from the `engines.regex.custom_rules` section into your
  own `code-analyzer.yml` (see **Regex Rules** section below).

### Basic Structure

The `code-analyzer.yml` file uses YAML syntax and typically includes:

```yaml
engines:
    pmd:
        custom_rulesets:
            # List of ruleset files to include
            - rulesets/design/InnerClassesCannotBeStatic.xml

rules:
    # Rule-specific configuration (severity and tags only)
    # Note: Property overrides are NOT supported via code-analyzer.yml
    # Use custom ruleset XML files with ref= syntax instead (see "Overriding Rule Properties" below)
    RuleName:
        severity: 'High'
        tags: ['Recommended']
```

### Adding Custom Rules

To add rules from this repository, reference the ruleset XML files under
`engines.pmd.custom_rulesets` using paths relative to your project root:

```yaml
engines:
    pmd:
        custom_rulesets:
            # Design rules
            - rulesets/design/InnerClassesCannotBeStatic.xml
            - rulesets/design/InnerClassesCannotHaveStaticMembers.xml

            # Best practices rules
            - rulesets/best-practices/FinalVariablesMustBeFinal.xml
            - rulesets/best-practices/StaticMethodsMustBeStatic.xml

            # Code style rules (including naming)
            - rulesets/code-style/NoSingleLetterVariableNames.xml
            - rulesets/code-style/NoAbbreviations.xml

            # More code style rules
            - rulesets/code-style/NoMethodCallsInConditionals.xml
            - rulesets/code-style/PreferSafeNavigationOperator.xml
```

**Important:**

- Copy the `rulesets/` directory (or specific category folders) to your
  Salesforce project root first
- Paths in `code-analyzer.yml` are relative to your project root
- You can include as many or as few rules as needed
- Use `engines.pmd.custom_rulesets` (not `rulesets:`) to reference PMD rulesets

### Customizing Rules

**Important:** PMD 7+ does not support dynamic properties for XPath rules via
`code-analyzer.yml`. However, rules are designed with configurable variables at
the top of their XPath expressions, making customization straightforward.

**How to Customize a Rule:**

1. **Locate the rule file** in the `rulesets/` directory (e.g.,
   `rulesets/design/EnumMinimumValues.xml`)

2. **Edit the configurable variables** at the top of the XPath expression
   (usually in a `let` statement). You don't need to edit the entire XPath -
   just change the variable values.

3. **Update the rule description** to reflect your changes (optional but
   recommended)

**Example 1 - Change EnumMinimumValues threshold from 3 to 4:**

Open `rulesets/design/EnumMinimumValues.xml` and find the variable at the top of
the XPath expression:

```xml
<property name="xpath">
    <value>
        <![CDATA[
        let $minValues := 3  <!-- Change this value -->
        return //UserEnum[
            count(Field) < $minValues
        ]
        ]]>
    </value>
</property>
```

Change `3` to `4`:

```xml
<property name="xpath">
    <value>
        <![CDATA[
        let $minValues := 4  <!-- Changed from 3 to 4 -->
        return //UserEnum[
            count(Field) < $minValues
        ]
        ]]>
    </value>
</property>
```

**Example 2 - Customize NoAbbreviations to change which abbreviations are
flagged:**

Open `rulesets/code-style/NoAbbreviations.xml` and find the variables at the
top:

```xml
<property name="xpath">
    <value><![CDATA[
        let $disallowedAbbreviations := 'acc,addr,attr,calc,cfg,col,con,ctx,curr,desc,dest,doc,dst,elem,fmt,hdr,idx,impl,init,lbl,len,mgr,msg,opp,opt,org,param,pos,prev,ref,repo,req,res,resp,spec,src,svc,util,val',
            $allowedSuffixes := 'Api,Html,Id,Url',
            $allowedPrefixes := 'test'
        return //VariableDeclaration[
            <!-- ... rest of XPath expression ... -->
        ]
    ]]></value>
</property>
```

To only flag `ctx` and `idx`, change the `$disallowedAbbreviations` variable:

```xml
<property name="xpath">
    <value><![CDATA[
        let $disallowedAbbreviations := 'ctx,idx',  <!-- Changed to only flag ctx and idx -->
            $allowedSuffixes := 'Api,Html,Id,Url',
            $allowedPrefixes := 'test'
        return //VariableDeclaration[
            <!-- ... rest of XPath expression stays the same ... -->
        ]
    ]]></value>
</property>
```

**Best Practices:**

- **Look for variables at the top** - Most rules have configurable variables in
  `let` statements at the beginning of the XPath expression
- **Only change variable values** - You typically don't need to modify the rest
  of the XPath expression
- **Keep a backup** of the original rule file before making changes
- **Document your changes** in comments or commit messages
- **Test your changes** by running `sf code-analyzer run` on your codebase
- **Consider version control** - if you customize rules, you may want to
  maintain your own fork or keep custom rules in a separate directory
- **Update rule descriptions** to reflect your customizations (optional)

**Note:** If you need different behavior for different parts of your codebase,
you can:

1. Create multiple copies of the rule with different names (e.g.,
   `EnumMinimumValues4.xml`, `EnumMinimumValues5.xml`)
2. Reference both in your `code-analyzer.yml`
3. Use PMD's exclusion patterns if needed

**Rule Examples:** All rules include `<example>` sections in their XML files
showing violations and valid code patterns. These examples help clarify the
rule's intent. Rules with configurable thresholds use easy-to-edit variables at
the top of the XPath expression, making customization straightforward - you only
need to change the variable values, not the entire XPath logic.

### Disabling Default Rules

To disable default PMD rules provided by Salesforce Code Analyzer, you can
exclude them from standard PMD category rulesets. Create a custom ruleset XML
file that references the category but excludes specific rules:

```xml
<?xml version="1.0" ?>
<ruleset name="CustomPMDRules" xmlns="http://pmd.sourceforge.net/ruleset/2.0.0">
    <description>Custom PMD rules with some defaults disabled</description>

    <!-- Include standard security rules, but exclude ApexCRUDViolation -->
    <rule ref="category/apex/security.xml">
        <exclude name="ApexCRUDViolation" />
    </rule>

    <!-- Include best practices, but exclude specific rules -->
    <rule ref="category/apex/bestpractices.xml">
        <exclude name="DebugsShouldUseLoggingLevel" />
        <exclude name="ApexUnitTestClassShouldHaveRunAs" />
    </rule>
</ruleset>
```

Save this as `rulesets/custom-disabled-defaults.xml` and reference it in
`code-analyzer.yml`:

```yaml
engines:
    pmd:
        custom_rulesets:
            - rulesets/custom-disabled-defaults.xml # Custom ruleset with disabled defaults
            - rulesets/design/InnerClassesCannotBeStatic.xml
            - rulesets/code-style/NoSingleLetterVariableNames.xml
```

Alternatively, if you're creating a comprehensive custom ruleset, you can
combine standard PMD rules with exclusions in a single XML file. Note that
custom rulesets from this repository are typically referenced separately in
`code-analyzer.yml` (as shown in the example below):

```xml
<?xml version="1.0" ?>
<ruleset
    name="ComprehensiveRules"
    xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
>
    <description>Standard PMD rules with custom exclusions</description>

    <!-- Standard PMD rules with some disabled -->
    <rule ref="category/apex/security.xml">
        <priority>1</priority>
        <exclude name="ApexCRUDViolation" />
    </rule>

    <rule ref="category/apex/bestpractices.xml">
        <priority>2</priority>
        <exclude name="DebugsShouldUseLoggingLevel" />
    </rule>

    <!-- Standard PMD category rulesets -->
    <rule ref="category/apex/design.xml">
        <priority>2</priority>
    </rule>
</ruleset>
```

Then reference both this comprehensive ruleset and your custom rulesets in
`code-analyzer.yml`:

```yaml
engines:
    pmd:
        custom_rulesets:
            - rulesets/custom-comprehensive-rules.xml # Standard rules with exclusions
            - rulesets/design/InnerClassesCannotBeStatic.xml # Custom rules
            - rulesets/code-style/NoSingleLetterVariableNames.xml
```

**Standard PMD category rulesets available:**

- `category/apex/security.xml` - Security-related rules
- `category/apex/bestpractices.xml` - Best practice rules
- `category/apex/design.xml` - Design pattern rules
- `category/apex/performance.xml` - Performance rules
- `category/apex/codestyle.xml` - Code style rules
- `category/apex/errorprone.xml` - Error-prone patterns

### Regex Rules

Some rules are implemented using the Regex engine for pattern-based matching.
These rules are defined in the repository's `code-analyzer.yml` under
`engines.regex.custom_rules`.

**To use Regex rules in your project:**

Copy the `engines.regex.custom_rules` section from the repository's
`code-analyzer.yml` into your own `code-analyzer.yml` file. Do NOT copy the
entire `code-analyzer.yml` file, as the repository version has `rulesets: []`
(disabled) and is only meant as a reference for Regex rules.

**Example - Add to your `code-analyzer.yml`:**

```yaml
engines:
    pmd:
        custom_rulesets:
            - rulesets/design/InnerClassesCannotBeStatic.xml
            # ... other rulesets ...
    regex:
        custom_rules:
            NoConsecutiveBlankLines:
                regex: /\n\s*\n\s*\n/g
                file_extensions: ['.apex', '.cls', '.trigger']
                description:
                    'Prevents two or more consecutive blank lines in Apex code.
                    Code should have at most one blank line between statements,
                    methods, or other code elements.'
                violation_message:
                    'Two or more consecutive blank lines are not allowed. Use at
                    most one blank line between statements.'
                severity: 'Moderate'
                tags: ['CodeStyle', 'Recommended']
            ProhibitSuppressWarnings:
                regex: /@SuppressWarnings\([^)]*\)|\/\/\s*NOPMD/gi
                file_extensions: ['.apex', '.cls', '.trigger']
                description:
                    'Prohibits the use of @SuppressWarnings annotations and
                    NOPMD comments in Apex code. Suppressions hide code quality
                    issues; prefer fixing the underlying problems or improving
                    rules instead.'
                violation_message:
                    'Suppression of warnings is not allowed. Fix the underlying
                    issue or improve the rule instead of suppressing violations.'
                severity: 'High'
                tags: ['CodeStyle', 'Recommended']
            NoLongLines:
                regex: /.{81,}/gm
                file_extensions: ['.apex', '.cls', '.trigger']
                description:
                    'Enforces a maximum line length of 80 characters. Lines
                    longer than 80 characters reduce readability and make code
                    harder to review. Use shorter class, attribute, method, and
                    variable names to improve readability.'
                violation_message:
                    'Line exceeds 80 characters. Use shorter class, attribute,
                    method, and variable names to improve readability.'
                severity: 'Moderate'
                tags: ['CodeStyle', 'Recommended']
            ProhibitPrettierIgnore:
                regex: /\/\/\s*prettier-ignore/gi
                file_extensions: ['.apex', '.cls', '.trigger']
                description:
                    'Prohibits the use of prettier-ignore comments in Apex code.
                    Code should be formatted consistently without exceptions.
                    Using prettier-ignore comments undermines code formatting
                    standards and makes the codebase less maintainable.'
                violation_message:
                    'Prettier-ignore comments are not allowed. Code should be
                    formatted consistently without exceptions.'
                severity: 'Moderate'
                tags: ['CodeStyle', 'Recommended']
```

Regex rules are useful for:

- Pattern-based text matching (e.g., consecutive blank lines)
- Finding patterns in comments (PMD ignores comments)
- Simple string/pattern detection

For more information on creating Regex rules, see the
[Regex Engine Reference](docs/REGEX.md).

### Complete Example

Here's a complete `code-analyzer.yml` example combining custom rules and
standard PMD rules:

```yaml
engines:
    pmd:
        custom_rulesets:
            # Custom rules from sca-extra repository
            - rulesets/design/InnerClassesCannotBeStatic.xml
            - rulesets/design/InnerClassesCannotHaveStaticMembers.xml
            - rulesets/best-practices/FinalVariablesMustBeFinal.xml
            - rulesets/code-style/NoSingleLetterVariableNames.xml
            - rulesets/code-style/NoAbbreviations.xml
            - rulesets/code-style/NoMethodCallsInConditionals.xml

rules:
    # Override severity and tags
    NoSingleLetterVariableNames:
        severity: 'High'
        tags: ['Recommended', 'Naming']
```

**For more examples:** See the
[unhappy-soup ruleset](https://github.com/rsoesemann/unhappy-soup/blob/master/ruleset.xml)
for a comprehensive example of combining standard PMD rules with custom rules
and configuration.

**To customize rule behavior:** See the [Customizing Rules](#customizing-rules)
section above for instructions on customizing rules by editing configurable
variables at the top of XPath expressions.

## Quick Start

1. **Copy rulesets to your project**
    - Copy the `rulesets/` directory (or specific category folders) to your
      Salesforce project root
    - Rules are organized by category (see [Rule Categories](#rule-categories)
      below)

2. **Configure `code-analyzer.yml`**
    - Create or update `code-analyzer.yml` in your project root
    - Add rulesets and disable default rules as needed
    - See [Configuring code-analyzer.yml](#configuring-code-analyzeryml) for
      detailed instructions

3. **Run the analyzer**
    - Use the command line: `sf code-analyzer run`
    - Or use the VS Code extension for real-time analysis
    - See [Usage](#usage) for details

## What Makes a Good Rule vs. What Prettier Handles

**Important:** PMD rules should focus on **code quality, logic, and best
practices**, not formatting. Formatting concerns should be handled by Prettier
or similar formatters.

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
        - `ValidGroupTagValues` - Ensures @group tags use valid values
        - `ProhibitAuthorSinceVersionTags` - Prohibits @author, @since, and
          @version tags

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
        - ❌ "No consecutive blank lines" (formatting - though this could be a
          code quality rule if it's about readability)
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

**Note:** Some rules may appear to overlap with formatting (e.g.,
`NoConsecutiveBlankLines`), but if they're about code readability and structure
rather than pure formatting, they can be appropriate rules.
`NoConsecutiveBlankLines` is implemented as a Regex rule for efficient pattern
matching. The key distinction is: **Does this affect code quality and
understanding, or just appearance?**

## Installation

1. **Clone or download the repository**

    ```bash
    git clone https://github.com/starch-uk/sca-extra.git
    ```

2. **Copy rulesets to your Salesforce project**
    - Copy the `rulesets/` directory to your Salesforce project root
    - Or copy specific category folders (e.g., `rulesets/design/`) as needed
    - Maintain the directory structure for organization

3. **Reference rulesets in your project**
    - Rulesets can be referenced by relative path from your project root
    - Example: `rulesets/design/InnerClassesCannotBeStatic.xml`

## Usage

### Running Code Analyzer

Once you've configured your `code-analyzer.yml` file (see
[Configuring code-analyzer.yml](#configuring-code-analyzeryml) above), you can
run Salesforce Code Analyzer in two ways:

**1. Command Line:**

```bash
# Install the plugin (once per environment)
sf plugins install code-analyzer

# Run the analyzer from your project root
sf code-analyzer run
```

**2. VS Code Extension:**

- Install the **Salesforce Code Analyzer** extension in VS Code
- Open your Salesforce project with `code-analyzer.yml` and the `rulesets/`
  folder present
- The extension will automatically analyze your code and surface issues in the
  editor

For detailed configuration instructions, including how to add rules, customize
rules, disable default rules, and use Regex rules, see the
[Configuring code-analyzer.yml](#configuring-code-analyzeryml) section above.

## Rules Documentation

### Design Rules

#### InnerClassesCannotBeStatic

**Priority:** P1 (Critical)  
**Description:** Inner classes in Apex cannot be static. Remove the static
modifier from inner class declarations.

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
**Description:** Inner classes in Apex cannot have static attributes or methods.
Remove static modifiers from inner class members.

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

#### NoInterfacesEndingWithCallback

**Priority:** P3 (Medium)  
**Description:** Interfaces should not be named with the suffix 'Callback'.
Callbacks are an anti-pattern that should be avoided in favor of better design
patterns such as event-driven architectures or observer patterns. Callbacks are
often used to hide circular dependencies without fixing them, create tight
coupling, make code harder to test, and reduce maintainability.

**Violations:**

```apex
public interface PaymentCallback {  // ❌ Interface ending with 'Callback'
    void onSuccess();
    void onError(String error);
}
```

**Valid Code:**

```apex
public interface PaymentHandler {  // ✅ Descriptive name without 'Callback'
    void onSuccess();
    void onError(String error);
}

public interface EventListener {  // ✅ Alternative pattern
    void handleEvent(String event);
}
```

### Code Style Rules (Naming)

#### NoSingleLetterVariableNames

**Priority:** P2 (High)  
**Description:** Single-letter variable names are not allowed except for loop
counters (i, c) or exception variables (e).

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
**Description:** Variable, parameter, and field names must not use
abbreviations. Use complete, descriptive words so that code is clear and
self-explanatory.

**Violations:**

```apex
// Variable violations
Integer acc = 5;      // ❌ Uses abbreviation instead of full word
String cfg = 'test';  // ❌ Uses abbreviation instead of full word
Boolean isMgr = true; // ❌ Uses abbreviation instead of full word

// Parameter violations
public void processAccount(Account acc) { }  // ❌ Abbreviation 'acc' in parameter
public void configure(String cfg) { }        // ❌ Abbreviation 'cfg' in parameter
public void setContext(String ctx) { }      // ❌ Abbreviation 'ctx' in parameter

// Field violations
public class Example {
    private Account acc;     // ❌ Abbreviation 'acc' in field
    private String cfg;      // ❌ Abbreviation 'cfg' in field
    private Boolean isMgr;   // ❌ Abbreviation 'mgr' in field
}
```

**Valid Code:**

```apex
// Valid variables
Integer accountCount = 5;    // ✅ Descriptive and explicit
String configuration = 'x';  // ✅ Uses full word
Boolean isManager = true;    // ✅ Descriptive and readable

// Valid parameters
public void processAccount(Account account) { }        // ✅ Full word
public void configure(String configuration) { }       // ✅ Full word
public void setContext(String context) { }              // ✅ Full word
public void processRecord(String accountId) { }         // ✅ 'Id' suffix allowed
public void testMethod(String testCtx) { }                // ✅ 'test' prefix allows abbreviations

// Valid fields
public class Example {
    private Account account;           // ✅ Full word
    private String configuration;      // ✅ Full word
    private Boolean isManager;         // ✅ Full word
    private String accountId;         // ✅ 'Id' suffix allowed
    private String testCtx;            // ✅ 'test' prefix allows abbreviations
}
```

**Note:** To customize this rule (e.g., change which abbreviations are flagged
or which suffixes are allowed), edit the configurable variables at the top of
the XPath expression in `rulesets/code-style/NoAbbreviations.xml`. See the
[Customizing Rules](#customizing-rules) section above for details.

### Code Style Rules

#### NoMethodCallsInConditionals

**Priority:** P2 (High)  
**Description:** Method calls should not be used in conditional expressions to
prevent side effects and make code more predictable.

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
**Description:** Methods that don't use instance state should be declared as
static.

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

Rules are organized into PMD's 8 standard categories (consistent across
languages):

- **best-practices/** - Generally accepted best practices (5 PMD rules: modifier
  rules, test class rules)
- **code-style/** - Coding style enforcement (20 PMD rules: formatting, naming
  conventions, code style patterns)
- **design/** - Design issue detection (16 PMD rules: code structure, method
  signatures, class organization)
- **documentation/** - Code documentation rules (4 PMD rules)
- **error-prone/** - Broken/confusing/runtime-error-prone constructs (currently
  empty)
- **multithreading/** - Multi-threaded execution issues (currently empty)
- **performance/** - Suboptimal code detection (currently empty)
- **security/** - Potential security flaws (currently empty)

**Total: 45 PMD rules + 4 Regex rules = 49 rules**

In addition to the PMD rules above, 4 Regex rules are provided:

- `NoConsecutiveBlankLines` - Prevents consecutive blank lines
- `ProhibitPrettierIgnore` - Prohibits prettier-ignore comments
- `ProhibitSuppressWarnings` - Prohibits suppression annotations and comments
- `NoLongLines` - Enforces maximum line length of 80 characters

For a complete list of all rules, see the `rulesets/` directory. Each rule XML
file contains detailed descriptions and XPath expressions. Regex rules are
defined in `code-analyzer.yml` under `engines.regex.custom_rules`.

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
pnpm test          # Run all tests
pnpm test:watch    # Run tests in watch mode
pnpm test:coverage # Run tests with coverage
```

For Jest API reference, see [Jest 30.0 Reference](docs/JEST30.md).

### Formatting

```bash
pnpm format        # Format all files
pnpm format:check  # Check formatting without modifying
```

### Linting

```bash
pnpm lint      # Lint JavaScript files
pnpm lint:fix  # Fix linting issues automatically
```

### Validation

```bash
pnpm validate        # Validate all rulesets
pnpm check-xml-order # Check XML element order
```

### XML Element Order

PMD ruleset XML files must follow the
[PMD Ruleset XML Schema](https://pmd.sourceforge.io/ruleset_2_0_0.xsd), which
requires elements within `<rule>` to be in a specific order:

1. `<description>` (optional)
2. `<priority>` (optional)
3. `<properties>` (optional)
4. `<exclude>` (optional, can appear multiple times)
5. `<example>` (optional, can appear multiple times)

**Scripts available:**

- `pnpm check-xml-order` - Check if all XML files have correct element order
- `pnpm fix-xml-order` - Automatically fix element order in all XML files
- `pnpm add-version-info` - Add version information to all rule descriptions

These scripts use XML libraries (`@xmldom/xmldom`) to properly parse and
manipulate XML, ensuring all elements (including multiple examples) are
preserved.

### Benchmarking

```bash
pnpm benchmark                    # Run performance benchmarks
pnpm benchmark -- --baseline     # Generate baseline for regression detection
pnpm benchmark -- --json         # JSON output for CI/CD integration
pnpm benchmark -- --compare      # Compare mode (doesn't fail on regressions)
pnpm check-regressions           # Check for performance regressions
```

Results are saved to `benchmarks/results/`:

- `results-{timestamp}.json` - Latest benchmark results
- `baseline.json` - Baseline for regression comparison

### Available Scripts

All scripts in the `scripts/` directory have convenience commands in
`package.json`:

**Development:**

- `pnpm test` - Run all tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage
- `pnpm validate` - Validate all rulesets
- `pnpm format` - Format all files with Prettier
- `pnpm format:check` - Check formatting without modifying
- `pnpm lint` - Lint JavaScript files
- `pnpm lint:fix` - Fix linting issues automatically

**XML Management:**

- `pnpm check-xml-order` - Check XML element order in all ruleset files
- `pnpm fix-xml-order` - Automatically fix XML element order
- `pnpm add-version-info` - Add version information to all rule descriptions

**Testing & Utilities:**

- `pnpm list-test-files` - List all test files to verify Jest discovery
- `pnpm generate-test-ruleset` - Generate test ruleset for validation
- `pnpm ast-dump` - Dump PMD AST for Apex files (usage: `pnpm ast-dump <file>`)

**Performance:**

- `pnpm benchmark` - Run performance benchmarks
- `pnpm check-regressions` - Check for performance regressions

**Project Management:**

- `pnpm version:bump` - Bump package.json version number
- `pnpm bump-rule-versions` - Automatically bump rule versions based on changes:
    - Major bump: Rules with failing existing tests (tests that existed at HEAD)
    - Minor bump: Rules with new tests
    - Patch bump: Other changed rules
- `pnpm changelog` - Generate changelog
- `pnpm clean` - Clean build artifacts and temporary files

**CI/CD:**

- `pnpm ci` - Run all CI checks (format, lint, test)

### Script Security

All scripts in the `scripts/` directory implement security best practices:

#### File System Operations

- **File Descriptors**: Scripts use file descriptors (`fs.openSync`,
  `fs.writeFileSync` with file descriptor) instead of file paths to prevent
  time-of-check to time-of-use (TOCTOU) race conditions
- **No Existence Checks**: Scripts never use `fs.existsSync()` before opening
  files - files are opened directly and errors are handled if they don't exist
- **Atomic Operations**: File operations are atomic with respect to file
  descriptors, preventing race conditions

#### Shell Command Execution

- **execFileSync**: Scripts use `execFileSync` instead of `execSync` when
  passing dynamic paths or arguments to prevent shell command injection
  vulnerabilities
- **Separate Arguments**: Commands and arguments are passed separately (e.g.,
  `execFileSync('git', ['show', path], {...})`)

#### Path Validation (for user input)

Scripts that accept file paths from user input implement additional security
measures:

- **Path Sanitization**: The `sanitize-filename` package is used to sanitize
  file paths, eliminating dangerous characters
- **Path Validation**: Paths are validated to ensure they don't contain path
  traversal sequences (`..`) and are relative paths
- **Symbolic Link Resolution**: `fs.realpathSync()` is used to resolve symbolic
  links and ensure files are within expected directories
- **Defense in Depth**: Multiple validation layers ensure robust security

Scripts implementing these measures:

- `scripts/benchmark.js` - File descriptor usage for read/write operations
- `scripts/bump-rule-versions.js` - File descriptors and `execFileSync` for git
  operations
- `scripts/check-performance-regressions.js` - Path validation for user input
- `scripts/ast-dump.sh` - Path validation for user input

For more details, see [SECURITY.md](SECURITY.md) and
[CONTRIBUTING.md](CONTRIBUTING.md).

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for
guidelines on:

- Development setup
- Adding new rules
- Testing requirements
- Pull request process
- Code style guidelines

Please note that this project follows the
[Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating,
you are expected to uphold this code.

## Security

For security vulnerabilities, please see [SECURITY.md](SECURITY.md) for
reporting instructions.

## Documentation

### Core PMD & Rule Development

- [PMD Quick Reference](docs/PMD.md) - Condensed guide to PMD essentials
  (rulesets, CLI, CPD, configuration)
- [Code Analyzer Configuration](docs/CODE_ANALYZER_CONFIG.md) - Quick reference
  for configuring `code-analyzer.yml` with all engines and properties
- [XPath 3.1 Reference](docs/XPATH31.md) - XPath 3.1 syntax and functions
- [PMD Apex AST Reference](docs/APEX_PMD_AST.md) - PMD Apex AST node types and
  patterns
- [AI Agent Rule Guide](docs/AI_AGENT_RULE_GUIDE.md) - Machine-readable rule
  configuration guide for AI coding assistants
- [Regex Engine Reference](docs/REGEX.md) - Regex engine configuration and
  custom rule creation

### Documentation & Suppression

- [ApexDoc Reference](docs/APEXDOC.md) - ApexDoc syntax, tags, and documentation
  format for Apex code
- [Suppressing Warnings](docs/SUPPRESS_WARNINGS.md) - How to suppress PMD rule
  violations using annotations, comments, and rule properties

### Testing & Development

- [Jest 30.0 Reference](docs/JEST30.md) - Jest 30.0 API reference for writing
  and running tests
- [pnpm Reference](docs/PNPM.md) - pnpm package manager reference for dependency
  management and workspace configuration
- [Husky v9 Reference](docs/HUSKY9.md) - Husky v9 Git hooks manager reference
  for setting up pre-commit and other Git hooks
- [Migration Guides](docs/MIGRATION_GUIDES.md) - Rule migration and versioning
  information

### Usage Guides

- [Salesforce CLI Commands](docs/SFCLI.md) - Using Code Analyzer via Salesforce
  CLI
- [VS Code Extension](docs/VSCODE.md) - Using Code Analyzer in Visual Studio
  Code
- [CI/CD Integration](docs/CICD.md) - Integrating Code Analyzer into CI/CD
  pipelines
- [MCP Tools](docs/MCP.md) - Using Model Context Protocol tools with Code
  Analyzer

### Additional Code Analyzer Engines

- [CPD Engine Reference](docs/CPD.md) - Copy/Paste Detector engine for duplicate
  code detection across multiple languages
- [ESLint Reference](docs/ESLINT.md) - ESLint engine configuration for
  JavaScript, TypeScript, and LWC static analysis
- [Flow Scanner Reference](docs/FLOWSCANNER.md) - Flow Scanner engine for
  auditing Salesforce Flows for security vulnerabilities
- [RetireJS Reference](docs/RETIREJS.md) - RetireJS engine for detecting
  security vulnerabilities in JavaScript dependencies

### Graph Engine Documentation

- [Graph Engine Reference](docs/GRAPHENGINE.md) - Salesforce Graph Engine
  configuration and usage
- [Gremlin Query Language Reference](docs/GREMLIN.md) - Gremlin query language
  reference for graph traversal
- [Apache TinkerPop Reference](docs/TINKERPOP.md) - Apache TinkerPop framework
  reference for graph computing
- [GraphML Reference](docs/GRAPHML.md) - GraphML format for graph serialization
- [GraphSON Reference](docs/GRAPHSON.md) - GraphSON format for graph
  serialization
- [Gryo Reference](docs/GRYO.md) - Gryo binary format for graph serialization
- [GraphBinary Reference](docs/GRAPHBINARY.md) - GraphBinary format for graph
  serialization

## AI Agent Configuration

The [AI Agent Rule Guide](docs/AI_AGENT_RULE_GUIDE.md) provides a
machine-readable reference for AI coding assistants (like Cursor's Agent) to
help developers configure PMD rules. This guide contains structured information
about each rule including violations, valid code examples, and configuration
properties.

### Required Documentation Files

When setting up AI agent rules, you should reference these documentation files:

**Core PMD & Rule Development:**

- **[PMD Quick Reference](docs/PMD.md)** - PMD essentials (rulesets, CLI, CPD,
  configuration)
- **[Code Analyzer Configuration](docs/CODE_ANALYZER_CONFIG.md)** - Complete
  `code-analyzer.yml` configuration reference
- **[AI Agent Rule Guide](docs/AI_AGENT_RULE_GUIDE.md)** - Rule configuration
  reference with examples
- **[XPath 3.1 Reference](docs/XPATH31.md)** - XPath 3.1 syntax and functions
  for writing rule queries
- **[PMD Apex AST Reference](docs/APEX_PMD_AST.md)** - PMD Apex AST node types
  and patterns
- **[Regex Engine Reference](docs/REGEX.md)** - Regex engine configuration and
  custom rule creation

**Documentation & Suppression:**

- **[ApexDoc Reference](docs/APEXDOC.md)** - ApexDoc syntax, tags, and
  documentation format for Apex code
- **[Suppressing Warnings](docs/SUPPRESS_WARNINGS.md)** - How to suppress PMD
  rule violations using annotations, comments, and rule properties

**Testing & Development:**

- **[Jest 30.0 Reference](docs/JEST30.md)** - Jest 30.0 API reference for
  writing and running tests
- **[pnpm Reference](docs/PNPM.md)** - pnpm package manager reference for
  dependency management and workspace configuration
- **[Husky v9 Reference](docs/HUSKY9.md)** - Husky v9 Git hooks manager
  reference for setting up pre-commit and other Git hooks
- **[Migration Guides](docs/MIGRATION_GUIDES.md)** - Rule migration and
  versioning information

**Usage Guides:**

- **[Salesforce CLI Commands](docs/SFCLI.md)** - Using Code Analyzer via
  Salesforce CLI
- **[VS Code Extension](docs/VSCODE.md)** - Using Code Analyzer in Visual Studio
  Code
- **[CI/CD Integration](docs/CICD.md)** - Integrating Code Analyzer into CI/CD
  pipelines
- **[MCP Tools](docs/MCP.md)** - Using Model Context Protocol tools with Code
  Analyzer

**Additional Engines:**

- **[CPD Engine Reference](docs/CPD.md)** - Copy/Paste Detector engine for
  duplicate code detection
- **[ESLint Reference](docs/ESLINT.md)** - ESLint engine configuration for
  JavaScript, TypeScript, and LWC
- **[Flow Scanner Reference](docs/FLOWSCANNER.md)** - Flow Scanner engine for
  auditing Salesforce Flows
- **[RetireJS Reference](docs/RETIREJS.md)** - RetireJS engine for detecting
  security vulnerabilities in JavaScript dependencies

**Usage Guides:**

- **[Salesforce CLI Commands](docs/SFCLI.md)** - Using Code Analyzer via
  Salesforce CLI
- **[VS Code Extension](docs/VSCODE.md)** - Using Code Analyzer in Visual Studio
  Code
- **[CI/CD Integration](docs/CICD.md)** - Integrating Code Analyzer into CI/CD
  pipelines
- **[MCP Tools](docs/MCP.md)** - Using Model Context Protocol tools with Code
  Analyzer

**Graph Engine Documentation:**

- **[Graph Engine Reference](docs/GRAPHENGINE.md)** - Salesforce Graph Engine
  configuration and usage
- **[Gremlin Query Language Reference](docs/GREMLIN.md)** - Gremlin query
  language reference for graph traversal
- **[Apache TinkerPop Reference](docs/TINKERPOP.md)** - Apache TinkerPop
  framework reference
- **[GraphML Reference](docs/GRAPHML.md)** - GraphML format for graph
  serialization
- **[GraphSON Reference](docs/GRAPHSON.md)** - GraphSON format for graph
  serialization
- **[Gryo Reference](docs/GRYO.md)** - Gryo binary format for graph
  serialization
- **[GraphBinary Reference](docs/GRAPHBINARY.md)** - GraphBinary format for
  graph serialization

### Setting Up in Cursor

To configure Cursor's Agent to use this guide, create a Cursor Project Rule:

1. **Create a Project Rule:**
    - Open Cursor Settings → Rules, Commands
    - Click `+ Add Rule` next to `Project Rules`
    - Or use the `New Cursor Rule` command
    - This creates a new rule folder in `.cursor/rules`

2. **Rule Structure:** Create a folder like
   `.cursor/rules/salesforce-pmd-guide/` containing `RULE.md`:

    ```markdown
    ---
    description:
        'Guide for configuring PMD rules for Salesforce Apex code analysis.
        Reference docs/AI_AGENT_RULE_GUIDE.md when helping with
        code-analyzer.yml configuration or creating new rules.'
    alwaysApply: false
    ---

    When helping with Salesforce Code Analyzer configuration or creating PMD
    rules:

    - Reference @docs/CODE_ANALYZER_CONFIG.md for `code-analyzer.yml`
      configuration and engine settings
    - Reference @docs/AI_AGENT_RULE_GUIDE.md for rule information and examples
    - Reference @docs/XPATH31.md for XPath 3.1 syntax when writing rule queries
    - Reference @docs/APEX_PMD_AST.md for PMD Apex AST node types and patterns
    - Reference @docs/SUPPRESS_WARNINGS.md for suppressing rule violations when
      necessary
    - Use the structured format to provide accurate rule information
    - Include code examples from the guides
    - When configuring code-analyzer.yml, use property examples from the guides
    - Suggest appropriate property values based on the rule's purpose
    - Provide complete YAML examples when needed
    ```

3. **Rule Types:**
    - **Always Apply**: Apply to every chat session
    - **Apply Intelligently**: When Agent decides it's relevant based on
      description
    - **Apply to Specific Files**: When file matches a specified pattern (use
      `globs` in frontmatter)
    - **Apply Manually**: When @-mentioned in chat (e.g.,
      `@salesforce-pmd-guide`)

### Cursor Rules Overview

Cursor supports four types of rules:

- **Project Rules**: Stored in `.cursor/rules`, version-controlled and scoped to
  your codebase
- **User Rules**: Global to your Cursor environment, used by Agent (Chat)
- **Team Rules**: Team-wide rules managed from the dashboard (Team/Enterprise
  plans)
- **AGENTS.md**: Agent instructions in markdown format, simple alternative to
  `.cursor/rules`

### Best Practices

- Keep rules focused and under 500 lines
- Split large rules into multiple, composable rules
- Provide concrete examples or reference files using `@filename`
- Write rules like clear internal documentation
- Use `@filename` syntax to include relevant files in rule context

For more information about Cursor rules, see the
[Cursor Rules Documentation](https://cursor.com/docs/context/rules).

## License

This project is licensed under the **MIT License**. See the
[LICENSE.md](LICENSE.md) file for details.

## Support

- **Issues:** [GitHub Issues](https://github.com/starch-uk/sca-extra/issues)
- **Repository:**
  [https://github.com/starch-uk/sca-extra](https://github.com/starch-uk/sca-extra)
