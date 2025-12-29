# CI/CD Integration with Code Analyzer

## Overview

Integrating Salesforce Code Analyzer into Continuous Integration/Continuous
Deployment (CI/CD) pipelines enables automated static code analysis, ensuring
code quality and security standards are enforced before code is merged or
deployed.

**Reference:**
[Integrate Code Analyzer into CI/CD Pipelines](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/ci-cd-integration.html)

## Prerequisites

- CI/CD platform access (GitHub Actions, GitLab CI, Jenkins, Azure DevOps, etc.)
- Salesforce CLI available in CI/CD environment
- Access to source code repository

## Basic Integration

### Step 1: Install Salesforce CLI

Ensure Salesforce CLI is installed in your CI/CD environment:

**GitHub Actions:**

```yaml
- name: Install Salesforce CLI
  run: |
      npm install -g @salesforce/cli
      sf --version
```

**GitLab CI:**

```yaml
before_script:
    - npm install -g @salesforce/cli
    - sf --version
```

**Jenkins (using Docker):**

```groovy
sh 'npm install -g @salesforce/cli'
sh 'sf --version'
```

### Step 2: Install Code Analyzer Plugin

Install the Code Analyzer CLI plugin:

```bash
sf plugins install @salesforce/sfdx-scanner
```

### Step 3: Run Code Analysis

Execute Code Analyzer as part of your pipeline:

```bash
sf scanner:run --target "path/to/source" --format json --outfile scanner-results.json --violations-cause-error
```

The `--violations-cause-error` flag ensures the pipeline fails if violations are
found.

## GitHub Actions Integration

### Using Official GitHub Action

Salesforce provides an official GitHub Action for Code Analyzer:

```yaml
name: Code Analysis

on:
    pull_request:
        branches: [main, develop]
    push:
        branches: [main]

jobs:
    code-analyzer:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4

            - name: Setup Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: '18'

            - name: Install Salesforce CLI
              run: npm install -g @salesforce/cli

            - name: Install Code Analyzer Plugin
              run: sf plugins install @salesforce/sfdx-scanner

            - name: Run Code Analyzer
              uses: salesforce/code-analyzer-action@v1
              with:
                  target: 'force-app/main/default/classes'
                  format: 'json'
                  outfile: 'scanner-results.json'
                  violations-cause-error: true

            - name: Upload Results
              uses: actions/upload-artifact@v4
              if: always()
              with:
                  name: scanner-results
                  path: scanner-results.json
```

### Custom GitHub Action Workflow

For more control, use CLI commands directly:

```yaml
name: Code Analysis

on:
    pull_request:
        branches: [main]
    push:
        branches: [main]

jobs:
    analyze:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4

            - name: Setup Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: '18'

            - name: Install Salesforce CLI
              run: npm install -g @salesforce/cli

            - name: Install Code Analyzer Plugin
              run: sf plugins install @salesforce/sfdx-scanner

            - name: Run Code Analyzer
              run: |
                  sf scanner:run \
                    --target "force-app/main/default" \
                    --format json \
                    --outfile scanner-results.json \
                    --violations-cause-error \
                    --severity-threshold 2

            - name: Annotate Results
              if: always()
              run: |
                  if [ -f scanner-results.json ]; then
                    # Parse JSON and create annotations
                    cat scanner-results.json | jq -r '.violations[] | "::error file=\(.filePath),line=\(.line),col=\(.column)::\(.ruleName): \(.message)"'
                  fi

            - name: Upload Results
              uses: actions/upload-artifact@v4
              if: always()
              with:
                  name: scanner-results
                  path: scanner-results.json
```

## GitLab CI Integration

```yaml
stages:
    - analyze

code-analyzer:
    stage: analyze
    image: node:18
    before_script:
        - npm install -g @salesforce/cli
        - sf plugins install @salesforce/sfdx-scanner
    script:
        - sf scanner:run --target "force-app/main/default" --format json
          --outfile scanner-results.json --violations-cause-error
    artifacts:
        when: always
        paths:
            - scanner-results.json
        reports:
            codequality: scanner-results.json
    only:
        - merge_requests
        - main
```

## Jenkins Integration

### Declarative Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Code Analysis') {
            steps {
                sh '''
                    npm install -g @salesforce/cli
                    sf plugins install @salesforce/sfdx-scanner
                    sf scanner:run \
                        --target "force-app/main/default" \
                        --format json \
                        --outfile scanner-results.json \
                        --violations-cause-error
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'scanner-results.json', fingerprint: true
            publishHTML([
                reportName: 'Code Analyzer Results',
                reportDir: '.',
                reportFiles: 'scanner-results.json',
                keepAll: true
            ])
        }
    }
}
```

### Scripted Pipeline

```groovy
node {
    stage('Code Analysis') {
        sh 'npm install -g @salesforce/cli'
        sh 'sf plugins install @salesforce/sfdx-scanner'
        sh '''
            sf scanner:run \
                --target "force-app/main/default" \
                --format json \
                --outfile scanner-results.json \
                --violations-cause-error \
                --severity-threshold 2
        '''
    }

    stage('Archive Results') {
        archiveArtifacts artifacts: 'scanner-results.json', fingerprint: true
    }
}
```

## Azure DevOps Integration

```yaml
trigger:
    branches:
        include:
            - main
            - develop

pool:
    vmImage: 'ubuntu-latest'

steps:
    - task: NodeTool@0
      inputs:
          versionSpec: '18.x'
      displayName: 'Install Node.js'

    - script: |
          npm install -g @salesforce/cli
          sf plugins install @salesforce/sfdx-scanner
      displayName: 'Install Salesforce CLI and Code Analyzer'

    - script: |
          sf scanner:run \
            --target "force-app/main/default" \
            --format json \
            --outfile scanner-results.json \
            --violations-cause-error
      displayName: 'Run Code Analyzer'

    - task: PublishTestResults@2
      condition: always()
      inputs:
          testResultsFormat: 'JUnit'
          testResultsFiles: 'scanner-results.json'
          failTaskOnFailedTests: true
      displayName: 'Publish Results'
```

## Configuration in CI/CD

### Project Configuration File

Include `code-analyzer.yml` in your repository:

```yaml
# code-analyzer.yml
engines:
    pmd:
        custom_rulesets:
            - rulesets/design/InnerClassesCannotBeStatic.xml
            - rulesets/code-style/NoSingleLetterVariableNames.xml

rules:
    pmd:
        NoSingleLetterVariableNames:
            severity: 'High'
            tags: ['Recommended']
```

Code Analyzer automatically discovers this file in the project root.

### Environment-Specific Configuration

Use environment variables or separate config files for different environments:

```yaml
# .github/workflows/code-analyzer.yml
- name: Run Code Analyzer
  run: |
      sf scanner:run \
        --target "force-app/main/default" \
        --config-file "ci/code-analyzer.ci.yml" \
        --format json \
        --outfile scanner-results.json \
        --violations-cause-error
  env:
      SCANNER_LOG_LEVEL: 3
```

## Advanced Patterns

### Analyzing Only Changed Files

```yaml
- name: Get Changed Files
  id: changed-files
  uses: tj-actions/changed-files@v40
  with:
      files: |
          **/*.cls
          **/*.trigger

- name: Run Code Analyzer on Changed Files
  if: steps.changed-files.outputs.any_changed == 'true'
  run: |
      sf scanner:run \
        --target "${{ steps.changed-files.outputs.all_changed_files }}" \
        --format json \
        --outfile scanner-results.json \
        --violations-cause-error
```

### Filtering by Severity

Only fail on High/Critical severity violations:

```bash
sf scanner:run \
  --target "force-app/main/default" \
  --severity-threshold 2 \
  --format json \
  --outfile scanner-results.json \
  --violations-cause-error
```

### Parallel Analysis

Run multiple engines in parallel:

```yaml
- name: Run PMD Analysis
  run: |
      sf scanner:run \
        --target "force-app/main/default" \
        --engine pmd \
        --format json \
        --outfile pmd-results.json &

- name: Run ESLint Analysis
  run: |
      sf scanner:run \
        --target "force-app/main/default/lwc" \
        --engine eslint \
        --format json \
        --outfile eslint-results.json &

- name: Wait for Analysis
  run: wait
```

### SARIF for Security Scanning

Generate SARIF format for security scanning integration:

```bash
sf scanner:run \
  --target "force-app/main/default" \
  --format sarif \
  --outfile security-results.sarif \
  --category Security
```

## Best Practices

1. **Fail Fast**: Use `--violations-cause-error` to prevent merging code with
   violations
2. **Configure Thresholds**: Set appropriate severity thresholds for your team
3. **Cache Dependencies**: Cache Salesforce CLI and plugins to speed up builds
4. **Artifact Results**: Store scan results as artifacts for review and trending
5. **Baseline Violations**: Accept baseline violations and only fail on new
   violations
6. **Parallel Execution**: Run Code Analyzer in parallel with other checks when
   possible
7. **Report Annotations**: Use platform-specific annotations (GitHub, GitLab)
   for inline comments
8. **Regular Updates**: Keep Salesforce CLI and Code Analyzer plugin updated

## Handling Violations

### Fail on All Violations

```bash
sf scanner:run --violations-cause-error
```

### Fail Only on High/Critical

```bash
sf scanner:run --severity-threshold 2 --violations-cause-error
```

### Baseline Approach

Accept existing violations, fail only on new ones:

```yaml
- name: Run Code Analyzer
  run: |
      sf scanner:run --target "force-app/main/default" --format json --outfile current-results.json

      # Compare with baseline
      if [ -f baseline-results.json ]; then
        # Custom script to compare and fail only on new violations
        python scripts/compare-violations.py baseline-results.json current-results.json
      else
        cp current-results.json baseline-results.json
      fi
```

## Related Documentation

- **[Salesforce CLI Commands](SFCLI.md)** - Complete CLI command reference
- **[Code Analyzer Configuration](CODE_ANALYZER_CONFIG.md)** - Configuration
  file reference
- **[PMD Engine](PMD.md)** - PMD engine details
- **[ESLint Engine](ESLINT.md)** - ESLint engine configuration
