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
```yaml
# Before (v1.0.0)
rules:
  NoSingleLetterVariableNames:
    properties:
      allowedNames: "i,c"

# After (v2.0.0) - Add 'e' to allowed names if needed
rules:
  NoSingleLetterVariableNames:
    properties:
      allowedNames: "i,c,e"  # Explicitly allow exception variable
```

## Property Changes

### Renamed Properties

If a property is renamed:

**Before:**
```yaml
rules:
  RuleName:
    properties:
      oldPropertyName: "value"
```

**After:**
```yaml
rules:
  RuleName:
    properties:
      newPropertyName: "value"  # Updated property name
```

### Removed Properties

If a property is removed:

1. Remove the property from `code-analyzer.yml`
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
   - Check rule-specific documentation in README.md
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

## Support

For migration support:
- **Issues:** [GitHub Issues](https://github.com/starch-uk/sca-extra/issues)
- **Documentation:** See [README.md](../README.md) and other docs
- **Examples:** See `tests/fixtures/` for code examples

