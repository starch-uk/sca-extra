# pnpm Reference

## Core Concepts

- **Content-addressable store**: Single copy per package version, hard-linked to
  projects. 100 projects using same dep = 1 disk copy.
- **Install stages**: 1) Resolve deps → 2) Calculate structure → 3) Hard-link
  from store
- **Non-flat node_modules**: Symlinks for direct deps only; prevents phantom
  dependencies. Fallback: `node-linker=hoisted`

## Feature Comparison

| Feature                                                                 | pnpm | Yarn        | npm |
| ----------------------------------------------------------------------- | ---- | ----------- | --- |
| Workspace/Isolated node_modules/Hoisted/Lockfile/Overrides/Dynamic exec | ✅   | ✅          | ✅  |
| Plug'n'Play                                                             | ✅   | ✅(default) | ❌  |
| Auto-install peers                                                      | ✅   | ❌          | ✅  |
| Zero-Installs                                                           | ❌   | ✅          | ❌  |
| Patching deps                                                           | ✅   | ✅          | ❌  |
| Node.js version mgmt                                                    | ✅   | ❌          | ❌  |
| Content-addressable storage/Side-effects cache/Catalogs/Config deps     | ✅   | ❌          | ❌  |

## Installation

**Requires**: Node.js v18.12+ (unless standalone/@pnpm/exe)

```bash
# Corepack (recommended)
npm i -g corepack@latest && corepack enable pnpm && corepack use pnpm@latest-10

# npm
npm i -g pnpm@latest-10

# Homebrew/winget/scoop/choco/volta
brew install pnpm | winget install pnpm.pnpm | scoop install pnpm | choco install pnpm | volta install pnpm

# Update
pnpm self-update
```

**Compatibility**: pnpm 10 requires Node.js 18+

## CLI Commands

### Package Management

```bash
# Install
pnpm install [--frozen-lockfile|--lockfile-only|--prefer-offline|--offline|--ignore-scripts|--no-optional|--production|--shamefully-hoist]
pnpm i -r                              # All workspaces
pnpm i --filter <sel>                  # Filtered

# Add
pnpm add <pkg>[@version|@tag]          # deps
pnpm add -D|-O|-g <pkg>                # dev|optional|global
pnpm add <pkg> --save-exact|--save-peer|--no-save
pnpm add jsr:@scope/pkg | ./path | file:./path | <tarball-url> | git+<url> | github:user/repo | workspace:*

# Update
pnpm up [<pkg>] [--latest|--interactive|--no-save] [-r|--filter <sel>]

# Remove
pnpm rm <pkg> [--save-dev|--save-optional|-g|-r|--filter <sel>]

# Link/Unlink
pnpm link <path>|-g                    # Link local/to global
pnpm link <pkg-name>                   # Link from global
pnpm unlink [<pkg>] [-g]

# Other
pnpm import                            # From npm/yarn lockfile
pnpm rebuild [<pkg>] [-r|--filter]
pnpm prune [--production|--no-optional]
pnpm fetch [--frozen-lockfile]
pnpm dedupe [--check]
pnpm install-test | pnpm it            # Install + test
```

### Patching

```bash
pnpm patch <pkg>[@ver]                 # Create temp edit dir
pnpm patch-commit <path>               # Save patch to patches/
pnpm patch-remove <pkg>                # Remove patch
```

### Inspection

```bash
pnpm list [<pkg>] [--depth=N|--long|--json|--parseable|-g|--prod|--dev] [-r|--filter]
pnpm outdated [--long|--json] [-r|--filter]
pnpm why <pkg> [--json|--find-by=<finder>] [-r|--filter]
pnpm licenses list [--json|--prod|--dev] [-r|--filter]
pnpm audit [--fix|--audit-level <lvl>|--json|--prod] [-r|--filter]
```

### Scripts

```bash
pnpm run <script> [-- <args>] [--silent|--if-present|--parallel|--stream|-r|--filter]
pnpm <script>                          # Shorthand if no cmd conflict
pnpm test|t | pnpm start               # Run test/start script
pnpm exec <cmd>                        # Run in project context (node_modules/.bin in PATH)
pnpm dlx <pkg> [args]                  # Download+execute (like npx)
pnpm create <template> [args]          # Run create-<template>
```

### Publishing

```bash
pnpm publish [--dry-run|--access public|restricted|--tag <tag>|--no-git-checks|--force]
pnpm pack [--pack-destination <dir>]
```

### Build Scripts Security

```bash
pnpm approve-builds [<pkg>]            # Allow pkg build scripts
pnpm ignored-builds                    # List blocked pkgs
```

### Store/Cache

```bash
pnpm store path|status|prune
pnpm cache-list|cache-list-registries|cache-view <pkg>|cache-delete <pkg>
pnpm cat-file|cat-index <hash>
pnpm find-hash <pkg>
```

### Environment

```bash
pnpm env use <ver>|lts|latest [-g]     # Install/use Node.js
pnpm env list|remove <ver>
```

### Other

```bash
pnpm root [-g] | pnpm bin [-g]
pnpm init [-y]
pnpm deploy <dir> [--filter|--prod]    # Deploy pkg with deps
pnpm doctor                            # Check issues
pnpm config get|set|delete|list|edit [--global]
pnpm setup                             # Setup shell
pnpm completion <shell>                # Generate completions
pnpm -C <path>|--dir <path>            # Run in different dir
pnpm -w|--workspace-root               # Run in workspace root
```

## Configuration

**Files**: `.npmrc` (project/global), `pnpm-workspace.yaml`, env vars, CLI flags

### Key Settings (.npmrc)

```ini
# Store
store-dir=/path/.pnpm-store
package-import-method=hardlink|copy|clone-or-copy

# Node modules structure
node-linker=isolated|hoisted|pnp
shamefully-hoist=true|false
hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*

# Workspace
link-workspace-packages=true
prefer-workspace-packages=true
shared-workspace-lockfile=true
save-workspace-protocol=true

# Peers
auto-install-peers=true
strict-peer-dependencies=true

# Lockfile
frozen-lockfile=true
lockfile-only=true

# Registry
registry=<url>
@scope:registry=<url>

# Install
save-exact=true
save-prefix=^
ignore-scripts=true
side-effects-cache=true

# Engine
engine-strict=true
use-node-version=20.10.0

# Security
only-built-dependencies[]=pkg
ignored-built-dependencies[]=pkg
minimum-release-age=7d

# Performance
network-concurrency=16
workspace-concurrency=4
resolution-mode=highest|lowest-direct
git-branch-lockfile=true
```

## Workspaces

### pnpm-workspace.yaml

```yaml
packages:
    - 'packages/*'
    - 'apps/*'
    - '!**/test/**'

catalog:
    react: ^18.3.1
    typescript: ^5.0.0

configDependencies:
    my-configs: '1.0.0+sha512-<checksum>'

onlyBuiltDependencies: [pkg-name]
ignoredBuiltDependencies: [pkg-name]

# All .npmrc settings also valid here
link-workspace-packages: true
node-linker: isolated
public-hoist-pattern: ['*eslint*']
```

### Workspace Protocol

```json
{
    "dependencies": {
        "pkg": "workspace:*", // Any version
        "pkg": "workspace:^1.0.0", // Matching range
        "alias": "workspace:pkg@*", // Alias
        "pkg": "workspace:../pkg" // Relative path
    }
}
```

On publish: `workspace:*` → `1.5.0`, `workspace:~` → `~1.5.0`, `workspace:^` →
`^1.5.0`

### Filtering

```bash
pnpm --filter <pkg-name> <cmd>
pnpm --filter "@scope/*" <cmd>
pnpm --filter ./path <cmd>
pnpm --filter "<pkg>..." <cmd>         # Pkg + deps
pnpm --filter "...<pkg>" <cmd>         # Pkg + dependents
pnpm --filter "<pkg>^..." <cmd>        # Deps only
pnpm --filter "...^<pkg>" <cmd>        # Dependents only
pnpm --filter "!<pkg>" <cmd>           # Exclude
pnpm --filter <a> --filter <b> <cmd>   # Multiple
```

## pnpmfile (.pnpmfile.cjs)

```javascript
module.exports = {
    hooks: {
        readPackage(pkg, ctx) {
            if (pkg.name === 'some-pkg') {
                pkg.dependencies['missing'] = '^1.0.0';
            }
            return pkg;
        },
        afterAllResolved(lockfile, ctx) {
            return lockfile;
        },
    },
    finders: {
        // v10.16+
        react17: (ctx) =>
            ctx.readManifest().peerDependencies?.react === '^17.0.0',
        mitLicense: (ctx) => ctx.readManifest().license === 'MIT',
    },
};
```

Usage: `pnpm why --find-by=react17`

## package.json Extensions

```json
{
    "engines": { "node": ">=18.12", "pnpm": ">=9" },
    "devEngines": {
        "runtime": {
            "name": "node",
            "version": "^24.4.0",
            "onFail": "download"
        }
    },
    "packageManager": "pnpm@9.0.0",
    "pnpm": {
        "overrides": { "lodash": "^4.17.21" },
        "peerDependencyRules": {
            "allowedVersions": { "react": "17 || 18" },
            "ignoreMissing": ["@types/*"]
        }
    }
}
```

## Recipes

### CI (GitHub Actions)

```yaml
- uses: pnpm/action-setup@v2
  with: { version: 9 }
- uses: actions/setup-node@v4
  with: { node-version: 20, cache: 'pnpm' }
- run: pnpm install --frozen-lockfile
```

### Docker

```dockerfile
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm" PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY pnpm-lock.yaml package.json ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
CMD ["pnpm", "start"]
```

### Changesets

```bash
pnpm add -Dw @changesets/cli && pnpm changeset init
pnpm changeset                         # Create changeset
pnpm changeset version                 # Bump versions
pnpm publish -r                        # Publish all
```

### Shell Completions

```bash
pnpm completion bash > ~/pnpm.bash && echo 'source ~/pnpm.bash' >> ~/.bashrc
pnpm completion zsh > ~/.zsh/_pnpm && echo 'fpath+=~/.zsh' >> ~/.zshrc
pnpm completion fish > ~/.config/fish/completions/pnpm.fish
```

### Alias

```bash
alias pn=pnpm  # .bashrc/.zshrc
```

## Error Codes

| Code                                          | Cause                                  | Fix                                         |
| --------------------------------------------- | -------------------------------------- | ------------------------------------------- |
| ERR_PNPM_UNEXPECTED_STORE                     | node_modules linked to different store | Run `pnpm install`                          |
| ERR_PNPM_NO_MATCHING_VERSION_INSIDE_WORKSPACE | workspace dep version mismatch         | Update pkg versions or run `pnpm -r update` |
| ERR_PNPM_PEER_DEP_ISSUES                      | Missing/mismatched peers               | Install peers or use peerDependencyRules    |
| ERR_PNPM_OUTDATED_LOCKFILE                    | Lockfile out of sync                   | Run `pnpm install`                          |
| ERR_PNPM_TARBALL_INTEGRITY                    | Checksum mismatch                      | Run `pnpm store prune` then retry           |
| ERR_PNPM_MISMATCHED_RELEASE_CHANNEL           | Invalid use-node-version format        | Use `X.Y.Z` or `rc/X.Y.Z-rc.W`              |

## FAQ

- **Disk space with store?** Hard links = same bytes on disk, different paths.
  1MB pkg appears in store + project = 1MB total.
- **Windows?** Yes, uses junctions instead of symlinks.
- **Circular symlinks?** Avoided; deps placed alongside package, not nested.
- **Cross-drive?** Store must be same drive/filesystem or packages are copied.
- **Tool incompatibility?** Usually phantom dep issue. Fix:
  `node-linker=hoisted`, add missing dep, or use pnpmfile hook.

## Limitations

- npm lockfiles (`package-lock.json`, `npm-shrinkwrap.json`) ignored; use
  `pnpm import`
- `node_modules/.bin` files are shell scripts, not symlinks

## Uninstall

```bash
npm uninstall -g pnpm                  # If installed via npm
corepack disable                       # If via corepack
rm -rf $(pnpm store path)              # Remove store
rm ~/.npmrc                            # Remove global config
```
