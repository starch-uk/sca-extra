# VS Code Extension for Code Analyzer

## Overview

The Salesforce Code Analyzer Visual Studio Code Extension integrates Code
Analyzer's static analysis capabilities directly into the VS Code environment,
providing real-time feedback and code scanning during development.

**Reference:**
[Use the VS Code Extension to Analyze Your Code](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/analyze-vscode.html)

## Prerequisites

- Visual Studio Code installed
- Salesforce CLI installed and configured
- Salesforce Extensions for VS Code installed

## Installation

### Step 1: Install Salesforce CLI

Ensure Salesforce CLI is installed on your system:

```bash
sf --version
```

If not installed, download from
[Salesforce CLI](https://developer.salesforce.com/tools/salesforcecli).

### Step 2: Install Salesforce Extensions for VS Code

The Code Analyzer extension is included in the Salesforce Extensions for VS Code
extension pack:

1. Open VS Code
2. Go to Extensions view (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Salesforce Extension Pack"
4. Click Install

Alternatively, install the Code Analyzer extension directly by searching for
"Salesforce Code Analyzer".

### Step 3: Install Code Analyzer CLI Plugin

The VS Code extension requires the Code Analyzer CLI plugin. Install it via
terminal:

```bash
sf plugins install @salesforce/sfdx-scanner
```

Or open the VS Code integrated terminal (Ctrl+` / Cmd+`) and run:

```bash
sf plugins install @salesforce/sfdx-scanner
```

Verify installation:

```bash
sf scanner --help
```

## Usage

### Scan Selected Files or Folders

1. In VS Code Explorer, select one or more files or folders
2. Right-click the selection
3. Choose **"SFDX: Scan Selected Files or Folders with Code Analyzer"**

The extension will analyze the selected items and display results in the
Problems panel.

### Scan Current File

1. Open a file in the editor
2. Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
3. Type and select **"SFDX: Scan Current File with Code Analyzer"**

The current file will be analyzed and violations will be shown in the Problems
panel.

### Scan Workspace

To scan the entire workspace:

1. Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Type and select **"SFDX: Scan Workspace with Code Analyzer"**

## Viewing Results

### Problems Panel

After scanning, results are displayed in the **Problems** panel (View → Problems
or Ctrl+Shift+M / Cmd+Shift+M):

- **Severity**: Indicated by icon color (Error/Warning/Info)
- **File**: Click to navigate to the violation location
- **Rule**: Rule name and description
- **Line**: Line number where violation occurs
- **Message**: Detailed violation message

### Inline Annotations

Violations appear as inline annotations in the editor:

- Red squiggles for errors (High/Critical severity)
- Yellow squiggles for warnings (Moderate severity)
- Blue squiggles for info (Low/Info severity)

Hover over annotations to see detailed violation information.

### Quick Actions

Right-click on a violation in the Problems panel or editor to access:

- **Go to Definition**: Navigate to rule definition
- **View Rule Details**: See full rule documentation
- **Copy Violation**: Copy violation details to clipboard

## Configuration

### Extension Settings

Configure Code Analyzer extension behavior via VS Code settings:

1. Open Settings (Ctrl+, / Cmd+,)
2. Search for "Salesforce Code Analyzer"

Available settings:

- **Enable/Disable**: Toggle Code Analyzer on/off
- **Auto-scan on Save**: Automatically scan files when saved
- **Default Engine**: Set default engine for scanning
- **Severity Mapping**: Map Code Analyzer severities to VS Code severities
- **Excluded Patterns**: Patterns to exclude from scanning

### Project Configuration

The extension respects `code-analyzer.yml` configuration in your project root.
For detailed configuration options, see
[Code Analyzer Configuration](CODE_ANALYZER_CONFIG.md).

Example `code-analyzer.yml`:

```yaml
engines:
    pmd:
        custom_rulesets:
            - rulesets/design/InnerClassesCannotBeStatic.xml

rules:
    pmd:
        NoSingleLetterVariableNames:
            severity: 'High'
            tags: ['Recommended']
```

## Keyboard Shortcuts

Default keyboard shortcuts:

- **Scan Current File**: Not assigned by default (use Command Palette)
- **Scan Selected Files**: Not assigned by default (use context menu)

You can assign custom shortcuts via:

1. File → Preferences → Keyboard Shortcuts (Ctrl+K Ctrl+S / Cmd+K Cmd+S)
2. Search for "Salesforce Code Analyzer"
3. Assign desired shortcuts

## Troubleshooting

### Extension Not Working

1. Verify Salesforce CLI is installed and in PATH
2. Verify Code Analyzer plugin is installed: `sf plugins list`
3. Check VS Code Output panel for errors (View → Output, select "Salesforce Code
   Analyzer")
4. Reload VS Code window (Ctrl+Shift+P → "Developer: Reload Window")

### No Results Displayed

1. Verify files are supported file types (`.cls`, `.trigger`, `.js`, `.ts`,
   `.html`, `.cmp`, etc.)
2. Check `code-analyzer.yml` configuration
3. Verify rules are enabled and not filtered out
4. Check VS Code Output panel for scanning errors

### Slow Performance

1. Exclude unnecessary files via `code-analyzer.yml` patterns
2. Disable auto-scan on save for large workspaces
3. Scan individual files/folders instead of entire workspace
4. Check system resources (CPU, memory)

### Plugin Not Found

If extension reports CLI plugin not found:

1. Verify plugin installation: `sf plugins list | grep scanner`
2. Reinstall plugin: `sf plugins install @salesforce/sfdx-scanner --force`
3. Check Salesforce CLI version compatibility
4. Restart VS Code

## Best Practices

1. **Configure Rules**: Customize `code-analyzer.yml` to match your team's
   standards
2. **Regular Scanning**: Scan code regularly during development, not just before
   commits
3. **Fix High Priority**: Address High and Critical severity violations first
4. **Use Tags**: Leverage rule tags (e.g., "Recommended") to focus on important
   rules
5. **Review Results**: Don't blindly fix all violations; understand rule
   rationale
6. **Exclude Patterns**: Exclude generated files and third-party code from
   scanning

## Related Documentation

- **[Salesforce CLI Commands](SFCLI.md)** - Command-line usage of Code Analyzer
- **[Code Analyzer Configuration](CODE_ANALYZER_CONFIG.md)** - Complete
  configuration reference
- **[PMD Engine](PMD.md)** - PMD rules and configuration
- **[ESLint Engine](ESLINT.md)** - ESLint rules for JavaScript/TypeScript/LWC
