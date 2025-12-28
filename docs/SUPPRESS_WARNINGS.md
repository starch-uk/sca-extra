# PMD Warning Suppression Guide for AI Agents

Quick reference for suppressing PMD rule violations in Apex code. Use suppressions sparingly—prefer fixing issues or improving rules when possible.

## Suppression Methods (Priority Order)

1. **Fix the issue or improve the rule** (preferred)
2. **Annotations** - Class/method level
3. **NOPMD comment** - Line level
4. **Rule properties** - Global suppression via `violationSuppressRegex` or `violationSuppressXPath`

## Annotations

### Suppress All PMD Warnings

```apex
@SuppressWarnings('PMD')
public class MyClass {
    // All PMD warnings suppressed in this class
}
```

### Suppress Specific Rule

```apex
@SuppressWarnings('PMD.UnusedLocalVariable')
public class MyClass {
    void method() {
        int unused = 42; // No violation
    }
}
```

### Suppress Multiple Rules

```apex
@SuppressWarnings('PMD.UnusedLocalVariable, PMD.UnusedPrivateMethod')
public class MyClass {
    private int unused;
    private void unusedMethod() {}
}
```

**Note:** Apex uses single quotes and comma-separated values (not JSON array syntax like Java).

## NOPMD Comment

Suppress a single line violation:

```apex
public class MyClass {
    private int bar; // NOPMD - accessed by native method
}
```

**Important:** The `// NOPMD` marker must be on the same line as the violation. Optional message after marker appears in reports:

```apex
if (condition) { // NOPMD - temporary workaround
}
```

### Custom Suppression Marker

Change the marker via CLI `--suppress-marker` option (default: `NOPMD`):

```bash
sf code-analyzer run --suppress-marker "TURN_OFF_WARNINGS"
```

## Rule Properties (Global Suppression)

**Important:** Salesforce Code Analyzer does not support property overrides via `code-analyzer.yml`. Configure suppression properties via custom ruleset XML files using `ref=` syntax.

Create a custom ruleset XML file to suppress violations matching patterns.

### violationSuppressRegex

Suppress violations where the message matches a regex:

**Important:** Salesforce Code Analyzer does not support property overrides via `code-analyzer.yml`. Configure suppression properties via custom ruleset XML files.

**Custom ruleset XML:**
```xml
<rule ref="category/apex/bestpractices.xml/UnusedFormalParameter">
    <properties>
        <property name="violationSuppressRegex">
            <value>.*'mySpecialParameter'.*</value>
        </property>
    </properties>
</rule>
```

**For custom rules:**
```xml
<rule ref="rulesets/structure/SomeRule.xml/SomeRule">
    <properties>
        <property name="violationSuppressRegex">
            <value>.*'mySpecialParameter'.*</value>
        </property>
    </properties>
</rule>
```

### violationSuppressXPath

Suppress violations where XPath query matches (XPath 3.1, context node is the violation node):

**Important:** Salesforce Code Analyzer does not support property overrides via `code-analyzer.yml`. Configure suppression properties via custom ruleset XML files.

**Custom ruleset XML:**
```xml
<?xml version="1.0"?>
<ruleset
    name="Suppression Rules"
    xmlns="http://pmd.sourceforge.net/ruleset/2.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://pmd.sourceforge.net/ruleset/2.0.0 https://pmd.sourceforge.io/ruleset_2_0_0.xsd"
>
    <description>Suppression rules for specific patterns</description>
    
    <!-- Suppress String parameters -->
    <rule ref="category/apex/bestpractices.xml/UnusedFormalParameter">
        <properties>
            <property name="violationSuppressXPath">
                <value>.[pmd-apex:typeIs('String')]</value>
            </property>
        </properties>
    </rule>
    
    <!-- Suppress in classes containing "Bean" -->
    <rule ref="rulesets/structure/SomeRule.xml/SomeRule">
        <properties>
            <property name="violationSuppressXPath">
                <value>./ancestor-or-self::ClassDeclaration[contains(@SimpleName, 'Bean')]</value>
            </property>
        </properties>
    </rule>
    
    <!-- Suppress in equals/hashCode methods -->
    <rule ref="rulesets/structure/AnotherRule.xml/AnotherRule">
        <properties>
            <property name="violationSuppressXPath">
                <value>./ancestor-or-self::MethodDeclaration[@Name = ('equals', 'hashCode')]</value>
            </property>
        </properties>
    </rule>
    
    <!-- Suppress in classes ending with "Bean" (regex match) -->
    <rule ref="rulesets/structure/YetAnotherRule.xml/YetAnotherRule">
        <properties>
            <property name="violationSuppressXPath">
                <value>./ancestor-or-self::ClassDeclaration[matches(@SimpleName, '^.*Bean$')]</value>
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
      - rulesets/structure/SomeRule.xml
      - rulesets/structure/AnotherRule.xml
      - rulesets/structure/YetAnotherRule.xml
      - rulesets/suppression-rules.xml  # Custom suppression ruleset
```

**XPath Notes:**
- Use `.` to reference the context node (the violation node)
- Prefer `./ancestor-or-self::` over `//` to avoid over-suppressing
- Context node varies by rule (check rule implementation)
- XPath 3.1 syntax supported (since PMD 7)

## Best Practices

1. **Fix or improve rules first** - Suppressions hide issues; better to fix root cause
2. **Be specific** - Suppress only what's necessary (specific rules, not all PMD warnings)
3. **Document why** - Add comments explaining suppression reason
4. **Review periodically** - Suppressions may become unnecessary after code/rule changes

## Related Documentation

- **[PMD Quick Reference](PMD.md)** - PMD essentials (includes CPD suppression via `CPD-OFF`/`CPD-ON`)
- **[AI Agent Rule Guide](AI_AGENT_RULE_GUIDE.md)** - Rule configuration and examples
- **[XPath 3.1 Reference](XPATH31.md)** - XPath syntax for `violationSuppressXPath`
- **[PMD Apex AST Reference](APEX_PMD_AST.md)** - Understanding violation node types

