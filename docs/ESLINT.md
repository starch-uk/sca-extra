# ESLint Reference

## Overview

ESLint: JS/TS/LWC static analysis. Code Analyzer v5: v8+v9 support, defaults v9.

**Reference:**
[ESLint Engine](https://developer.salesforce.com/docs/platform/salesforce-code-analyzer/guide/engine-eslint.html)
**typescript-eslint**: Parser (`@typescript-eslint/parser`) + 100+ rules
(`@typescript-eslint/eslint-plugin`) + type-aware linting + configs
(recommended/strict/stylistic) + Project Service.

## Prerequisites

**v9**: Node `^18.18.0|^20.9.0|>=21.1.0`+SSL | **v8**: Node
`^12.22.0|^14.17.0|^16.0.0|^18.0.0|^20.0.0`

## Quick Start

```bash
npm init @eslint/config@latest  # OR: npm i -D eslint @eslint/js && npx eslint .
# TypeScript: npm i -D eslint @eslint/js typescript typescript-eslint
```

**eslint.config.mjs** (TS):

```javascript
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended
);
```

## Code Analyzer Config (`code-analyzer.yml`)

```yaml
engines:
  eslint:
    disable_engine: false
    eslint_config_file: null  # abs/rel to config_root
    auto_discover_eslint_config: false
    disable_javascript_base_config: false
    disable_lwc_base_config: false
    disable_slds_base_config: false
    disable_typescript_base_config: false
    file_extensions: {javascript:['.js','.cjs','.mjs'],typescript:['.ts'],html:['.html','.htm','.cmp'],css:['.css','.scss'],other:[]}
```

| Property                      | Type | Default | Desc                                  |
| ----------------------------- | ---- | ------- | ------------------------------------- |
| `eslint_config_file`          | str  | null    | Config path                           |
| `eslint_ignore_file`          | str  | null    | Legacy .eslintignore (v8, deprecated) |
| `auto_discover_eslint_config` | bool | false   | Auto-discover configs                 |
| `disable_*_base_config`       | bool | false   | Disable bundled rules                 |

## Config Formats

### Flat (v9) - `eslint.config.js`

```javascript
export default [
    {
        files: ['**/*.js'],
        languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
        rules: { 'no-console': 'error' },
    },
];
```

Array-based, `files` matching, `languageOptions` replaces `parserOptions`+`env`,
no cascading.

### Flat TS Config

```javascript
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts'],
        rules: { '@typescript-eslint/no-explicit-any': 'warn' },
    }
);
```

### Legacy (v8) - `.eslintrc.json`

```json
{
    "env": { "browser": true },
    "extends": ["eslint:recommended"],
    "parserOptions": { "ecmaVersion": 2021 },
    "rules": { "no-console": "error" }
}
```

Cascading, `extends`, `env`, `.eslintignore`.

### Legacy TS Config

```json
{
    "parser": "@typescript-eslint/parser",
    "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    "parserOptions": { "project": "./tsconfig.json" },
    "plugins": ["@typescript-eslint"]
}
```

**Migration**: `npx @eslint/migrate-config` | Legacy files→v8, flat→v9

## Version Detection

No `code-analyzer.yml`: v9 default. With: `auto_discover`→format determines
version; `eslint_config_file`→format; `.eslintignore` only→v8.

## Config Merging

Array concat (flat) → object merge (later wins) → plugin version comparison
(higher wins) → your severity overrides.

## ESLint Process

Parse→AST → Traverse→rules visit nodes → Report→violations → Fix→`--fix`

## Rules

Severity: `off`/0, `warn`/1, `error`/2

```javascript
rules:{'no-console':'error','max-len':['error',{max:100}],'@typescript-eslint/no-explicit-any':['warn',{ignoreRestArgs:true}]}
```

CA mapping: warn→Info(5), error→High(2)

### Rule Override (`code-analyzer.yml`)

```yaml
rules:
  eslint:
    RuleName: {severity:'High',tags:['Recommended']}
```

Only severity/tags; rule options in ESLint config.

## Bundled Rules

JS: Standard ESLint | TS: @typescript-eslint | LWC:
@salesforce/eslint-config-lwc + @lwc/eslint-plugin-lwc-platform | SLDS:
@salesforce-ux/eslint-plugin-slds List: `sf scanner:rule:list --engine eslint`

## Plugins

### Flat

```javascript
import plugin from 'eslint-plugin-name';
export default [{ plugins: { name: plugin }, rules: { 'name/rule': 'error' } }];
```

### Legacy

```json
{ "plugins": ["name"], "rules": { "name/rule": "error" } }
```

Package: `eslint-plugin-{name}` → ref: `{name}` | Rule: `{plugin}/{rule}`

## Parser Config

### Flat

```javascript
import tsParser from '@typescript-eslint/parser';
export default [
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: { project: './tsconfig.json' },
        },
    },
];
```

### TS Parser Options

```javascript
parserOptions:{
  project:['./tsconfig.json'],  // or projectService:true (recommended for large projects)
  tsconfigRootDir:import.meta.dirname,
  ecmaVersion:2022,sourceType:'module',
  extraFileExtensions:['.vue'],
  ecmaFeatures:{jsx:true}
}
```

**Project Service**: Auto-detects projects, better perf, monorepo support.
`projectService:true`

## Language Options

```javascript
languageOptions:{ecmaVersion:2022,sourceType:'module',globals:{console:'readonly'},parser:p,parserOptions:{ecmaFeatures:{jsx:true}}}
```

Use `globals` pkg: `...globals.browser`, `...globals.node`

## Ignores

**Flat**: `export default [{ignores:['dist/**','node_modules/**']}];`
**Legacy**: `.eslintignore` file. Glob syntax, `!` negation.

## Inline Comments

```javascript
// eslint-disable-next-line rule
/* eslint-disable rule */
/* eslint-enable rule */
// eslint-disable-next-line r1,r2 -- reason
```

## SLDS Rules

`@salesforce-ux/eslint-plugin-slds`: `enforce-bem-usage`,
`no-deprecated-classes-slds2`, `modal-close-button-issue` Disable:
`disable_slds_base_config:true`

## LWC Rules

`@lwc/eslint-plugin-lwc` (v3+: ESLint v9 only) **Base**:
`no-api-reassignments`,`no-deprecated`,`no-document-query`,`valid-api/track/wire`
**Best**: `no-async-operation`,`no-inner-html`,`no-leaky-event-listeners`
**Compat**: `no-async-await`,`no-for-of` (IE11) | **SSR**:
`ssr-no-restricted-browser-globals` Disable: `disable_lwc_base_config:true`

## TypeScript ESLint

### Configs

```javascript
tseslint.configs.recommended; // balanced
tseslint.configs.strict; // + opinionated bug-catching
tseslint.configs.stylistic; // consistent style
```

Combine:
`tseslint.config(eslint.configs.recommended,...tseslint.configs.recommended,...tseslint.configs.strict)`

### Rule Metadata

🔧fixable | 💡suggestions | 💭type-checked | 🧱extension | 💀deprecated

### Extension Rules

Disable base when using TS version:

```javascript
rules:{'no-unused-vars':'off','@typescript-eslint/no-unused-vars':'error'}
```

## Typed Linting

### Setup

```javascript
export default tseslint.config(
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    ...tseslint.configs.recommendedTypeChecked
);
```

Or use Project Service: `parserOptions:{projectService:true}`

### Type-Aware Rules

`no-unsafe-assignment`,`no-unsafe-call`,`no-unsafe-member-access`,`no-unsafe-return`,`no-floating-promises`,`await-thenable`

## Migration v8→v9

| v8              | v9                              |
| --------------- | ------------------------------- |
| `.eslintrc.*`   | `eslint.config.js`              |
| Cascading       | No cascading                    |
| `.eslintignore` | `ignores` prop                  |
| `env`           | `languageOptions.globals`       |
| `parserOptions` | `languageOptions.parserOptions` |
| `extends`       | Import+spread                   |
| `overrides`     | Multiple config objects         |

Tool: `npx @eslint/migrate-config`

## CLI

```bash
eslint [opts] [file|dir|glob]*
```

| Opt                  | Desc                                |
| -------------------- | ----------------------------------- |
| `--fix`              | Auto-fix                            |
| `--fix-dry-run`      | Preview                             |
| `--format <f>`       | stylish,json,compact,unix,tap,junit |
| `--config <p>`       | Config path                         |
| `--cache`            | Cache                               |
| `--quiet`            | Errors only                         |
| `--print-config <f>` | Debug                               |
| `--debug`            | Verbose                             |

Exit: 0=ok, 1=errors, 2=fatal

## Formatters

Built-in: stylish(default),compact,json,unix,tap,junit Custom:
`module.exports=(results,data)=>results.map(r=>`${r.filePath}:${r.messages.length}`).join('\n');`

## Bulk Suppressions

```json
{ "suppressions": [{ "ruleId": "no-console", "files": ["legacy/**/*.js"] }] }
```

## Integrations

Editors: VSCode,WebStorm,Sublime,Vim,Emacs | Build:
Webpack,Rollup,Vite,Gulp,Grunt | CI: GH Actions,GitLab,Jenkins | Pre-commit:
Husky

## Debugging

```bash
eslint --print-config file.js  # merged config
eslint --debug src/            # verbose
npm ls eslint-plugin-name      # verify install
```

CA: `log_level:5`

| Issue                  | Fix                                         |
| ---------------------- | ------------------------------------------- |
| Config not found       | Check path,auto_discover,filename           |
| Plugin conflicts       | Disable base configs,check versions         |
| Rules not applying     | Check extensions,names,patterns             |
| Type-aware not working | Add project/projectService to parserOptions |
| Slow linting           | Use projectService:true                     |

| Error                                | Fix                                  |
| ------------------------------------ | ------------------------------------ |
| Cannot find module 'eslint-plugin-x' | `npm i -D eslint-plugin-x`           |
| Parsing error                        | Check parser,ecmaVersion             |
| Rule not defined                     | Check name,plugin loaded             |
| context.getScope not function        | Use `sourceCode.getScope(node)` (v9) |
| Parser requires project              | Add project/projectService           |

## Extending

### Custom Rule

```javascript
module.exports = {
    meta: {
        type: 'problem',
        docs: { description: '...' },
        fixable: 'code',
        schema: [],
        messages: { msg: '{{p}} err' },
    },
    create(ctx) {
        return {
            'CallExpr[callee.name="x"]'(n) {
                ctx.report({ node: n, messageId: 'msg', data: { p: 'v' } });
            },
        };
    },
};
```

### TS-Aware Rule

```javascript
import { ESLintUtils } from '@typescript-eslint/utils';
const createRule = ESLintUtils.RuleCreator((n) => `url/${n}`);
export default createRule({
    name: 'rule',
    meta: {
        type: 'problem',
        docs: { description: '...', requiresTypeChecking: true },
        messages: { e: 'err' },
        schema: [],
    },
    defaultOptions: [],
    create(ctx) {
        const svc = ESLintUtils.getParserServices(ctx);
        const chk = svc.program.getTypeChecker();
        return {};
    },
});
```

### Test Rules

```javascript
import { RuleTester } from '@typescript-eslint/rule-tester';
new RuleTester({
    languageOptions: {
        parser: '@typescript-eslint/parser',
        parserOptions: { project: './tsconfig.json' },
    },
}).run('rule', rule, { valid: [], invalid: [] });
```

### Processors

```javascript
module.exports = {
    processors: {
        '.md': {
            preprocess(t, f) {
                return [];
            },
            postprocess(m, f) {
                return m[0];
            },
            supportsAutofix: true,
        },
    },
};
```

### Shareable Configs

Package: `eslint-config-{name}` → ref: `{name}`

```javascript
export default [{ rules: { 'no-console': 'error' } }];
```

## Node.js API

```javascript
import { ESLint } from 'eslint';
const e = new ESLint({ fix: true });
const r = await e.lintFiles(['src/**/*.js']);
await ESLint.outputFixes(r);
console.log((await e.loadFormatter('json')).format(r));
```

| Opt        | Type | Desc        |
| ---------- | ---- | ----------- |
| cwd        | str  | Working dir |
| baseConfig | obj  | Base config |
| fix        | bool | Apply fixes |
| cache      | bool | Caching     |

Methods: `lintFiles(patterns)→LintResult[]` | `lintText(code,{filePath})` |
`loadFormatter(name)` | `calculateConfigForFile(path)` | `isPathIgnored(path)` |
`ESLint.outputFixes(results)`

### LintResult

`{filePath,messages[],errorCount,warningCount,fixableErrorCount,fixableWarningCount}`

### Message

`{ruleId,severity:1|2,message,line,column,endLine?,endColumn?,fix?:{range,text}}`

## MCP Server

`npm i -g @eslint/mcp-server` — AI tool protocol for ESLint.

## Feature Flags

`ESLINT_FEATURE_FLAG=name eslint .` — experimental features.

## Packages

**Core**: `@typescript-eslint/eslint-plugin`(rules) |
`@typescript-eslint/parser` | `typescript-eslint`(main) **Dev**:
`@typescript-eslint/utils`(RuleCreator,getParserServices) |
`@typescript-eslint/rule-tester` **Infra**: `scope-manager` |
`typescript-estree`(AST) | `tsconfig-utils` | `type-utils` | `project-service`
**Migration**: `@typescript-eslint/eslint-plugin-tslint`

## TypeScript ESTree AST

Additional nodes:
`TSInterfaceDeclaration`,`TSTypeAliasDeclaration`,`TSEnumDeclaration`,`TSModuleDeclaration`,`TSDecorator`,`TSTypeParameter`
Spec: typescript-eslint.io/packages/typescript-estree/ast-spec

## Glossary

AST=code tree | Rule=pattern checker | Plugin=rules+processors+configs |
Parser=source→AST | Processor=extract JS from non-JS | Formatter=output format |
Severity=off/warn/error | Flat Config=v9 array | Legacy Config=v8 .eslintrc |
Extension Rule=TS replacing base | Type-Checked=needs type info | Project
Service=auto project detection | ESTree=JS AST format | TS ESTree=TS AST in
ESTree format

## Refs

eslint.org/docs | typescript-eslint.io | typescript-eslint.io/rules |
typescript-eslint.io/getting-started/typed-linting |
typescript-eslint.io/users/shared-configs
