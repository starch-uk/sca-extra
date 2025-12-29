# MCP Tools for Code Analyzer

## Overview

Model Context Protocol (MCP) tools allow interaction with Salesforce Code
Analyzer using natural language through Large Language Models (LLMs). Code
Analyzer provides MCP tools within the Salesforce DX MCP Server, enabling AI
assistants and LLMs to analyze code and query rule information.

**Reference:**
[Use MCP Tools to Analyze Your Code](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/mcp.html)

**Status:** Developer Preview

## Prerequisites

- Salesforce CLI installed
- MCP client configured (e.g., Agentforce Vibes Extension, Claude Desktop, or
  other MCP-compatible client)
- Salesforce DX MCP Server installed (included with Agentforce Vibes Extension)

## Available MCP Tools

### `run_code_analyzer`

Analyzes code to ensure adherence to best practices. Equivalent to the
`sf scanner:run` CLI command.

**Features:**

- Analyzes up to 10 files per execution
- Runs only rules tagged as `Recommended`
- Returns violation details with severity, location, and messages

**Usage via LLM:**

```
Analyze the code in my Apex class AccountService for security vulnerabilities.
```

### `describe_code_analyzer_rule`

Provides descriptions of specific Code Analyzer rules. Equivalent to the
`sf scanner:rule:list --rule-selector <rule-name> --view detail` CLI command.

**Features:**

- Returns rule metadata (name, description, severity, tags)
- Shows examples of violations and valid code patterns
- Includes rule configuration options

**Usage via LLM:**

```
Describe the PMD rule NoSingleLetterVariableNames.
What does the ESLint rule @typescript-eslint/no-explicit-any do?
```

## Accessing MCP Tools

### Agentforce Vibes Extension (Recommended)

The **Agentforce Vibes Extension** for VS Code is pre-configured with the
Salesforce DX MCP Server, providing immediate access to Code Analyzer MCP tools:

1. Install the Agentforce Vibes Extension from VS Code Marketplace
2. The extension automatically configures the Salesforce DX MCP Server
3. Access Code Analyzer tools through supported AI assistants (Claude, GPT-4,
   etc.)

**No additional configuration required** when using Agentforce Vibes Extension.

### Other MCP Clients

For other MCP clients (e.g., Claude Desktop, custom MCP servers), you must:

1. **Install Salesforce DX MCP Server:**

    ```bash
    npm install -g @salesforce/mcp-server-dx
    ```

2. **Configure MCP Client:** Add Salesforce DX MCP Server to your MCP client
   configuration file (location varies by client).

    Example configuration:

    ```json
    {
        "mcpServers": {
            "salesforce-dx": {
                "command": "sf",
                "args": ["mcp", "start"],
                "env": {
                    "SFDX_MCP_ENABLED": "true"
                }
            }
        }
    }
    ```

3. **Enable Non-GA Tools:** Some clients require the `--allow-non-ga-tools` flag
   to enable Developer Preview tools:

    ```json
    {
        "mcpServers": {
            "salesforce-dx": {
                "command": "sf",
                "args": ["mcp", "start", "--allow-non-ga-tools"]
            }
        }
    }
    ```

4. **Verify Connection:** Restart your MCP client and verify Code Analyzer tools
   are available.

## Usage Considerations

### When to Use MCP Tools

MCP tools are ideal for:

- **Interactive Analysis**: Asking questions about code quality in natural
  language
- **Rule Discovery**: Learning about available rules and their purposes
- **AI-Assisted Development**: Integrating code analysis into AI-powered
  development workflows
- **Documentation Queries**: Getting rule descriptions and examples on-demand

### When to Use CLI or VS Code Extension

Use CLI commands or VS Code extension instead when:

- **Batch Analysis**: Analyzing large codebases (MCP tools limited to 10 files
  per execution)
- **CI/CD Integration**: Automated pipelines (CLI is more suitable)
- **Custom Rule Sets**: Using non-recommended rules (MCP tools run only
  `Recommended` rules)
- **Cost Concerns**: LLM API calls may incur costs (CLI/extension are free)

### Limitations

**File Limit:**

- MCP tools analyze a maximum of 10 files per execution
- For larger codebases, use CLI commands or VS Code extension

**Rule Filtering:**

- `run_code_analyzer` runs only rules tagged as `Recommended`
- To use other rules, use CLI commands or VS Code extension

**LLM Costs:**

- MCP tool invocations may incur LLM API costs
- Consider using CLI/extension for routine analysis

**Network Dependency:**

- Requires network connection for LLM interactions
- CLI/extension work offline after initial setup

## Example Interactions

### Analyzing Code

**User:**

```
Check the security of my AccountController class.
```

**Assistant (via MCP):**

- Invokes `run_code_analyzer` with AccountController.cls
- Returns violations with severity and line numbers
- Explains security concerns in natural language

### Querying Rule Information

**User:**

```
What's the best practice for handling null checks in Apex?
```

**Assistant (via MCP):**

- Invokes `describe_code_analyzer_rule` for relevant null-checking rules
- Returns rule descriptions and examples
- Provides guidance based on rule documentation

### Comparing Rules

**User:**

```
What's the difference between PMD's AvoidNullPointerException and NullPointerException rules?
```

**Assistant (via MCP):**

- Invokes `describe_code_analyzer_rule` for both rules
- Compares rule descriptions and examples
- Highlights differences and use cases

## Troubleshooting

### Tools Not Available

1. Verify MCP Server is running: Check MCP client logs
2. Verify Salesforce CLI is installed: `sf --version`
3. Check MCP client configuration for correct server setup
4. Ensure `--allow-non-ga-tools` flag is set if required

### Analysis Fails

1. Verify files exist and are accessible
2. Check file paths are correct (relative to project root)
3. Verify Code Analyzer plugin is installed: `sf plugins list | grep scanner`
4. Check MCP client logs for detailed error messages

### No Results Returned

1. Verify rules are tagged as `Recommended` (MCP tools only run recommended
   rules)
2. Check `code-analyzer.yml` configuration doesn't exclude files
3. Verify file types are supported (`.cls`, `.trigger`, `.js`, `.ts`, etc.)
4. Check for syntax errors in analyzed files

## Best Practices

1. **Use for Discovery**: Leverage MCP tools to learn about available rules
2. **Combine with CLI**: Use MCP for interactive queries, CLI for batch analysis
3. **Understand Limitations**: Be aware of file limits and rule filtering
4. **Monitor Costs**: Track LLM API usage if using paid services
5. **Verify Results**: Cross-reference MCP results with CLI output for critical
   analysis

## Related Documentation

- **[Salesforce CLI Commands](SFCLI.md)** - Command-line usage of Code Analyzer
- **[VS Code Extension](VSCODE.md)** - VS Code integration for Code Analyzer
- **[Code Analyzer Configuration](CODE_ANALYZER_CONFIG.md)** - Configuration
  reference
- **[PMD Engine](PMD.md)** - PMD rules available through Code Analyzer
- **[ESLint Engine](ESLINT.md)** - ESLint rules for JavaScript/TypeScript/LWC

## Additional Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Agentforce Vibes Extension](https://marketplace.visualstudio.com/items?itemName=salesforce.agentforce-vibes)
- [Salesforce DX MCP Server Documentation](https://github.com/salesforce/mcp-server-dx)
