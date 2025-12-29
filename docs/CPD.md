# CPD Engine Quick Reference for AI Agents

## Overview

The Copy/Paste Detector (CPD) engine identifies blocks of duplication across
files written in various languages. CPD helps you find duplicated code for
refactoring opportunities.

**Reference:**
[CPD Engine](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/engine-cpd.html)

**Purpose:** Duplicate code detection across multiple languages for refactoring.

## Supported Languages

Code Analyzer supports CPD for the following languages:

- **Apex** - `.cls`, `.trigger`
- **HTML** - `.html`, `.htm`, `.xhtml`, `.xht`, `.shtml`, `.cmp`
- **JavaScript** - `.js`, `.cjs`, `.mjs`
- **TypeScript** - `.ts`
- **Visualforce** - `.page`, `.component`
- **XML** - `.xml`

## Engine Configuration

Configure CPD in `code-analyzer.yml`:

```yaml
engines:
    cpd:
        disable_engine: false # Set true to disable CPD engine
        java_command: null # Auto-discovered if null, or specify path
        file_extensions: # See default values below
            apex: ['.cls', '.trigger']
            html: ['.html', '.htm', '.xhtml', '.xht', '.shtml', '.cmp']
            javascript: ['.js', '.cjs', '.mjs']
            typescript: ['.ts']
            visualforce: ['.page', '.component']
            xml: ['.xml']
        minimum_tokens: # Minimum tokens threshold per language
            apex: 100
            html: 100
            javascript: 100
            typescript: 100
            visualforce: 100
            xml: 100
        skip_duplicate_files: false # Ignore same-name/length files
```

## Configuration Properties

| Property               | Type    | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------- | ------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `disable_engine`       | boolean | false     | Whether to turn off the 'cpd' engine so that it is not included when running Code Analyzer commands                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `java_command`         | string  | null      | Indicates the specific 'java' command associated with the JRE or JDK to use for the 'cpd' engine. May be provided as the name of a command that exists on the path, or an absolute file path location. If unspecified, or specified as null, then an attempt will be made to automatically discover a 'java' command from your environment                                                                                                                                                                                                                                                                                                         |
| `file_extensions`      | object  | See below | Specifies the list of file extensions to associate to each rule language. The rule(s) associated with a given language will run against all the files in your workspace containing one of the specified file extensions. Each file extension can only be associated to one language. If a specific language is not specified, then a set of default file extensions for that language will be used                                                                                                                                                                                                                                                 |
| `minimum_tokens`       | object  | See below | Specifies the minimum tokens threshold for each rule language. The minimum tokens threshold is the number of tokens required to be in a duplicate block of code in order to be reported as a violation. The concept of a token may be defined differently per language, but in general it is a distinct basic element of source code. For example, this could be language specific keywords, identifiers, operators, literals, and more. See [PMD CPD documentation](https://docs.pmd-code.org/latest/pmd_userdocs_cpd.html) to learn more. If a value for a language is unspecified, then the default value of 100 will be used for that language |
| `skip_duplicate_files` | boolean | false     | Indicates whether to ignore multiple copies of files of the same name and length                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

**Default file_extensions:**

```yaml
file_extensions:
    apex: ['.cls', '.trigger']
    html: ['.html', '.htm', '.xhtml', '.xht', '.shtml', '.cmp']
    javascript: ['.js', '.cjs', '.mjs']
    typescript: ['.ts']
    visualforce: ['.page', '.component']
    xml: ['.xml']
```

**Default minimum_tokens:**

```yaml
minimum_tokens:
    apex: 100
    html: 100
    javascript: 100
    typescript: 100
    visualforce: 100
    xml: 100
```

## Usage

After configuration in `code-analyzer.yml`:

```bash
# Run Code Analyzer (includes CPD rules)
sf scanner:run

# View detailed output (recommended for CPD)
sf scanner:run --view detail
```

### Recommended: Use Detail View

When running Code Analyzer with CPD, we recommend using the `--view detail`
flag, which makes it easier to review the output. The detail view includes:

- Files containing duplication
- Location of duplicate blocks
- Token counts and other metadata

## Violation Output

CPD violations include:

- **Files** - The files in which the duplication was found
- **Location** - The location of the duplicate blocks within those files
- **Token count** - The number of tokens in the duplicated block

Check the `locations` section of the violation output for the files that contain
the duplication.

## Rule Customization

CPD rules can be customized (severity, tags) using the same process as ESLint
and Regex engines:

```yaml
rules:
    cpd:
        RuleName:
            severity: 'High' # or 1-5
            tags: ['CodeStyle', 'Recommended']
```

For information on how to modify rule settings, such as their severity or tags,
see [Code Analyzer Configuration](CODE_ANALYZER_CONFIG.md). While the examples
show modifying rules for the ESLint and Regex engines, you use the same process
to modify CPD rules.

## Listing CPD Rules

To view detailed information about the CPD rules for all available languages:

```bash
sf scanner:rule:list --engine cpd
```

## Important Notes

- **Tokens:** The concept of a token may be defined differently per language,
  but in general it is a distinct basic element of source code (keywords,
  identifiers, operators, literals, etc.)
- **Threshold:** The `minimum_tokens` threshold determines how large a duplicate
  block must be to be reported as a violation
- **Language-specific:** Each language has its own token definition and default
  threshold
- **File extensions:** Each file extension can only be associated to one
  language
- **Java requirement:** CPD requires Java (JRE or JDK) to run. The
  `java_command` property allows you to specify which Java command to use, or it
  will be auto-discovered if not specified
- **Skip duplicate files:** When `skip_duplicate_files` is true, multiple copies
  of files with the same name and length are ignored

## Related Documentation

- **[Code Analyzer Configuration](CODE_ANALYZER_CONFIG.md)** - Complete
  `code-analyzer.yml` configuration reference including CPD engine settings
- **[PMD Quick Reference](PMD.md#cpd-copy-paste-detector)** - PMD CPD CLI usage
  and suppression details
- **[ESLint Engine](ESLINT.md)** - Similar rule customization patterns for
  ESLint
- **[Regex Engine](REGEX.md)** - Similar rule customization patterns for Regex
