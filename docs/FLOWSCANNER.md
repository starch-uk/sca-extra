# Flow Scanner Reference

## Overview

Audits Salesforce Flows for security: CRUD privilege escalation, System Context
vulnerabilities.

## Config (`code-analyzer.yml`)

```yaml
engines:
    flow:
        disable_engine: false
        python_command: null # auto-discover or specify path
```

| Property         | Type | Default | Desc                           |
| ---------------- | ---- | ------- | ------------------------------ |
| `disable_engine` | bool | false   | Disable flow engine            |
| `python_command` | str  | null    | Python cmd/path (auto if null) |

## Rules

List: `sf scanner:rule:list --engine flow`

| Rule                          | Severity | Desc                                                             |
| ----------------------------- | -------- | ---------------------------------------------------------------- |
| `SystemContextWithoutSharing` | High(2)  | CRUD in System Context Without Sharing with user-controlled data |
| `SystemContextWithSharing`    | Low(4)   | CRUD in System Context With Sharing with user-controlled data    |

Tags: `Recommended`,`Security`,`Xml`

### Rule Override

```yaml
rules:
  flow:
    SystemContextWithoutSharing: {severity:'High',tags:['Security']}
```

## Usage

```bash
sf scanner:rule:list --engine flow
sf scanner:run                      # all engines
sf scanner:run --rule-selector flow # flow only
```

## Flow Run Contexts

| Context                    | Permissions                              | Risk                          |
| -------------------------- | ---------------------------------------- | ----------------------------- |
| **User Context**           | User's perms, sharing, FLS               | Default—use this              |
| **System Without Sharing** | Bypasses all sharing+perms               | High—privilege escalation     |
| **System With Sharing**    | System obj/field perms, respects sharing | Moderate—bypasses user access |

## Fixing Violations

**Best**: Change to User Context

1. Flow Builder → Flow Properties → Advanced
2. Set "Run the flow in" → "User Context"
3. Save+activate

**If System Context required**: Implement procedural access control:

- Decision elements checking profile/role/permission sets
- Apex actions with `Security.stripInaccessible()`
- Validate record ownership before modifications
- Use `with sharing` in Apex
- Sanitize user-controlled inputs
- Scope record selection criteria

## System Context Risks

- Privilege escalation (access/modify unauthorized records)
- Data exposure to unauthorized users
- Unauthorized modifications

**Mitigations**: Validate perms before CRUD | Apex access checks | Sanitize
inputs | Limit record selection | Use sharing+FLS | Audit logging

## Guest User Best Practices

- Minimal permissions | Decision elements for access validation | Sharing rules
  for record filtering | Input validation | Generic error messages |
  `with sharing` Apex | Test with guest profiles

**Patterns**: System Context only for limited ops on unowned records |
Procedural checks in Apex | Validate ownership before modifications

## Secure Coding

**Input**: Validate before queries/CRUD | Sanitize for injection | Parameterized
queries in Apex **Access**: Check perms before record access | Validate
ownership | Decision elements for business rules **Errors**: No sensitive info
in messages | Log security errors | Generic user messages **Design**: Minimize
System Context | User Context default | Least-privilege | Test with multiple
profiles

## Click Process Extensions

Flows extending buttons/actions/quick actions:

- Inherit user context by default
- Validate all inputs from click action
- Check perms before CRUD
- Use `with sharing` in Apex
- User Context unless System explicitly required
- Log security actions

**Patterns**:

- New button: Validate create perm + field access
- Edit button: Verify edit access + ownership
- List actions: Validate access to selected records + bulk limits

## False Positives

Safe to suppress when:

1. Public-facing flows for guests/community (limited ops on inaccessible
   records)
2. Custom field access only (app-owned fields, intentionally ignoring platform
   ACL)

**Requirement**: Must implement alternative access control in flow/Apex.
Document why System Context needed + what controls exist.

## Notes

- Analyzes `.flow-meta.xml` files only
- Requires Python (auto-discovered or `python_command`)
- Detects System Context + user-controlled data in CRUD ops

## Refs

- [Flow Scanner Engine](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/engine-flow.html)
- [Flow Scanner Rules](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/rules-flow.html)
- [Change Flow Run Context](https://help.salesforce.com/s/articleView?id=platform.flow_distribute_system_mode.htm)
- [System Context Data Safety](https://help.salesforce.com/s/articleView?id=platform.flow_distribute_context_data_safety_system_context.htm)
- [Flow Secure Coding](https://developer.salesforce.com/docs/atlas.en-us.secure_coding_guide.meta/secure_coding_guide/secure_coding_considerations_flow_design.htm)
