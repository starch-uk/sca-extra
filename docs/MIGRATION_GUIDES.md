# Rule Migration Guides

This document provides guidance for migrating between rule versions and handling breaking changes.

## Versioning Strategy

All rules follow semantic versioning (major.minor.patch):

- **Major version** (X.0.0): Breaking changes that require code modifications
- **Minor version** (0.X.0): New features or enhancements (backward compatible)
- **Patch version** (0.0.X): Bug fixes (backward compatible)

## Finding Rule Versions

Rule versions are documented in the rule XML file's description:

```xml
<description>
    Rule description here.
    
    Version: 1.2.3
</description>
```

## Migration Process

### Step 1: Check Current Version

1. Open the rule XML file: `rulesets/{category}/{RuleName}.xml`
2. Look for version information in the description
3. Note the current version

### Step 2: Review Release Notes

1. Check `CHANGELOG.md` for version-specific changes
2. Review GitHub releases for detailed migration notes
3. Check for breaking changes in major version updates

### Step 3: Update Code

1. Review code examples in migration guides
2. Update your Apex code to comply with new rule versions
3. Test changes locally

### Step 4: Update Configuration

1. Update `code-analyzer.yml` if rule properties changed
2. Test configuration with updated rules
3. Verify no new violations are introduced

## Breaking Changes

### Major Version Updates

When a rule's major version is incremented, it indicates breaking changes:

- **Rule behavior changes:** Rule may now flag code that was previously allowed
- **Property changes:** Properties may be renamed, removed, or have different defaults
- **XPath changes:** The underlying XPath expression may have changed

### Handling Breaking Changes

1. **Review changelog** for specific breaking changes
2. **Update code** to comply with new rule behavior
3. **Update configuration** if properties changed
4. **Test thoroughly** before deploying

## Version-Specific Migration Paths

### Version 1.0.0 → 2.0.0

**Breaking Changes:**
- Rule behavior may have changed
- Properties may have been renamed or removed

**Migration Steps:**
1. Review changelog for specific changes
2. Update code to comply with new behavior
3. Update `code-analyzer.yml` if properties changed
4. Test and verify

### Version 1.0.0 → 1.1.0

**Non-Breaking Changes:**
- New features or enhancements
- New configurable properties (optional)
- Improved rule accuracy

**Migration Steps:**
1. Review new features
2. Optionally configure new properties
3. Test to ensure no regressions

### Version 1.0.0 → 1.0.1

**Bug Fixes:**
- Rule accuracy improvements
- Performance optimizations
- Documentation updates

**Migration Steps:**
1. Update to latest patch version
2. Verify rule behavior is correct
3. No code changes typically required

## Example: Migrating NoSingleLetterVariableNames

### Version 1.0.0

```apex
// Allowed: Loop counters and exceptions
for (Integer i = 0; i < 10; i++) { }  // ✅ Allowed
catch (Exception e) { }  // ✅ Allowed

// Violations: Other single-letter names
Integer x = 5;  // ❌ Violation
```

### Version 2.0.0 (Hypothetical Breaking Change)

**Breaking Change:** Rule now also flags single-letter names in catch blocks unless explicitly allowed.

**Migration:**
```apex
// Before (v1.0.0)
catch (Exception e) { }  // ✅ Allowed

// After (v2.0.0) - Update code
catch (Exception exception) { }  // ✅ Use descriptive name
```

**Configuration Update:**

**Important:** Salesforce Code Analyzer does not support property overrides via `code-analyzer.yml`. Property overrides must be done via custom ruleset XML files.

**Before (v1.0.0) - Custom ruleset XML:**
```xml
<rule ref="rulesets/naming/NoSingleLetterVariableNames.xml/NoSingleLetterVariableNames">
    <properties>
        <property name="allowedNames">
            <value>i,c</value>
        </property>
    </properties>
</rule>
```

**After (v2.0.0) - Update custom ruleset XML:**
```xml
<rule ref="rulesets/naming/NoSingleLetterVariableNames.xml/NoSingleLetterVariableNames">
    <properties>
        <property name="allowedNames">
            <value>i,c,e</value>  <!-- Explicitly allow exception variable -->
        </property>
    </properties>
</rule>
```

## Property Changes

### Renamed Properties

If a property is renamed, update your custom ruleset XML file:

**Before:**
```xml
<rule ref="rulesets/category/RuleName.xml/RuleName">
    <properties>
        <property name="oldPropertyName">
            <value>value</value>
        </property>
    </properties>
</rule>
```

**After:**
```xml
<rule ref="rulesets/category/RuleName.xml/RuleName">
    <properties>
        <property name="newPropertyName">
            <value>value</value>  <!-- Updated property name -->
        </property>
    </properties>
</rule>
```

### Removed Properties

If a property is removed:

1. Remove the property from your custom ruleset XML file (if you had overridden it)
2. Review changelog for why it was removed
3. Update code if the removed property affected behavior

### New Properties

If a new property is added:

1. Review property documentation
2. Optionally configure the property
3. Use default value if not configured

## Testing After Migration

### Checklist

- [ ] All existing tests pass
- [ ] No new false positives introduced
- [ ] No new false negatives introduced
- [ ] Configuration is updated (if needed)
- [ ] Code is updated to comply with new rules (if needed)
- [ ] Performance is acceptable

### Testing Steps

1. **Run tests locally:**
   ```bash
   pnpm test
   ```

2. **Validate rules:**
   ```bash
   pnpm run validate
   ```

3. **Check for regressions:**
   ```bash
   pnpm run check-regressions
   ```

4. **Test with your codebase:**
   - Run code analyzer on your Apex code
   - Review violations
   - Update code as needed

## Getting Help

If you encounter issues during migration:

1. **Check documentation:**
   - Review this migration guide
   - Check rule-specific documentation in the rule XML file and repository documentation
   - Review AI Agent Rule Guide

2. **Review examples:**
   - Check code examples in rule documentation
   - Review test fixtures in `tests/fixtures/`

3. **Report issues:**
   - Create a GitHub issue with details
   - Include version information
   - Provide code examples

## Best Practices

1. **Stay Updated:** Regularly update to latest patch versions for bug fixes
2. **Review Changes:** Always review changelog before major version updates
3. **Test Thoroughly:** Test rule changes in a development environment first
4. **Document Changes:** Document any code changes needed for migration
5. **Version Control:** Track rule versions in your project documentation

## Version History

For detailed version history, see:
- `CHANGELOG.md` - Detailed changelog
- GitHub Releases - Release notes and migration guides
- Rule XML files - Version information in descriptions

## PMD 7 Migration

This section covers migration from PMD 6.x to PMD 7.0.0. For complete details, see the [PMD 7 Migration Guide](https://pmd.github.io/pmd/pmd_userdocs_migrating_to_pmd7.html).

### Before Updating to PMD 7

Before updating to PMD 7, you should:

1. **Update to PMD 6.55.0** (latest PMD 6 version)
2. **Fix all deprecation warnings** in PMD 6
3. **Migrate through release candidates** (7.0.0-rc1 → 7.0.0-rc2 → 7.0.0-rc3 → 7.0.0-rc4 → 7.0.0)

### Key Changes in PMD 7

#### Property Definitions

**PMD 6 (deprecated):**
```java
StringProperty.named("propertyName").desc("Description").defaultValue("default")
```

**PMD 7:**
```java
PropertyFactory.stringProperty("propertyName")
    .desc("Description")
    .defaultValue("default")
    .build()
```

**Note:** `uiOrder` property is removed. Just remove it from property definitions.

#### Reporting Violations

**PMD 6 (deprecated):**
```java
addViolation(data, node, message);
```

**PMD 7:**
```java
asCtx(data).addViolation(node, message);
```

#### CLI Parameter Changes

Deprecated parameters have been removed. Use the new forms:

| PMD 6 (deprecated) | PMD 7 |
|-------------------|-------|
| `-no-cache` | `--no-cache` |
| `-failOnViolation` | `--fail-on-violation` |
| `-reportfile` | `--report-file` |
| `-language` | `--use-version` |

#### XPath Attribute Deprecations

PMD 7 may show warnings about deprecated XPath attributes. Common changes:

- `VariableId/@Image` → `@Name`
- Check deprecation warnings for specific alternatives

#### Ruleset References

**PMD 6 (deprecated):**
```xml
<rule ref="java-basic" />  <!-- Resolves to rulesets/java/basic.xml -->
<rule ref="600" />  <!-- Resolves to rulesets/releases/600.xml -->
```

**PMD 7:**
```xml
<rule ref="rulesets/java/basic.xml" />  <!-- Explicit path required -->
```

**Note:** Old rulesets like `basic.xml` have been removed. Create custom rulesets instead.

#### Apex AST Changes

PMD 7.0.0 switched from Jorje to Summit AST parser. Key changes:

**Removed Attributes:**
- `Method/@Synthetic` - No longer exists (Summit AST doesn't generate synthetic methods)
- `Method/@Namespace` - Removed (was never fully implemented, always returned empty string)
- `ReferenceExpression/@Context` - Removed (was not used, always returned null)

**Removed Nodes:**
- `BridgeMethodCreator` - No longer generated (synthetic methods removed)
- Methods named `<clinit>` and `<init>` - No longer generated

**Impact on XPath Rules:**
- Remove any XPath expressions that reference `@Synthetic`, `@Namespace`, or `@Context`
- Remove references to `BridgeMethodCreator` nodes
- Update rules that check for `<clinit>` or `<init>` method names

#### Language Versions

PMD 7 introduces language versioning:

- All languages have defined versions
- Default version is usually the latest
- Use `--use-version` CLI option to specify version
- Rules can specify `minimumLanguageVersion` and `maximumLanguageVersion`
- Check available versions: `pmd check --help`

#### XML Report Format Changes

The `suppressiontype` attribute values changed:

| PMD 6 | PMD 7 |
|-------|-------|
| `nopmd` | `//nopmd` |
| `annotation` | `@suppresswarnings` |
| (new) | `xpath` (suppressed via `violationSuppressXPath`) |
| (new) | `regex` (suppressed via `violationSuppressRegex`) |

#### Visualforce and Velocity Language Names

Language names changed:
- `vf` → `visualforce` (e.g., `category/vf/security.xml` → `category/visualforce/security.xml`)
- `vm` → `velocity` (e.g., `category/vm/...` → `category/velocity/...`)

### Migration Checklist

- [ ] Update to PMD 6.55.0 and fix deprecation warnings
- [ ] Update property definitions to use `PropertyFactory`
- [ ] Update violation reporting to use `asCtx(data).addViolation()`
- [ ] Update CLI commands to use new parameter names
- [ ] Fix XPath expressions using deprecated attributes
- [ ] Update ruleset references to explicit paths
- [ ] Remove references to removed Apex AST attributes/nodes
- [ ] Update Visualforce/Velocity language references (if applicable)
- [ ] Test all custom rules with PMD 7
- [ ] Review and update XML report parsing (if applicable)

### Additional Resources

- [PMD 7 Migration Guide](https://pmd.github.io/pmd/pmd_userdocs_migrating_to_pmd7.html) - Complete migration documentation
- [PMD 7 Release Notes](https://pmd.github.io/pmd/pmd_release_notes_pmd7.html) - Detailed changes and removed rules
- [Defining Rule Properties](https://pmd.github.io/pmd/pmd_userdocs_extending_defining_properties.html) - PropertyFactory usage

## Support

For migration support:
- **Issues:** [GitHub Issues](https://github.com/starch-uk/sca-extra/issues)
- **Documentation:** See repository documentation files in `docs/` directory
- **Examples:** See `tests/fixtures/` for code examples

