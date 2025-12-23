# AI Agent Rule Configuration Guide

This guide is designed for AI coding assistants to help developers configure PMD rules for Salesforce Apex code analysis. It provides structured, machine-readable information about each rule including violations, valid code examples, and configuration properties.

When helping with Salesforce Code Analyzer configuration, use this guide to:
- Provide accurate rule information with code examples
- Suggest appropriate property values based on the rule's purpose
- Generate complete YAML configuration examples
- Reference rule categories, priorities, and descriptions

## Related Documentation

When creating or modifying PMD rules, also reference these essential guides:
- **[XPath 3.1 Reference](XPATH31.md)** - XPath 3.1 syntax, functions, and expressions used to write rule queries
- **[PMD Apex AST Reference](APEX_PMD_AST.md)** - PMD Apex AST node types, patterns, and structure for understanding code representation

These documents provide the technical foundation needed to write effective XPath expressions that operate on the PMD Apex AST.

## Creating New Rules

When helping developers create new PMD rules for Salesforce Apex:

1. **Understand the AST Structure:**
   - Reference [APEX_PMD_AST.md](APEX_PMD_AST.md) to understand how Apex code is represented in the PMD AST
   - Identify the appropriate AST node types for the rule's purpose
   - Use AST patterns and examples from the reference guide

2. **Write XPath Expressions:**
   - Use [XPATH31.md](XPATH31.md) for XPath 3.1 syntax and functions
   - Write XPath expressions that correctly traverse the AST structure
   - Test XPath expressions against positive and negative test cases

3. **Follow Rule Format:**
   - Structure rules according to the PMD Rule Format (below)
   - Include clear descriptions, violations, and valid code examples
   - Define configurable properties when appropriate

4. **Provide Configuration Examples:**
   - Show how to enable the rule in `code-analyzer.yml`
   - Document any configurable properties with examples
   - Include complete YAML configuration snippets

## PMD Rule Format

Each PMD rule entry in this guide follows this structure:

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

## Structure Rules

### InnerClassesCannotBeStatic

**Category:** structure  
**Priority:** P1  
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

**Configurable Properties:** None

**Usage in code-analyzer.yml:**
```yaml
rulesets:
  - rulesets/structure/InnerClassesCannotBeStatic.xml
```

### InnerClassesCannotHaveStaticMembers

**Category:** structure  
**Priority:** P1  
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

**Configurable Properties:** None

**Usage in code-analyzer.yml:**
```yaml
rulesets:
  - rulesets/structure/InnerClassesCannotHaveStaticMembers.xml
```

## Naming Rules

### NoSingleLetterVariableNames

**Category:** naming  
**Priority:** P2  
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

**Configurable Properties:**
- `allowedNames` (string): Comma-separated list of allowed single-letter names. Default: `"i,c,e"`

**Usage in code-analyzer.yml:**
```yaml
rulesets:
  - rulesets/naming/NoSingleLetterVariableNames.xml

rules:
  NoSingleLetterVariableNames:
    properties:
      allowedNames: "i,c,e,x,y,z"
```

### NoAbbreviations

**Category:** naming  
**Priority:** P2  
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
- `disallowedAbbreviations` (string): Comma-separated list of exact variable names to flag as abbreviations. Default: `"ctx,idx,msg,cfg,val,acc,con,opp,param,attr,elem,prev,curr,src,dest,dst,len,pos,mgr,svc,util,calc,init,ref,desc,impl,repo,col,hdr,doc,spec,req,res,resp,fmt,lbl,opt,addr,org"`.  
- `allowedSuffixes` (string): Regex-style list of suffixes (joined with `|`) that are treated as complete words when they appear at the end of a variable name. Default: `"Id|Api|Url|Html"`.

**Usage in code-analyzer.yml:**
```yaml
rulesets:
  - rulesets/naming/NoAbbreviations.xml

rules:
  NoAbbreviations:
    properties:
      disallowedAbbreviations: "foo,bar,baz"
      allowedSuffixes: "Id|Api|Url|Html|Dto"
```

## Code Style Rules

### NoMethodCallsInConditionals

**Category:** code-style  
**Priority:** P2  
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

**Configurable Properties:** None

**Usage in code-analyzer.yml:**
```yaml
rulesets:
  - rulesets/code-style/NoMethodCallsInConditionals.xml
```

## Modifier Rules

### FinalVariablesMustBeFinal

**Category:** modifiers  
**Priority:** P2  
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

**Configurable Properties:** None

**Usage in code-analyzer.yml:**
```yaml
rulesets:
  - rulesets/modifiers/FinalVariablesMustBeFinal.xml
```

### StaticMethodsMustBeStatic

**Category:** modifiers  
**Priority:** P2  
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

**Configurable Properties:** None

**Usage in code-analyzer.yml:**
```yaml
rulesets:
  - rulesets/modifiers/StaticMethodsMustBeStatic.xml
```

## Complete Example Configuration

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
      allowedNames: "i,c,e,x,y,z"
```

## Benefits

- Enables AI agents to provide accurate, consistent rule information
- Reduces errors in rule configuration
- Provides quick reference for developers
- Ensures all rules are documented in a machine-readable format
- Supports automated rule suggestion and configuration

## Note

This guide includes examples for key rules. For a complete list of all rules, see the `rulesets/` directory. Each rule XML file contains detailed descriptions and XPath expressions.

For instructions on setting up this guide with Cursor, see the [README.md](https://github.com/starch-uk/sca-extra#ai-agent-configuration).
