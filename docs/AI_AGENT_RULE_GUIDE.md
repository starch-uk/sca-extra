```markdown
# AI Agent PMD Rule Configuration Guide

Configure PMD rules for Salesforce Apex code analysis. Provides rule info, violations, valid examples, and configuration properties.

## Related Docs
- **[PMD.md](PMD.md)** - PMD essentials
- **[CODE_ANALYZER_CONFIG.md](CODE_ANALYZER_CONFIG.md)** - `code-analyzer.yml` config
- **[XPATH31.md](XPATH31.md)** - XPath 3.1 for rule queries
- **[APEX_PMD_AST.md](APEX_PMD_AST.md)** - PMD Apex AST nodes
- **[REGEX.md](REGEX.md)** - Regex engine rules
- **[SUPPRESS_WARNINGS.md](SUPPRESS_WARNINGS.md)** - Suppression methods
- **[APEXDOC.md](APEXDOC.md)** - ApexDoc syntax

## Creating Rules

1. **AST Structure** - Reference APEX_PMD_AST.md for node types
2. **XPath** - Use XPATH31.md syntax; test against positive/negative cases
3. **Format** - Follow PMD Rule Format below; use property substitution
4. **Config** - Show `code-analyzer.yml` examples with properties

## XPathRule Property Configuration

**PMD 7.x doesn't validate custom XPathRule properties.** Use property substitution with defaults:

```xpath
if ('${propertyName}' = '${propertyName}') then 'defaultValue' else '${propertyName}'
```

**Behavior:**
- Property undefined → literal string matches itself → uses default
- Property defined → substituted value differs → uses custom value

**Example:**
```xml
<property name="xpath"><value><![CDATA[
//IfElseBlockStatement[
    count(IfBlockStatement) >= number(
        if ('${minElseIfStatements}' = '${minElseIfStatements}') then '2' else '${minElseIfStatements}'
    )
]
]]></value></property>
```

**Configure via:**
1. Add property to XML: `<property name="minElseIfStatements"><value>3</value></property>`
2. Modify default in XPath directly

### XPath Patterns

**`let` in predicates** - wrap in parentheses with `and`/`or`:
```xpath
//IfBlockStatement[
    StandardCondition/BooleanExpression[@Op='==']/VariableExpression
    and (
        let $var := StandardCondition/BooleanExpression[@Op='==']/VariableExpression/@Image
        return count(following-sibling::IfBlockStatement[
            StandardCondition/BooleanExpression[@Op='==']/VariableExpression/@Image = $var
        ]) + 1 >= 2
    )
]
```

**Consecutive siblings:**
```xpath
not(preceding-sibling::*[1][self::IfBlockStatement[...]])  // First in sequence only
let $var := .../@Image return count(following-sibling::...) + 1 >= 2  // Count matches
```

**Count across method:**
```xpath
let $var := ..., $method := ancestor::Method[1], $allBlocks := $method//IfBlockStatement
return sum(for $block in $allBlocks return if (...) then 1 else 0) >= 5
```

## PMD Rule Format

```markdown
## RuleName
**Category:** [code-style|documentation|method-signatures|modifiers|naming|structure]
**Priority:** [P1|P2|P3|P4]
**Description:** What the rule checks

### Violations
\`\`\`apex
// Code that violates
\`\`\`

### Valid Code
\`\`\`apex
// Code that passes
\`\`\`

### Properties
- `prop` (type): Description. Default: `val`

### Usage

**Basic configuration (code-analyzer.yml):**
\`\`\`yaml
engines:
  pmd:
    custom_rulesets:
      - rulesets/category/RuleName.xml
rules:
  pmd:
    RuleName:
      severity: "High"
      tags: ["Recommended"]
\`\`\`

**Property overrides (custom ruleset XML):**

Since Salesforce Code Analyzer doesn't support property overrides via `code-analyzer.yml`, create a custom ruleset XML file:

\`\`\`xml
<?xml version="1.0"?>
<ruleset
    name="Custom Overrides"
    xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd"
>
    <rule ref="rulesets/category/RuleName.xml/RuleName">
        <properties>
            <property name="prop">
                <value>val</value>
            </property>
        </properties>
    </rule>
</ruleset>
\`\`\`

Then reference in `code-analyzer.yml`:
\`\`\`yaml
engines:
  pmd:
    custom_rulesets:
      - rulesets/category/RuleName.xml  # Original rule
      - rulesets/custom-overrides.xml   # Override ruleset
\`\`\`
```

---

## Structure Rules

### InnerClassesCannotBeStatic
**Category:** structure | **Priority:** P1  
Inner classes cannot be static. Remove static modifier.

❌ `public static class Inner { }`  
✅ `public class Inner { }`

### InnerClassesCannotHaveStaticMembers
**Category:** structure | **Priority:** P1  
Inner classes cannot have static members.

❌ `public class Inner { public static Integer value; }`  
✅ `public class Inner { public Integer value; }`

### EnumMinimumValues
**Category:** structure | **Priority:** P3  
Enums must have minimum values (default: 3).

❌ `public enum Status { ACTIVE, INACTIVE }`  
✅ `public enum Status { ACTIVE, INACTIVE, PENDING }`

**Properties:** `minValues` (int): Default `3`

### PreferSwitchOverIfElseChains
**Category:** structure | **Priority:** P3  
If-else chains, consecutive ifs, or OR conditions comparing same variable should use switch.

❌ `if (x=='a') {} else if (x=='b') {} else if (x=='c') {}`  
❌ `if (x=='a' || x=='b' || x=='c') {}`  
✅ `switch on x { when 'a' {} when 'b' {} when 'c' {} }`

**Note:** Only applies to switch-compatible types: `Integer`, `Long`, `String`, `sObject`, or `Enum`.  
Non-switch types like `Boolean`, `Decimal`, `Date`, `DateTime`, `Time`, `Id`, `Blob` are not flagged.

**Properties:** `minElseIfStatements` (int): Default `2`

---

## Naming Rules

### NoSingleLetterVariableNames
**Category:** naming | **Priority:** P2  
No single-letter names except loop counters/exception vars.

❌ `Integer x = 5;`  
✅ `Integer index = 5;` | `for (Integer i...)` | `catch (Exception e)`

**Properties:** `allowedNames` (string): Default `"i,c,e"`

### NoAbbreviations
**Category:** naming | **Priority:** P2  
No abbreviations in variable names.

❌ `Integer acc = 5; String cfg = 'x'; Boolean isMgr = true;`  
✅ `Integer accountCount = 5; String configuration = 'x';`

**Properties:**
- `disallowedAbbreviations` (string): Default `"ctx,idx,msg,cfg,val,acc,con,opp,param,attr,elem,prev,curr,src,dest,dst,len,pos,mgr,svc,util,calc,init,ref,desc,impl,repo,col,hdr,doc,spec,req,res,resp,fmt,lbl,opt,addr,org"`
- `allowedSuffixes` (string): Regex alternation. Default `"Id|Api|Url|Html"`

---

## Code Style Rules

### NoMethodCallsInConditionals
**Category:** code-style | **Priority:** P2  
Extract method calls to variables before conditionals.

❌ `if (getValue() > 0) {}`  
✅ `Integer value = getValue(); if (value > 0) {}`

### ListInitializationMustBeMultiLine
**Category:** code-style | **Priority:** P3  
List initializations with minItems+ must be multi-line.

❌ `new List<String>{ 'a', 'b' };`  
✅ `new List<String>{ 'a' };` | `new List<String>{\n  'a',\n  'b'\n};`

**Properties:** `minItems` (int): Default `2`

### MapInitializationMustBeMultiLine
**Category:** code-style | **Priority:** P3  
Map initializations with minEntries+ must be multi-line.

❌ `new Map<String,Integer>{ 'a'=>1, 'b'=>2 };`  
✅ `new Map<String,Integer>{\n  'a'=>1,\n  'b'=>2\n};`

**Properties:** `minEntries` (int): Default `2`

### MultipleStringContainsCalls
**Category:** code-style | **Priority:** P3  
Replace multiple contains() with regex.

❌ `if (str.contains('a') || str.contains('b')) {}`  
✅ `if (Pattern.matches('.*(a|b).*', str)) {}`

**Properties:** `minCalls` (int): Default `2`

---

## Method Signature Rules

### NoCustomParameterObjects
**Category:** method-signatures | **Priority:** P3  
Avoid inner classes with only fields/constructors for passing parameters.

❌ `public class Param { String f1; }` (1+ fields)  
✅ `public void method(String f1) {}`

**Properties:**
- `minFields` (int): Inclusive. Default `1`

---

## Modifier Rules

### FinalVariablesMustBeFinal
**Category:** modifiers | **Priority:** P2  
Final variables cannot be reassigned.

❌ `final Integer v = 5; v = 10;`  
✅ `final Integer v = 5;`

### StaticMethodsMustBeStatic
**Category:** modifiers | **Priority:** P2  
Methods not using instance state should be static.

❌ `public Integer add(Integer a, Integer b) { return a+b; }`  
✅ `public static Integer add(Integer a, Integer b) { return a+b; }`

---

## Example Config

```yaml
name: My Config
version: 1.0.0

rulesets:
  - rulesets/structure/InnerClassesCannotBeStatic.xml
  - rulesets/structure/InnerClassesCannotHaveStaticMembers.xml
  - rulesets/modifiers/FinalVariablesMustBeFinal.xml
  - rulesets/naming/NoSingleLetterVariableNames.xml

rules:
  # Override severity and tags only (properties are NOT supported via code-analyzer.yml)
  NoSingleLetterVariableNames:
    severity: "High"
    tags: ["Recommended", "Naming"]
```

**Property Overrides (Custom Ruleset XML):**

Since Salesforce Code Analyzer doesn't support property overrides via `code-analyzer.yml`, create a custom ruleset XML file:

```xml
<?xml version="1.0"?>
<ruleset
    name="Custom Overrides"
    xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd"
>
    <description>Custom property overrides</description>
    
    <rule ref="rulesets/category/RuleName.xml/RuleName">
        <properties>
            <property name="prop">
                <value>val</value>
            </property>
        </properties>
    </rule>
</ruleset>
```

Then reference in `code-analyzer.yml`:
```yaml
engines:
  pmd:
    custom_rulesets:
      - rulesets/category/RuleName.xml  # Original rule
      - rulesets/custom-overrides.xml   # Override ruleset
```

**Key Points:**
- The `ref` attribute format is `{ruleset-path}/{rule-name}`
- The override ruleset must be listed **after** the original ruleset in `custom_rulesets`
- Property values in XML use `<value>` tags

---

For complete rules, see `rulesets/` directory. For setup instructions and configuration details, see:
- [CODE_ANALYZER_CONFIG.md](CODE_ANALYZER_CONFIG.md) - Complete configuration reference
- [PMD.md](PMD.md) - PMD ruleset and property configuration
- Repository root for installation and usage instructions
```
