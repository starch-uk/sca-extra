# PNPM Documentation

Comprehensive reference guide for pnpm (Performant Node Package Manager) - a fast, disk space-efficient package manager for JavaScript and Node.js projects. This guide is optimized for AI agents to quickly understand pnpm's features, commands, and configuration.

## Table of Contents

- [Core Concepts](#core-concepts)
- [Feature Comparison](#feature-comparison)
- [Installation](#installation)
- [pnpm CLI](#pnpm-cli)
- [CLI Commands](#cli-commands)
- [Configuration](#configuration)
- [Settings Reference](#settings-reference)
- [Workspaces](#workspaces)
- [Advanced Features](#advanced-features)
  - [Filtering](#filtering)
  - [Catalogs](#catalogs)
  - [Config Dependencies](#config-dependencies)
  - [Finder Functions](#finder-functions-v1016)
  - [Aliases](#aliases)
  - [Command Line Tab Completion](#command-line-tab-completion)
  - [Git Branch Lockfiles](#git-branch-lockfiles)
- [Package Manifest](#package-manifest)
- [pnpm-workspace.yaml](#pnpm-workspaceyaml)
- [pnpmfile](#pnpmfile)
- [Scripts](#scripts)
- [Common Recipes](#common-recipes)
  - [Continuous Integration](#continuous-integration)
  - [Using Changesets](#using-changesets)
  - [Docker](#docker)
  - [Podman](#podman)
  - [Supply Chain Security](#supply-chain-security)
  - [TypeScript](#typescript)
  - [Git](#git)
- [Error Codes](#error-codes)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Limitations](#limitations)
- [Symlinked node_modules Structure](#symlinked-nodemodules-structure)
- [Peer Dependency Resolution](#peer-dependency-resolution)
- [Uninstalling pnpm](#uninstalling-pnpm)

## Core Concepts

### Content-Addressable Store

pnpm stores all package files in a content-addressable store on disk. When multiple projects use the same dependency:
- Only one copy exists on disk (hard-linked)
- Different versions share common files (only diffs stored)
- Significantly reduces disk space usage

**Example:** 100 projects using `lodash@4.17.21` = 1 copy on disk, not 100.

### Installation Process (3 Stages)

1. **Dependency Resolution** - Identifies and fetches all required dependencies to store
2. **Directory Structure Calculation** - Determines `node_modules` structure
3. **Linking Dependencies** - Hard-links from store to `node_modules`

This approach is faster than traditional resolve → fetch → write processes.

### Non-Flat node_modules Structure

Unlike npm/Yarn Classic (which hoist all packages), pnpm:
- Uses symlinks to add only direct dependencies to root
- Prevents access to undeclared dependencies
- Enhances security and prevents phantom dependencies

**Fallback:** If tools don't work with symlinks, set `nodeLinker: "hoisted"` in config.

## Feature Comparison

Comparison of pnpm features with Yarn and npm.

| Feature | pnpm | Yarn | npm | Notes |
|---------|------|------|-----|-------|
| Workspace support | ✅ | ✅ | ✅ | |
| Isolated node_modules | ✅ | ✅ | ✅ | Default in pnpm |
| Hoisted node_modules | ✅ | ✅ | ✅ | Default in npm |
| Plug'n'Play | ✅ | ✅ | ❌ | Default in Yarn |
| Auto-installing peers | ✅ | ❌ | ✅ | |
| Zero-Installs | ❌ | ✅ | ❌ | |
| Patching dependencies | ✅ | ✅ | ❌ | |
| Managing Node.js versions | ✅ | ❌ | ❌ | |
| Managing versions of itself | ✅ | ✅ | ❌ | |
| Has a lockfile | ✅ | ✅ | ✅ | pnpm-lock.yaml, yarn.lock, package-lock.json |
| Overrides support | ✅ | ✅ | ✅ | Known as "resolutions" in Yarn |
| Content-addressable storage | ✅ | ✅ | ❌ | Yarn uses CAS when nodeLinker is set to pnpm |
| Dynamic package execution | ✅ | ✅ | ✅ | pnpm dlx, yarn dlx, npx |
| Side-effects cache | ✅ | ❌ | ❌ | |
| Catalogs | ✅ | ❌ | ❌ | |
| Config dependencies | ✅ | ❌ | ❌ | |
| JSR registry support | ✅ | ✅ | ❌ | |
| Auto-install before script run | ✅ | ❌ | ❌ | In Yarn, Plug'n'Play ensures dependencies are always up to date |
| Hooks | ✅ | ✅ | ❌ | |
| Listing licenses | ✅ | ✅ | ❌ | pnpm supports it via `pnpm licenses list`. Yarn has a plugin for it |

**Note:** This comparison includes only features likely to be used frequently.

### Key Differentiators

**pnpm advantages:**
- **Content-addressable storage** - Most efficient disk usage
- **Strict dependency isolation** - Prevents phantom dependencies
- **Catalogs** - Centralized version management
- **Config dependencies** - Share configuration across projects
- **Side-effects cache** - Faster installations
- **Node.js version management** - Built-in via `pnpm env`

**Shared with Yarn:**
- Workspace support
- Plug'n'Play support
- Patching dependencies
- Hooks system
- JSR registry support

**Shared with npm:**
- Workspace support
- Auto-installing peers
- Overrides support
- Dynamic package execution

## Installation

### Prerequisites

- Node.js v18.12+ (unless using standalone script or `@pnpm/exe`)

### Standalone Script

**POSIX Systems (Linux/macOS):**
```bash
curl -fsSL <install-script-url> | sh -
# Or with wget:
wget -qO- <install-script-url> | sh -
# Or with specific version:
curl -fsSL <install-script-url> | env PNPM_VERSION=<version> sh -
```

**Windows (PowerShell):**
```powershell
Invoke-WebRequest <install-script-url> -UseBasicParsing | Invoke-Expression
```

**Warning:** Windows Defender may block the executable. Prefer npm or Corepack installation on Windows.

**Windows Defender Exclusion (if using standalone):**
```powershell
# Run with administrator rights
Add-MpPreference -ExclusionPath $(pnpm store path)
```

**Docker Container:**
```bash
# bash
wget -qO- <install-script-url> | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -
# sh
wget -qO- <install-script-url> | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -
# dash
wget -qO- <install-script-url> | ENV="$HOME/.dashrc" SHELL="$(which dash)" dash -
```

**Tip:** After installation, use `pnpm env` to install Node.js.

### Via Corepack (Node.js 16.13+)

**Update Corepack first:**
```bash
npm install --global corepack@latest
```

**Enable pnpm:**
```bash
corepack enable pnpm
```

**Pin version in project:**
```bash
corepack use pnpm@latest-10
```

This adds `"packageManager"` field to `package.json` for reproducible versions.

**Note:** If Node.js was installed with `pnpm env`, Corepack won't be installed. Install it separately.

### Via npm

**Standard pnpm (requires Node.js):**
```bash
npm install -g pnpm@latest-10
```

**Standalone executable (no Node.js required):**
```bash
npx pnpm@latest-10 dlx @pnpm/exe@latest-10 setup
```

### Via Package Managers

**Homebrew:**
```bash
brew install pnpm
```

**winget (Windows):**
```bash
winget install -e --id pnpm.pnpm
```

**Scoop (Windows):**
```bash
scoop install nodejs-lts pnpm
```

**Chocolatey (Windows):**
```bash
choco install pnpm
```

**Volta:**
```bash
volta install pnpm
```

### Compatibility

| Node.js    | pnpm 8 | pnpm 9 | pnpm 10 |
| ---------- | ------ | ------ | ------- |
| Node.js 14 | ❌      | ❌      | ❌       |
| Node.js 16 | ✔️     | ❌      | ❌       |
| Node.js 18 | ✔️     | ✔️     | ✔️      |
| Node.js 20 | ✔️     | ✔️     | ✔️      |
| Node.js 22 | ✔️     | ✔️     | ✔️      |
| Node.js 24 | ✔️     | ✔️     | ✔️      |

### Troubleshooting

If pnpm is broken and reinstalling doesn't help:

1. **Find pnpm location:**
   ```bash
   which pnpm        # POSIX
   where.exe pnpm.*  # Windows
   ```

2. **Remove pnpm files** from that directory (`pnpm.cmd`, `pnpx.cmd`, `pnpm`, etc.)

3. **Reinstall pnpm**

### Using a Shorter Alias

**POSIX systems (.bashrc, .zshrc, config.fish):**
```bash
alias pn=pnpm
```

**PowerShell (Windows, admin rights):**
```powershell
notepad $profile.AllUsersAllHosts
# Add to profile.ps1:
set-alias -name pn -value pnpm
```

### Updating pnpm

```bash
pnpm self-update
```

### Verify Installation

```bash
pnpm --version
```

## pnpm CLI

### Differences vs npm

- **Option validation:** pnpm validates all options. Invalid options fail (e.g., `pnpm install --target_arch x64` fails)
- **Unknown commands:** pnpm searches for scripts first, then executes as shell command (see `pnpm exec`)

**Workarounds for npm_config_ environment variables:**

1. **Set environment variable explicitly:**
   ```bash
   npm_config_target_arch=x64 pnpm install
   ```

2. **Force unknown option with --config.:**
   ```bash
   pnpm install --config.target_arch=x64
   ```

### CLI Options

**-C <path>, --dir <path>**
Run as if pnpm was started in `<path>` instead of current directory.

**-w, --workspace-root**
Run as if pnpm was started in workspace root instead of current directory.

### npm Command Equivalents

| npm command   | pnpm equivalent              |
| ------------- | ---------------------------- |
| npm install   | pnpm install                 |
| npm i <pkg>   | pnpm add <pkg>               |
| npm run <cmd> | pnpm <cmd> or pnpm run <cmd> |

### Environment Variables

**CI environment:**
- `CI` - May change pnpm behavior in CI environments

**XDG directories (POSIX):**
- `XDG_CACHE_HOME` - Cache directory
- `XDG_CONFIG_HOME` - Config directory
- `XDG_DATA_HOME` - Data directory
- `XDG_STATE_HOME` - State directory

These may influence where pnpm stores global information.

## CLI Commands

### pnpm install

Install all dependencies from `package.json` and `pnpm-lock.yaml`.

**Basic usage:**
```bash
pnpm install          # Install all dependencies
pnpm i                # Alias
```

**Options:**
```bash
pnpm install --frozen-lockfile    # Fail if lockfile out of sync (CI mode)
pnpm install --no-frozen-lockfile # Allow lockfile updates
pnpm install --lockfile-only      # Only update lockfile, don't install
pnpm install --prefer-offline     # Use store, don't fetch from registry
pnpm install --offline            # Only use store, fail if missing
pnpm install --ignore-scripts     # Don't run lifecycle scripts
pnpm install --no-optional        # Skip optional dependencies
pnpm install --production        # Skip devDependencies
pnpm install --shamefully-hoist   # Create flat node_modules
```

**Workspace:**
```bash
pnpm install -r                    # Install in all workspace packages
pnpm install --filter <selector>  # Install in filtered packages
```

### pnpm add

Add a package to dependencies.

**Basic usage:**
```bash
pnpm add <package>                # Add to dependencies
pnpm add -D <package>              # Add to devDependencies
pnpm add -O <package>              # Add to optionalDependencies
pnpm add -g <package>              # Install globally
```

**Version specification:**
```bash
pnpm add <package>@<version>      # Specific version
pnpm add <package>@latest         # Latest version
pnpm add <package>@^1.0.0          # Version range
pnpm add <package>@tag            # Tag (e.g., @beta)
```

**Package sources:**
```bash
pnpm add <package>                 # From npm registry
pnpm add jsr:@scope/package       # From JSR registry
pnpm add ./local-package           # From local path
pnpm add file:./local-package      # From local file path
pnpm add <tarball-url>             # From remote tarball
pnpm add git+<git-url>             # From Git repository
pnpm add github:user/repo          # From GitHub
pnpm add workspace:*                # From workspace
```

**Options:**
```bash
pnpm add <package> --save-exact    # Save exact version (no ^)
pnpm add <package> --save-peer     # Add to peerDependencies
pnpm add <package> --no-save       # Don't save to package.json
pnpm add <package> --ignore-workspace-root-check  # Skip workspace check
```

**Workspace:**
```bash
pnpm add <package> -w              # Add to workspace root
pnpm add <package> --filter <selector>  # Add to filtered package
```

### pnpm update

Update packages to latest versions within specified ranges.

**Basic usage:**
```bash
pnpm update                         # Update all dependencies
pnpm update <package>               # Update specific package
pnpm up                             # Alias
```

**Options:**
```bash
pnpm update --latest               # Update to latest versions (ignore ranges)
pnpm update --latest --filter <selector>  # Update filtered packages
pnpm update --recursive            # Update in all workspace packages
pnpm update --interactive          # Interactive update
pnpm update --no-save              # Don't update package.json
```

**Workspace:**
```bash
pnpm update -r                      # Update all workspace packages
pnpm update --filter <selector>    # Update filtered packages
```

### pnpm remove

Remove packages from dependencies.

**Basic usage:**
```bash
pnpm remove <package>               # Remove from dependencies
pnpm rm <package>                   # Alias
pnpm uninstall <package>           # Alias
```

**Options:**
```bash
pnpm remove <package> --save-dev   # Remove from devDependencies
pnpm remove <package> --save-optional  # Remove from optionalDependencies
pnpm remove <package> -g            # Remove global package
pnpm remove <package> --recursive  # Remove from all workspace packages
```

**Workspace:**
```bash
pnpm remove <package> -w            # Remove from workspace root
pnpm remove <package> --filter <selector>  # Remove from filtered package
```

### pnpm link

Link a local package into another package or into a global location.

**Link local package:**
```bash
pnpm link <path>                      # Link package from path
pnpm link ./local-package              # Link from relative path
pnpm link /absolute/path/to/package    # Link from absolute path
```

**Link to global:**
```bash
pnpm link -g                          # Link current package globally
pnpm link --global                    # Alias
```

**Link from global:**
```bash
pnpm link <package-name>               # Link global package into current project
```

**Options:**
```bash
pnpm link --dir <path>                 # Link in specific directory
pnpm link -w                           # Link to workspace root
```

**Workspace:**
```bash
pnpm link --filter <selector>          # Link in filtered package
```

### pnpm unlink

Unlink a previously linked package.

**Unlink local package:**
```bash
pnpm unlink <package-name>             # Unlink package
```

**Unlink from global:**
```bash
pnpm unlink -g                        # Unlink current package from global
pnpm unlink --global                  # Alias
```

**Options:**
```bash
pnpm unlink --dir <path>               # Unlink in specific directory
pnpm unlink -w                         # Unlink from workspace root
```

**Workspace:**
```bash
pnpm unlink --filter <selector>        # Unlink in filtered package
```

### pnpm import

Import dependencies from other package managers.

**Import from npm:**
```bash
pnpm import                           # Import from package-lock.json
```

**Import from Yarn:**
```bash
pnpm import                           # Import from yarn.lock
```

**Options:**
```bash
pnpm import --force                    # Overwrite existing pnpm-lock.yaml
pnpm import --ignore-scripts          # Don't run install scripts
```

**Note:** Automatically detects `package-lock.json` or `yarn.lock` in current directory.

### pnpm rebuild

Rebuild native dependencies.

**Basic usage:**
```bash
pnpm rebuild                          # Rebuild all native dependencies
pnpm rebuild <package>                # Rebuild specific package
```

**Options:**
```bash
pnpm rebuild --filter <selector>      # Rebuild in filtered packages
pnpm rebuild -r                        # Rebuild in all workspace packages
```

**Workspace:**
```bash
pnpm rebuild --recursive              # Rebuild in all workspaces
pnpm rebuild --filter <selector>      # Rebuild filtered packages
```

### pnpm prune

Remove extraneous packages.

**Basic usage:**
```bash
pnpm prune                            # Remove packages not in package.json
```

**Options:**
```bash
pnpm prune --production              # Remove devDependencies
pnpm prune --no-optional             # Don't remove optional dependencies
```

**Note:** Removes packages that are not listed in `package.json` dependencies.

### pnpm fetch

Download packages to store without installing them.

**Basic usage:**
```bash
pnpm fetch                            # Fetch all dependencies to store
```

**Options:**
```bash
pnpm fetch --frozen-lockfile          # Fail if lockfile out of sync
pnpm fetch --offline                  # Only use store, don't fetch
pnpm fetch --prefer-offline           # Prefer store, fetch if missing
```

**Workspace:**
```bash
pnpm fetch -r                          # Fetch for all workspace packages
pnpm fetch --filter <selector>        # Fetch for filtered packages
```

### pnpm install-test

Run `pnpm install` followed immediately by `pnpm test`.

**Basic usage:**
```bash
pnpm install-test                     # Install then test
pnpm it                               # Alias
```

**Options:**
```bash
pnpm install-test --frozen-lockfile   # Use frozen lockfile
pnpm install-test --production        # Skip devDependencies
```

**Workspace:**
```bash
pnpm install-test -r                   # Install-test in all workspaces
pnpm install-test --filter <selector> # Install-test in filtered packages
```

### pnpm dedupe

Remove duplicate dependencies from the lockfile.

**Basic usage:**
```bash
pnpm dedupe                           # Remove duplicate dependencies
```

**Options:**
```bash
pnpm dedupe --check                   # Check for duplicates without removing
pnpm dedupe --filter <selector>       # Dedupe in filtered packages
```

**Workspace:**
```bash
pnpm dedupe -r                         # Dedupe in all workspace packages
```

### pnpm patch

Create a patch file for a package.

**Basic usage:**
```bash
pnpm patch <package-name>              # Create patch for package
```

**Process:**
1. Downloads package to temporary directory
2. Opens directory in editor (or specified editor)
3. After editing, run `pnpm patch-commit <path>` to create patch

**Options:**
```bash
pnpm patch <package> --editor <editor> # Use specific editor
```

**Example:**
```bash
pnpm patch lodash@4.17.21              # Creates temp directory
# Edit files in temp directory
pnpm patch-commit <temp-path>          # Creates patch file
```

### pnpm patch-commit

Commit changes made in a patched package directory.

**Basic usage:**
```bash
pnpm patch-commit <path>                # Commit patch from path
```

**Process:**
1. Takes path to temporary directory created by `pnpm patch`
2. Creates patch file in `patches/` directory
3. Updates `package.json` to reference patch

**Options:**
```bash
pnpm patch-commit <path> --ignore-dirty  # Ignore uncommitted changes
```

### pnpm patch-remove

Remove a patch for a package.

**Basic usage:**
```bash
pnpm patch-remove <package-name>        # Remove patch for package
```

**Process:**
1. Removes patch file from `patches/` directory
2. Updates `package.json` to remove patch reference

**Options:**
```bash
pnpm patch-remove <package> --force     # Force removal
```

### pnpm audit

Check for known vulnerabilities in dependencies.

**Basic usage:**
```bash
pnpm audit                             # Check for vulnerabilities
```

**Options:**
```bash
pnpm audit --fix                       # Fix vulnerabilities (if possible)
pnpm audit --audit-level <level>       # Set audit level (low, moderate, high, critical)
pnpm audit --json                      # Output as JSON
pnpm audit --production                # Only check production dependencies
```

**Workspace:**
```bash
pnpm audit -r                          # Audit all workspace packages
pnpm audit --filter <selector>         # Audit filtered packages
```

**Audit levels:**
- `low` - Low severity vulnerabilities
- `moderate` - Moderate severity vulnerabilities
- `high` - High severity vulnerabilities
- `critical` - Critical severity vulnerabilities

### pnpm list

List installed packages.

**Basic usage:**
```bash
pnpm list                              # List all installed packages
pnpm ls                                # Alias
pnpm list <package>                    # Check if specific package installed
```

**Options:**
```bash
pnpm list --depth=<number>              # Limit depth (0 = direct deps only)
pnpm list --long                       # Show extended information
pnpm list --json                       # Output as JSON
pnpm list --parseable                  # Output parseable format
pnpm list --global                     # List global packages
pnpm list -g                           # Alias
pnpm list --production                 # Only production dependencies
pnpm list --dev                        # Only dev dependencies
pnpm list --optional                   # Only optional dependencies
```

**Workspace:**
```bash
pnpm list -r                           # List in all workspace packages
pnpm list --filter <selector>          # List in filtered packages
```

**Examples:**
```bash
pnpm list --depth=0                    # Only direct dependencies
pnpm list react                        # Check if react is installed
pnpm list --json | jq                  # JSON output with jq
```

### pnpm outdated

Check for outdated packages.

**Basic usage:**
```bash
pnpm outdated                         # List outdated packages
```

**Options:**
```bash
pnpm outdated --long                   # Show extended information
pnpm outdated --json                   # Output as JSON
pnpm outdated --recursive             # Check all workspace packages
pnpm outdated --filter <selector>      # Check filtered packages
```

**Output format:**
Shows current, wanted, and latest versions for each outdated package.

**Workspace:**
```bash
pnpm outdated -r                       # Check all workspaces
pnpm outdated --filter <selector>       # Check filtered packages
```

### pnpm why

Show why a package is installed.

**Basic usage:**
```bash
pnpm why <package-name>                 # Show why package is installed
```

**Options:**
```bash
pnpm why <package> --json              # Output as JSON
pnpm why <package> --long              # Show extended information
pnpm why <package> --find-by=<finder>  # Use finder function (v10.16+)
```

**Workspace:**
```bash
pnpm why <package> -r                   # Show in all workspace packages
pnpm why <package> --filter <selector>  # Show in filtered packages
```

**Examples:**
```bash
pnpm why react                         # Show why react is installed
pnpm why react --find-by=react17      # Use finder function
```

### pnpm licenses

List licenses of dependencies.

**Basic usage:**
```bash
pnpm licenses list                     # List all licenses
```

**Options:**
```bash
pnpm licenses list --json              # Output as JSON
pnpm licenses list --long             # Show extended information
pnpm licenses list --production       # Only production dependencies
pnpm licenses list --dev              # Only dev dependencies
```

**Workspace:**
```bash
pnpm licenses list -r                  # List in all workspace packages
pnpm licenses list --filter <selector> # List in filtered packages
```

**Output:**
Shows license information for all dependencies, grouped by license type.

### pnpm run

Run a script defined in `package.json`.

**Basic usage:**
```bash
pnpm run <script-name>                # Run script
pnpm <script-name>                    # Shorthand (if no command conflict)
```

**Passing arguments:**
```bash
pnpm run <script> -- <args>           # Pass arguments to script
pnpm run test -- --coverage            # Example: pass --coverage to test
```

**Options:**
```bash
pnpm run <script> --silent            # Suppress output
pnpm run <script> --if-present         # Don't fail if script doesn't exist
pnpm run <script> --parallel          # Run in parallel (workspace)
pnpm run <script> --recursive         # Run in all workspace packages
pnpm run <script> --stream            # Stream output from child processes
pnpm run <script> --aggregate-output  # Aggregate output from child processes
```

**Workspace:**
```bash
pnpm run <script> -r                   # Run in all workspaces
pnpm run <script> --filter <selector> # Run in filtered packages
pnpm run <script> --parallel          # Run in parallel across workspaces
```

**Examples:**
```bash
pnpm run build                        # Run build script
pnpm run test -- --watch              # Run test with --watch flag
pnpm run lint -r                       # Run lint in all workspaces
```

### pnpm test

Run the `test` script defined in `package.json`.

**Basic usage:**
```bash
pnpm test                             # Run test script
pnpm t                                # Alias
```

**Options:**
Same as `pnpm run` - all `pnpm run` options apply.

**Examples:**
```bash
pnpm test                             # Run tests
pnpm test -- --coverage               # Run tests with coverage
pnpm test --filter <selector>         # Run tests in filtered packages
```

**Note:** If no `test` script exists, pnpm will execute `test` as a shell command (see `pnpm exec`).

### pnpm start

Run the `start` script defined in `package.json`.

**Basic usage:**
```bash
pnpm start                            # Run start script
```

**Default behavior:**
If no `start` script is defined, defaults to `node server.js`.

**Options:**
Same as `pnpm run` - all `pnpm run` options apply.

**Examples:**
```bash
pnpm start                            # Run start script
pnpm start -- --port 3000            # Pass arguments to start script
```

### pnpm exec

Execute a shell command in the context of the project.

**Basic usage:**
```bash
pnpm exec <command>                   # Execute command
pnpm x <command>                      # Alias
```

**How it works:**
- Adds `node_modules/.bin` to `PATH`
- Executes command in pnpm environment
- Can run binaries from dependencies

**Options:**
```bash
pnpm exec <command> --recursive       # Execute in all workspace packages
pnpm exec <command> --filter <selector> # Execute in filtered packages
pnpm exec <command> --parallel        # Execute in parallel (workspace)
```

**Examples:**
```bash
pnpm exec eslint .                    # Run eslint
pnpm exec jest -- --watch            # Run jest with watch
pnpm exec --filter <selector> <cmd>  # Execute in filtered package
```

**Note:** If a command doesn't exist as a pnpm command, pnpm will:
1. Search for a script with that name
2. If no script found, execute as shell command (via `pnpm exec`)

### pnpm dlx

Download and execute a package without installing it (like npx).

**Basic usage:**
```bash
pnpm dlx <package> [args]             # Download and execute package
```

**How it works:**
- Downloads package temporarily
- Executes package binary
- Cleans up after execution

**Options:**
```bash
pnpm dlx <package> --package <pkg>   # Specify package to download
pnpm dlx <package> --yes              # Skip confirmation prompts
```

**Examples:**
```bash
pnpm dlx create-react-app my-app     # Create React app
pnpm dlx cowsay "Hello"               # Run cowsay
pnpm dlx @angular/cli new my-app     # Run Angular CLI
```

**Package sources:**
- npm registry packages
- GitHub repositories: `pnpm dlx github:user/repo`
- Local packages: `pnpm dlx ./local-package`

### pnpm create

Create a project from a template.

**Basic usage:**
```bash
pnpm create <template> [args]          # Create project from template
```

**Common templates:**
```bash
pnpm create react-app <name>          # Create React app
pnpm create vite <name>               # Create Vite project
pnpm create next-app <name>           # Create Next.js app
pnpm create svelte@latest <name>     # Create Svelte app
```

**Options:**
```bash
pnpm create <template> --yes           # Skip prompts
pnpm create <template> --name <name>  # Specify project name
```

**How it works:**
- Runs `pnpm dlx create-<template>` or `pnpm dlx @scope/create-<template>`
- Creates project in current directory or specified directory

**Examples:**
```bash
pnpm create react-app my-app          # Create React app
pnpm create vite@latest my-app       # Create Vite project with latest version
pnpm create @scope/template my-app   # Create from scoped template
```

### pnpm approve-builds

Approve dependencies for running scripts during installation.

**Basic usage:**
```bash
pnpm approve-builds                   # Approve all pending builds
pnpm approve-builds <package>          # Approve specific package
```

**How it works:**
- Updates `onlyBuiltDependencies` or `ignoredBuiltDependencies` in `pnpm-workspace.yaml`
- Allows specified packages to run build scripts during installation

**Options:**
```bash
pnpm approve-builds --recursive       # Approve in all workspace packages
pnpm approve-builds --filter <selector> # Approve in filtered packages
```

**Configuration:**
After approval, packages are added to `onlyBuiltDependencies` in `pnpm-workspace.yaml`:

```yaml
onlyBuiltDependencies:
  - package-name
```

**Use case:**
When pnpm blocks build scripts for security, use this command to approve specific packages.

### pnpm ignored-builds

Display list of packages with blocked build scripts.

**Basic usage:**
```bash
pnpm ignored-builds                   # List ignored builds
```

**Output:**
Shows packages that have build scripts blocked in `ignoredBuiltDependencies`.

**Options:**
```bash
pnpm ignored-builds --json            # Output as JSON
pnpm ignored-builds --recursive        # Show in all workspace packages
pnpm ignored-builds --filter <selector> # Show in filtered packages
```

**Configuration:**
Packages in `ignoredBuiltDependencies` in `pnpm-workspace.yaml` are blocked:

```yaml
ignoredBuiltDependencies:
  - package-name
```

**Use case:**
Check which packages have build scripts blocked for security reasons.

### pnpm publish

Publish a package to the registry.

**Basic usage:**
```bash
pnpm publish                          # Publish package
```

**Options:**
```bash
pnpm publish --dry-run                # Test publish without publishing
pnpm publish --access public          # Publish to public registry
pnpm publish --access restricted      # Publish to private registry
pnpm publish --tag <tag>              # Publish with specific tag (default: latest)
pnpm publish --no-git-checks          # Skip git checks
pnpm publish --force                  # Force publish even if version exists
pnpm publish --publish-branch <branch> # Publish from specific branch
```

**Publishing from workspace:**
```bash
pnpm publish --filter <selector>      # Publish filtered package
pnpm publish -r                        # Publish all workspace packages
```

**Configuration:**
- Reads `package.json` for package metadata
- Requires valid `version` field
- Requires `name` field
- Can use `publishConfig` in `package.json` for registry settings

**Examples:**
```bash
pnpm publish                           # Publish to registry
pnpm publish --tag beta                # Publish as beta version
pnpm publish --access public --tag next # Publish public with next tag
```


### pnpm env

Manage Node.js versions using pnpm.

**Basic usage:**
```bash
pnpm env use <version>                # Install and use Node.js version
pnpm env use --global <version>       # Install globally
pnpm env remove <version>              # Remove Node.js version
pnpm env list                          # List installed Node.js versions
```

**Options:**
```bash
pnpm env use <version> --global       # Install globally
pnpm env use lts                       # Use latest LTS version
pnpm env use latest                    # Use latest version
pnpm env use <version> --force        # Force reinstall
```

**Examples:**
```bash
pnpm env use 20.10.0                  # Install Node.js 20.10.0
pnpm env use lts                       # Use latest LTS
pnpm env list                          # List installed versions
pnpm env remove 18.17.0               # Remove Node.js 18.17.0
```

**Note:** Requires Node.js version manager support. Can install Node.js without pre-installation.

### pnpm store prune

Remove unused packages from the store.

**Basic usage:**
```bash
pnpm store prune                      # Remove unused packages
```

**Options:**
```bash
pnpm store prune --force              # Force removal without confirmation
```

**How it works:**
- Scans all projects using the store
- Removes packages not referenced by any project
- Frees up disk space

### pnpm store status

Check the status of the store.

**Basic usage:**
```bash
pnpm store status                     # Check store status
```

**Output:**
Shows information about the store including:
- Store location
- Number of packages
- Disk usage

### pnpm store path

Display the path to the pnpm store.

**Basic usage:**
```bash
pnpm store path                        # Show store path
```

**Use case:**
Useful for configuring exclusions in antivirus software or finding store location.

### Cache Commands

### pnpm cache-list

List cached packages.

**Basic usage:**
```bash
pnpm cache-list                        # List all cached packages
```

**Options:**
```bash
pnpm cache-list --json                 # Output as JSON
pnpm cache-list --long                 # Show extended information
```

**Output:**
Shows all packages cached in the store.

### pnpm cache-list-registries

List registries that have cached packages.

**Basic usage:**
```bash
pnpm cache-list-registries             # List registries with cache
```

**Output:**
Shows which registries have packages cached in the store.

### pnpm cache-view

View cache information for a specific package.

**Basic usage:**
```bash
pnpm cache-view <package>              # View cache info for package
pnpm cache-view <package>@<version>    # View cache info for specific version
```

**Options:**
```bash
pnpm cache-view <package> --json       # Output as JSON
```

**Output:**
Shows cache information including:
- Package location in store
- Cache status
- Related metadata

### pnpm cache-delete

Delete packages from the cache.

**Basic usage:**
```bash
pnpm cache-delete <package>            # Delete package from cache
pnpm cache-delete <package>@<version>   # Delete specific version
```

**Options:**
```bash
pnpm cache-delete <package> --force    # Force deletion
```

**Use case:**
Remove specific packages from cache to force re-download or free space.

### pnpm cat-file

Output the contents of a file from the store.

**Basic usage:**
```bash
pnpm cat-file <hash>                   # Output file contents by hash
```

**Options:**
```bash
pnpm cat-file <hash> --json            # Output as JSON
```

**Use case:**
Inspect file contents from the pnpm store by hash.

### pnpm cat-index

Output the contents of an index file from the store.

**Basic usage:**
```bash
pnpm cat-index <hash>                  # Output index contents by hash
```

**Options:**
```bash
pnpm cat-index <hash> --json           # Output as JSON
```

**Use case:**
Inspect index file contents from the pnpm store by hash.

### pnpm find-hash

Find the hash of a package or file.

**Basic usage:**
```bash
pnpm find-hash <package>               # Find hash for package
pnpm find-hash <package>@<version>     # Find hash for specific version
```

**Options:**
```bash
pnpm find-hash <package> --json        # Output as JSON
```

**Use case:**
Find the content-addressable hash for a package in the store.

### pnpm self-update

Update pnpm to the latest version.

**Basic usage:**
```bash
pnpm self-update                       # Update to latest version
```

**Options:**
```bash
pnpm self-update --version <version>   # Update to specific version
pnpm self-update --global              # Update global installation
```

**Examples:**
```bash
pnpm self-update                       # Update to latest
pnpm self-update --version 9.0.0      # Update to specific version
```

**Note:** Updates the pnpm CLI itself. Different from `pnpm update` which updates project dependencies.

### pnpm pack

Create a tarball from a package.

**Basic usage:**
```bash
pnpm pack                              # Create tarball
```

**Options:**
```bash
pnpm pack --pack-destination <dir>     # Output directory for tarball
pnpm pack --dry-run                    # Test without creating tarball
```

**Output:**
Creates a `.tgz` file in the current directory (or specified destination) with the package name and version.

**Use case:**
Create a tarball for local installation or testing before publishing.

### pnpm recursive

Run a command in all workspace packages (alias for `-r`).

**Basic usage:**
```bash
pnpm recursive <command>                # Run command in all workspaces
pnpm -r <command>                       # Alias
```

**Options:**
```bash
pnpm recursive <command> --parallel     # Run in parallel
pnpm recursive <command> --bail        # Stop on first error
pnpm recursive <command> --sort         # Sort packages by dependency order
```

**Examples:**
```bash
pnpm recursive install                  # Install in all workspaces
pnpm recursive test                     # Test all workspaces
pnpm recursive build --parallel         # Build all in parallel
```

### pnpm server

Start a server for the pnpm store (experimental).

**Basic usage:**
```bash
pnpm server start                       # Start server
pnpm server stop                        # Stop server
pnpm server status                      # Check server status
```

**Options:**
```bash
pnpm server start --port <port>         # Specify port
pnpm server start --host <host>         # Specify host
```

**Use case:**
Share pnpm store across network (experimental feature).

### pnpm root

Display the root directory of the current project.

**Basic usage:**
```bash
pnpm root                               # Show project root
```

**Options:**
```bash
pnpm root --global                      # Show global root
pnpm root -g                            # Alias
```

**Output:**
Prints the absolute path to the project root directory.

**Use case:**
Find the project root programmatically or in scripts.

### pnpm bin

Display the directory where pnpm will install executables.

**Basic usage:**
```bash
pnpm bin                                # Show local bin directory
```

**Options:**
```bash
pnpm bin --global                       # Show global bin directory
pnpm bin -g                             # Alias
```

**Output:**
Prints the path to `node_modules/.bin` (or global bin directory).

**Use case:**
Find where executables are installed for PATH configuration.

### pnpm setup

Set up pnpm for the current shell.

**Basic usage:**
```bash
pnpm setup                              # Setup pnpm for current shell
```

**What it does:**
- Adds pnpm to PATH
- Configures shell environment
- Sets up completions

**Note:**
Usually run automatically during installation, but can be run manually if needed.

### pnpm init

Create a `package.json` file.

**Basic usage:**
```bash
pnpm init                               # Create package.json interactively
```

**Options:**
```bash
pnpm init -y                            # Skip prompts, use defaults
pnpm init --yes                         # Alias
pnpm init --scope <scope>              # Set package scope
```

**Examples:**
```bash
pnpm init                               # Interactive creation
pnpm init -y                             # Quick creation with defaults
```

**Note:**
Similar to `npm init`, creates a basic `package.json` file.

### pnpm deploy

Deploy a package from a workspace.

**Basic usage:**
```bash
pnpm deploy <directory>                 # Deploy to directory
```

**Options:**
```bash
pnpm deploy <dir> --filter <selector>   # Deploy filtered package
pnpm deploy <dir> --prod                # Production dependencies only
pnpm deploy <dir> --no-dev              # Skip devDependencies
```

**How it works:**
- Copies package and dependencies to target directory
- Creates a clean installation without workspace links
- Useful for deployment scenarios

**Use case:**
Create a deployment-ready copy of a package with all dependencies.

### pnpm doctor

Check for common issues.

**Basic usage:**
```bash
pnpm doctor                             # Check for issues
```

**What it checks:**
- pnpm version
- Node.js version
- Store integrity
- Configuration issues
- Common problems

**Output:**
Reports any issues found and suggests fixes.

**Use case:**
Diagnose problems with pnpm installation or configuration.

### pnpm config

Manage pnpm configuration.

**Basic usage:**
```bash
pnpm config get <key>                   # Get config value
pnpm config set <key> <value>            # Set config value
pnpm config delete <key>                 # Delete config
pnpm config list                         # List all config
```

**Options:**
```bash
pnpm config get <key> --global          # Get global config
pnpm config set <key> <value> --global  # Set global config
pnpm config list --global                # List global config
pnpm config edit                         # Edit config file
pnpm config edit --global                # Edit global config
```

**Examples:**
```bash
pnpm config get store-dir                # Get store directory
pnpm config set store-dir /path/to/store # Set store directory
pnpm config list                         # List all settings
pnpm config edit                          # Edit .npmrc
```

**Configuration locations:**
- Project: `.npmrc` in project root
- Global: `~/.npmrc` (or `%APPDATA%\npm\etc\npmrc` on Windows)
- Workspace: `pnpm-workspace.yaml`

### pnpm help

Show help information.

**Basic usage:**
```bash
pnpm help                                # Show general help
pnpm help <command>                      # Show help for command
pnpm <command> --help                   # Alias
pnpm <command> -h                        # Alias
```

**Examples:**
```bash
pnpm help                                # General help
pnpm help install                        # Help for install command
pnpm install --help                      # Same as above
```

### Other Commands

```bash
pnpm completion <shell>                 # Generate shell completions
```

## Configuration

### Configuration Files

pnpm uses npm's configuration format. Configuration can be set in:
- `.npmrc` (project or global)
- `pnpm-workspace.yaml` (workspace settings)
- Environment variables
- CLI flags

**Note:** pnpm uses the same configuration as npm for installations. If npm is configured for a private registry, pnpm works with it automatically.

**Flag parameters as options:**
Any flag parameter (e.g., `--filter`, `--workspace-concurrency`) can be used as a config option:

```bash
# In .npmrc
workspace-concurrency = 1
filter = @my-scope/*
```

### Key Configuration Options

**Store Directory:**
```bash
pnpm config set store-dir /path/to/.pnpm-store
# Or in .npmrc:
store-dir=/path/to/.pnpm-store
```

**Node Linker (node_modules structure):**
```bash
# .npmrc or pnpm-workspace.yaml
node-linker=isolated    # Default: symlinks (strict)
node-linker=hoisted     # npm/Yarn-like flat structure
node-linker=pnp         # Plug'n'Play (experimental)
```

**Hoisting Patterns:**
```bash
# .npmrc
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
shamefully-hoist=true   # Hoist all (not recommended)
```

**Peer Dependencies:**
```bash
auto-install-peers=true              # Auto-install peer deps
strict-peer-dependencies=true        # Fail on missing peers
```

**Lockfile:**
```bash
lockfile=true                         # Generate pnpm-lock.yaml
lockfile-only=true                    # Only update lockfile
frozen-lockfile=true                  # Fail if lockfile out of sync
```

**Registry:**
```bash
registry=<registry-url>
# Or per-scope:
@myorg:registry=<private-registry-url>
```

**Other Important Settings:**
```bash
save-exact=true                       # Save exact versions
save-prefix=^                         # Version prefix (default: ^)
engine-strict=true                    # Enforce engines field
prefer-workspace-packages=true        # Prefer workspace packages
link-workspace-packages=true          # Link workspace packages
```

### Configuration Commands

```bash
pnpm config get <key>                 # Get config value
pnpm config set <key> <value>         # Set config value
pnpm config delete <key>              # Delete config
pnpm config list                      # List all config
```

## Settings Reference

Complete reference of all pnpm configuration settings.

### Store Settings

**store-dir:**
```bash
store-dir=/path/to/.pnpm-store
```
Location of the pnpm store.

**package-import-method:**
```bash
package-import-method=hardlink        # hardlink, copy, clone-or-copy
```
How packages are imported from store to node_modules.

### Node Linker Settings

**node-linker:**
```bash
node-linker=isolated                  # isolated, hoisted, pnp
```
Control node_modules structure:
- `isolated` - Default, uses symlinks (strict)
- `hoisted` - Flat structure like npm
- `pnp` - Plug'n'Play (experimental)

### Hoisting Settings

**shamefully-hoist:**
```bash
shamefully-hoist=true                 # Default: false
```
Hoist all packages to root (not recommended).

**hoist-pattern:**
```bash
hoist-pattern[]=*eslint*
hoist-pattern[]=*prettier*
```
Packages to hoist to root.

**public-hoist-pattern:**
```bash
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
```
Packages to hoist and make available to all.

### Workspace Settings

**link-workspace-packages:**
```bash
link-workspace-packages=true         # Default: true
```
Link workspace packages using `workspace:` protocol.

**prefer-workspace-packages:**
```bash
prefer-workspace-packages=true        # Default: false
```
Prefer workspace packages over registry versions.

**shared-workspace-lockfile:**
```bash
shared-workspace-lockfile=true        # Default: true
```
Use single lockfile for entire workspace.

**save-workspace-protocol:**
```bash
save-workspace-protocol=true          # Default: true
```
Save workspace dependencies with `workspace:` protocol.

### Peer Dependency Settings

**strict-peer-dependencies:**
```bash
strict-peer-dependencies=true         # Default: false
```
Fail on missing or mismatched peer dependencies.

**auto-install-peers:**
```bash
auto-install-peers=true               # Default: false
```
Automatically install peer dependencies.

### Lockfile Settings

**lockfile:**
```bash
lockfile=true                         # Default: true
```
Generate `pnpm-lock.yaml` file.

**lockfile-only:**
```bash
lockfile-only=true
```
Only update lockfile, don't install packages.

**frozen-lockfile:**
```bash
frozen-lockfile=true
```
Fail if lockfile is out of sync (CI mode).

### Registry Settings

**registry:**
```bash
registry=<registry-url>
```
Default registry URL.

**@scope:registry:**
```bash
@myorg:registry=<private-registry-url>
```
Registry for specific scope.

### Installation Settings

**save-exact:**
```bash
save-exact=true                       # Default: false
```
Save exact versions (no `^` or `~`).

**save-prefix:**
```bash
save-prefix=^                         # Default: ^
```
Version prefix when saving dependencies.

**ignore-scripts:**
```bash
ignore-scripts=true                   # Default: false
```
Don't run lifecycle scripts.

**side-effects-cache:**
```bash
side-effects-cache=true               # Default: true
```
Cache side effects for faster installs.

### Engine Settings

**engine-strict:**
```bash
engine-strict=true                    # Default: false
```
Enforce `engines` field strictly.

### Security Settings

**only-built-dependencies:**
```bash
only-built-dependencies[]=package-name
```
Only allow specified packages to run build scripts.

**ignored-built-dependencies:**
```bash
ignored-built-dependencies[]=package-name
```
Block build scripts for specified packages.

**minimum-release-age:**
```bash
minimum-release-age=7d
```
Delay adoption of new package versions.

### Performance Settings

**network-concurrency:**
```bash
network-concurrency=16                # Default: 16
```
Number of concurrent network requests.

**fetch-retries:**
```bash
fetch-retries=2                       # Default: 2
```
Number of retries for failed fetches.

**fetch-retry-mintimeout:**
```bash
fetch-retry-mintimeout=10000          # Default: 10000ms
```
Minimum timeout for retries.

**fetch-retry-maxtimeout:**
```bash
fetch-retry-maxtimeout=60000          # Default: 60000ms
```
Maximum timeout for retries.

### Workspace Concurrency

**workspace-concurrency:**
```bash
workspace-concurrency=4               # Default: 4
```
Number of concurrent workspace operations.

### Other Settings

**use-node-version:**
```bash
use-node-version=20.10.0
```
Node.js version to use (via pnpm env).

**resolution-mode:**
```bash
resolution-mode=highest               # highest, lowest-direct
```
Dependency resolution strategy.

**prefer-symlinked-executables:**
```bash
prefer-symlinked-executables=true     # Default: false
```
Prefer symlinked executables over shell scripts.

**All settings can be configured in:**
- `.npmrc` (project or global)
- `pnpm-workspace.yaml` (workspace settings)
- Environment variables (`npm_config_*` or `PNPM_*`)
- CLI flags

## Workspaces

pnpm has built-in support for monorepositories (multi-package repositories). Create a workspace to unite multiple projects inside a single repository.

### Setup

A workspace must have a `pnpm-workspace.yaml` file in its root:

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'components/**'
  - '!**/test/**'                     # Exclude patterns
```

### Workspace Protocol (workspace:)

If `link-workspace-packages` is set to `true`, pnpm will link packages from the workspace if the available packages match the declared ranges.

**Basic usage:**
```json
{
  "dependencies": {
    "my-package": "workspace:*",
    "my-other-package": "workspace:^1.0.0"
  }
}
```

**How it works:**
- `workspace:*` - Links any version from workspace
- `workspace:^1.0.0` - Links version matching range
- If version not in workspace, installs from registry (unless `workspace:` protocol used)

**Strict workspace protocol:**
When `workspace:` protocol is used, pnpm will refuse to resolve to anything other than a local workspace package:

```json
{
  "dependencies": {
    "foo": "workspace:2.0.0"
  }
}
```

If `foo@2.0.0` isn't present in the workspace, installation will fail.

**Note:** Requires `link-workspace-packages: true` (default).

### Referencing Workspace Packages

**Through aliases:**
```json
{
  "dependencies": {
    "bar": "workspace:foo@*"
  }
}
```

This creates an alias `bar` that points to workspace package `foo`. Before publish, aliases are converted to regular aliased dependencies: `"bar": "npm:foo@1.0.0"`.

**Through relative path:**
```json
{
  "dependencies": {
    "foo": "workspace:../foo"
  }
}
```

In a workspace with packages `packages/foo` and `packages/bar`, `bar` can reference `foo` using relative path. Before publishing, these specs are converted to regular version specs.

### Publishing Workspace Packages

When a workspace package is packed or published, `workspace:` dependencies are dynamically replaced:

**Before publish:**
```json
{
  "dependencies": {
    "foo": "workspace:*",
    "bar": "workspace:~",
    "qar": "workspace:^",
    "zoo": "workspace:^1.5.0"
  }
}
```

**After publish (if all packages are at version 1.5.0):**
```json
{
  "dependencies": {
    "foo": "1.5.0",
    "bar": "~1.5.0",
    "qar": "^1.5.0",
    "zoo": "^1.5.0"
  }
}
```

This allows you to depend on local workspace packages while still being able to publish to remote registries without intermediary publish steps.

### Release Workflow

pnpm does not provide built-in versioning. Use these tools:
- **Changesets** - See [Using Changesets](#using-changesets) section
- **Rush** - Microsoft's monorepo management tool

### Troubleshooting

**Cyclic dependencies:**
pnpm cannot guarantee scripts run in topological order if there are cycles between workspace dependencies. If pnpm detects cyclic dependencies during installation, it will produce a warning and display which dependencies are causing the cycles.

**Message: "There are cyclic workspace dependencies"**
Inspect workspace dependencies declared in `dependencies`, `optionalDependencies`, and `devDependencies` to resolve cycles.

### Workspace Commands

```bash
pnpm -r <command>                     # Run in all workspaces (recursive)
pnpm -r --parallel <command>          # Run in parallel
pnpm --filter <selector> <command>    # Run in filtered packages
```

## Advanced Features

### Filtering

Filter commands to specific package subsets using the `--filter` flag.

**By package name:**
```bash
pnpm --filter <package-name> <command>
pnpm --filter "@scope/*" <command>
pnpm --filter "@scope/package" <command>
```

**By directory:**
```bash
pnpm --filter ./packages/my-package <command>
pnpm --filter ./apps/* <command>
```

**By relationship:**
```bash
pnpm --filter <package>... <command>        # Package and dependencies
pnpm --filter ...<package> <command>         # Package and dependents
pnpm --filter <package>^... <command>        # Dependencies only
pnpm --filter ...^<package> <command>       # Dependents only
```

**Negation:**
```bash
pnpm --filter=!<package> <command>          # Exclude package
pnpm --filter=!@scope/* <command>            # Exclude scope
```

**Multiple filters:**
```bash
pnpm --filter <pkg1> --filter <pkg2> <command>
pnpm --filter <pkg1> --filter <pkg2>... <command>  # pkg1 and pkg2's deps
```

**Pattern matching:**
```bash
pnpm --filter <pattern> <command>            # Glob pattern
pnpm --filter "./packages/**" <command>      # Recursive pattern
```

**Examples:**
```bash
pnpm --filter "@babel/*" test                # All @babel packages
pnpm --filter "./packages/ui" build          # Specific package
pnpm --filter "my-app..." test               # my-app and its deps
pnpm --filter "...my-lib" build             # my-lib and its dependents
pnpm --filter "!test-utils" build            # All except test-utils
pnpm --filter "@scope/*" --filter "!@scope/old" <command>  # Multiple
```

**Additional filter options:**
```bash
pnpm --filter <selector> --test-pattern <glob>  # Filter by test files
pnpm --filter <selector> --changed-files-ignore-pattern <glob>  # Ignore patterns
```

### Catalogs

Catalogs allow you to define dependency version ranges as reusable constants in a workspace. This reduces duplication and simplifies upgrades.

**Define catalog in `pnpm-workspace.yaml`:**
```yaml
catalog:
  react: ^18.3.1
  redux: ^5.0.1
  typescript: ^5.0.0
  "@types/node": ^20.0.0
```

**Use catalog in `package.json`:**
```json
{
  "dependencies": {
    "react": "catalog:",
    "redux": "catalog:",
    "typescript": "catalog:"
  },
  "devDependencies": {
    "@types/node": "catalog:"
  }
}
```

**Benefits:**
- **Centralized version management** - Update versions in one place
- **Easy bulk updates** - Change catalog entry to update all packages
- **Consistent versions** - Ensures all packages use same version
- **Reduced duplication** - No need to repeat version ranges

**Updating catalogs:**
1. Update version in `pnpm-workspace.yaml` catalog
2. Run `pnpm install` to update all packages using that catalog entry

**Example workflow:**
```yaml
# pnpm-workspace.yaml
catalog:
  react: ^18.3.1
```

```json
// packages/app1/package.json
{
  "dependencies": {
    "react": "catalog:"
  }
}

// packages/app2/package.json
{
  "dependencies": {
    "react": "catalog:"
  }
}
```

To upgrade React to 19.x, just update the catalog:
```yaml
catalog:
  react: ^19.0.0
```

Then run `pnpm install` and all packages using `react: "catalog:"` will be updated.

### Config Dependencies

Config dependencies allow you to share and centralize configuration files, settings, and hooks across multiple projects. They are installed before all regular dependencies.

**Define in `pnpm-workspace.yaml`:**
```yaml
configDependencies:
  my-configs: "1.0.0+sha512-<checksum>"
```

**Characteristics:**
- **Installed first** - Before all regular dependencies
- **No dependencies** - Cannot have their own dependencies
- **No scripts** - Cannot define lifecycle scripts
- **Integrity required** - Must include integrity checksum (sha512)

**Use cases:**
- **Custom hooks** - Share `.pnpmfile.cjs` across workspace
- **Shared patches** - Distribute patch files
- **Catalog definitions** - Share catalog configurations
- **Shared settings** - Centralize configuration

**Example: Sharing pnpmfile**
1. Create a package with your `.pnpmfile.cjs`:
   ```javascript
   // packages/shared-configs/.pnpmfile.cjs
   module.exports = {
     hooks: {
       readPackage(pkg) {
         // Shared modifications
         return pkg;
       }
     }
   };
   ```

2. Publish or reference it in workspace
3. Add to `configDependencies`:
   ```yaml
   configDependencies:
     shared-configs: "1.0.0+sha512-<checksum>"
   ```

**Getting integrity checksum:**
```bash
pnpm view <package>@<version> dist.integrity
```

Or from `pnpm-lock.yaml` after installing once.

### Finder Functions (v10.16+)

Finders allow you to search your dependency graph by any property of a package, not just its name. They provide a powerful way to analyze and manage dependencies.

**Define in `.pnpmfile.cjs`:**
```javascript
module.exports = {
  finders: {
    react17: (ctx) => {
      return ctx.readManifest().peerDependencies?.react === "^17.0.0";
    },
    mitLicense: (ctx) => {
      return ctx.readManifest().license === "MIT";
    },
    outdatedTypes: (ctx) => {
      const deps = ctx.readManifest().dependencies || {};
      return deps['@types/node'] && deps['@types/node'].startsWith('^18');
    },
    hasPostinstall: (ctx) => {
      return !!ctx.readManifest().scripts?.postinstall;
    }
  }
};
```

**Usage:**
```bash
# List packages matching finder
pnpm list --find-by=react17

# Show why packages match finder
pnpm why --find-by=mitLicense

# Find packages with specific properties
pnpm list --find-by=outdatedTypes
pnpm why --find-by=hasPostinstall
```

**Context object:**
The finder function receives a context object with:
- `readManifest()` - Read package manifest
- `packageId` - Package identifier
- Other context information

**Use cases:**
- Find all packages with specific peer dependencies
- Identify packages with certain licenses
- Find outdated type definitions
- Locate packages with specific scripts
- Search by any package property

**Example: Find all React 17 dependencies**
```javascript
finders: {
  react17: (ctx) => {
    const manifest = ctx.readManifest();
    return manifest.peerDependencies?.react === "^17.0.0" ||
           manifest.dependencies?.react === "^17.0.0";
  }
}
```

```bash
pnpm why --find-by=react17
```

### pnpmfile (Hooks)

Modify package manifests during installation:

**Create `.pnpmfile.cjs`:**
```javascript
function readPackage(pkg, context) {
  // Modify package.json before installation
  if (pkg.name === 'some-package') {
    pkg.dependencies = pkg.dependencies || {};
    pkg.dependencies['new-dep'] = '^1.0.0';
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage
  }
};
```

**Available hooks:**
- `readPackage(pkg, context)` - Modify package manifest
- `afterAllResolved(lockfile, context)` - Modify lockfile
- `finders` - Define finder functions (v10.16+)

## Package Manifest

### package.json Support

pnpm supports multiple package manifest formats:
- `package.json` (standard JSON format)
- `package.json5` (JSON5 format - allows comments, trailing commas)
- `package.yaml` (YAML format)

**Standard fields:**
All standard npm `package.json` fields are supported:
- `name`, `version`, `description`
- `main`, `module`, `types`, `exports`
- `scripts`, `dependencies`, `devDependencies`
- `peerDependencies`, `optionalDependencies`
- `engines`, `os`, `cpu`
- `author`, `license`, `repository`
- And all other standard npm fields

**pnpm-specific fields:**
pnpm recognizes additional fields in `package.json`:

### Engines Field

Specify required Node.js and pnpm versions:

```json
{
  "engines": {
    "node": ">=18.12",
    "pnpm": ">=7"
  }
}
```

**Behavior:**
- Warns if versions don't match
- Fails in local development if pnpm version doesn't match
- Can use `engine-strict: true` to enforce strictly

### Runtime Engines (v10.14+)

Specify JavaScript runtime engines:

```json
{
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "^24.4.0",
      "onFail": "download"
    }
  }
}
```

**Supported runtimes:**
- `node` - Node.js
- `deno` - Deno
- `bun` - Bun

**onFail options:**
- `download` - Download and use specified version
- `error` - Fail with error

### pnpm Overrides

Override dependency versions (similar to npm overrides):

```json
{
  "pnpm": {
    "overrides": {
      "lodash": "^4.17.21",
      "@types/node": ">=18"
    }
  }
}
```

### Peer Dependency Rules

```json
{
  "pnpm": {
    "peerDependencyRules": {
      "allowedVersions": {
        "react": "17 || 18"
      },
      "ignoreMissing": ["@types/*"]
    }
  }
}
```

**peerDependencyRules options:**
- `allowedVersions` - Allow specific version ranges for peer dependencies
- `ignoreMissing` - Ignore missing peer dependencies (array of package patterns)

### packageManager Field

Specify the package manager and version:

```json
{
  "packageManager": "pnpm@9.0.0"
}
```

**Use with Corepack:**
Corepack uses this field to automatically use the correct pnpm version.

### publishConfig

Configure publishing settings:

```json
{
  "publishConfig": {
    "registry": "<registry-url>",
    "access": "public"
  }
}
```

**Options:**
- `registry` - Registry URL for publishing
- `access` - Access level (`public` or `restricted`)
- `tag` - Distribution tag (default: `latest`)

## pnpm-workspace.yaml

Configuration file for pnpm workspaces (monorepos).

### Location

Must be placed in the **root** of the repository.

### Basic Structure

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'components/**'
  - '!**/test/**'                      # Exclude patterns
```

### Settings

**packages:**
Array of glob patterns defining workspace packages.

**link-workspace-packages:**
```yaml
link-workspace-packages: true          # Default: true
```
Link workspace packages using `workspace:` protocol.

**prefer-workspace-packages:**
```yaml
prefer-workspace-packages: true        # Default: false
```
Prefer workspace packages over registry versions.

**shared-workspace-lockfile:**
```yaml
shared-workspace-lockfile: true        # Default: true
```
Use a single lockfile for the entire workspace.

**save-workspace-protocol:**
```yaml
save-workspace-protocol: true          # Default: true
```
Save workspace dependencies with `workspace:` protocol.

**catalog:**
```yaml
catalog:
  react: ^18.3.1
  typescript: ^5.0.0
```
Define dependency version catalogs.

**configDependencies:**
```yaml
configDependencies:
  my-configs: "1.0.0+sha512-<checksum>"
```
Config dependencies installed before regular dependencies.

**onlyBuiltDependencies:**
```yaml
onlyBuiltDependencies:
  - package-name
```
Allow only specified packages to run build scripts.

**ignoredBuiltDependencies:**
```yaml
ignoredBuiltDependencies:
  - package-name
```
Block build scripts for specified packages.

**node-linker:**
```yaml
node-linker: isolated                  # isolated, hoisted, or pnp
```
Control node_modules structure.

**package-import-method:**
```yaml
package-import-method: hardlink        # hardlink, copy, or clone-or-copy
```
How packages are imported from store.

**hoist-pattern:**
```yaml
hoist-pattern:
  - '*eslint*'
  - '*prettier*'
```
Packages to hoist to root of node_modules.

**public-hoist-pattern:**
```yaml
public-hoist-pattern:
  - '*eslint*'
  - '*prettier*'
```
Packages to hoist and make available to all packages.

**shamefully-hoist:**
```yaml
shamefully-hoist: false                # Default: false
```
Hoist all packages (not recommended).

**strict-peer-dependencies:**
```yaml
strict-peer-dependencies: true         # Default: false
```
Fail on missing or mismatched peer dependencies.

**auto-install-peers:**
```yaml
auto-install-peers: true               # Default: false
```
Automatically install peer dependencies.

**peer-dependency-rules:**
```yaml
peer-dependency-rules:
  allowedVersions:
    react: "17 || 18"
  ignoreMissing:
    - "@types/*"
```
Rules for handling peer dependencies.

**Example complete configuration:**
```yaml
packages:
  - 'packages/*'
  - 'apps/*'

link-workspace-packages: true
prefer-workspace-packages: true
shared-workspace-lockfile: true

catalog:
  react: ^18.3.1
  typescript: ^5.0.0

node-linker: isolated
package-import-method: hardlink

public-hoist-pattern:
  - '*eslint*'
  - '*prettier*'

strict-peer-dependencies: false
auto-install-peers: true
```

## pnpmfile

Hooks file for modifying package manifests during installation.

### Location

Create `.pnpmfile.cjs` in the **project root** (or workspace root).

### File Format

Must be a CommonJS module (`.cjs` extension).

### Available Hooks

**readPackage(pkg, context):**
Modify package manifest before installation.

```javascript
function readPackage(pkg, context) {
  // Modify package.json
  if (pkg.name === 'some-package') {
    pkg.dependencies = pkg.dependencies || {};
    pkg.dependencies['missing-dep'] = '^1.0.0';
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage
  }
};
```

**afterAllResolved(lockfile, context):**
Modify lockfile after resolution.

```javascript
function afterAllResolved(lockfile, context) {
  // Modify lockfile
  return lockfile;
}

module.exports = {
  hooks: {
    afterAllResolved
  }
};
```

**finders (v10.16+):**
Define finder functions for dependency graph queries.

```javascript
module.exports = {
  finders: {
    react17: (ctx) => {
      return ctx.readManifest().peerDependencies?.react === "^17.0.0";
    },
    mitLicense: (ctx) => {
      return ctx.readManifest().license === "MIT";
    }
  }
};
```

### Context Object

The `context` parameter provides:
- `log(msg)` - Log messages
- `rootDir` - Project root directory
- `pkg` - Package information

### Use Cases

1. **Add missing dependencies:**
   Fix packages that don't declare all their dependencies.

2. **Modify dependencies:**
   Change dependency versions or add/remove dependencies.

3. **Patch packages:**
   Modify package behavior without forking.

4. **Define finders:**
   Create custom dependency graph queries.

### Example: Fix Missing Dependency

```javascript
module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.name === 'inspectpack') {
        pkg.dependencies = pkg.dependencies || {};
        pkg.dependencies['babel-traverse'] = '^6.26.0';
      }
      return pkg;
    }
  }
};
```

**After creating `.pnpmfile.cjs`:**
1. Delete `pnpm-lock.yaml` (hooks only affect resolution)
2. Run `pnpm install` to rebuild dependencies

### Workspace pnpmfile

For workspaces, you can:
- Place `.pnpmfile.cjs` in workspace root (affects all packages)
- Place `.pnpmfile.cjs` in individual packages (affects only that package)
- Use config dependencies to share pnpmfile across workspaces

## Scripts

### Running Scripts

pnpm can run scripts defined in `package.json`. See detailed command documentation:
- [pnpm run](#pnpm-run) - Run scripts with full options
- [pnpm test](#pnpm-test) - Run test script
- [pnpm start](#pnpm-start) - Run start script
- [pnpm exec](#pnpm-exec) - Execute commands in pnpm environment
- [pnpm dlx](#pnpm-dlx) - Download and execute packages

**Basic usage:**
```bash
pnpm run <script-name>              # Run script
pnpm <script-name>                  # Shorthand (if no command conflict)
```

**Unknown commands:** If a command doesn't exist, pnpm:
1. Searches for a script with that name
2. If no script found, executes as shell command (see `pnpm exec`)

**Examples:**
```bash
pnpm run lint                       # Explicit
pnpm lint                           # Shorthand
pnpm eslint                         # Executes eslint if no script
```

### Lifecycle Scripts

pnpm supports standard npm lifecycle scripts:
- `preinstall` - Before package installation
- `install` - After package installation
- `postinstall` - After package installation completes
- `prepublish` - Before package publish
- `prepublishOnly` - Before publish (only on publish)
- `publish` - During package publish
- `postpublish` - After package publish
- `prepack` - Before tarball creation
- `postpack` - After tarball creation
- `preprepare` - Before prepare
- `prepare` - After package extraction and before publish
- `postprepare` - After prepare

### pnpm:devPreinstall Script

Special script that runs before `preinstall` in development:

```json
{
  "scripts": {
    "pnpm:devPreinstall": "echo 'Running before preinstall in dev'"
  }
}
```

**Behavior:**
- Only runs in development (not in production installs)
- Runs before `preinstall`
- Useful for development-only setup tasks

### Script Options

```bash
pnpm run <script> -- <args>         # Pass arguments to script
pnpm run <script> --silent           # Suppress output
pnpm run <script> --parallel         # Run in parallel (workspace)
pnpm run <script> --recursive        # Run in all workspace packages
pnpm run <script> --filter <selector>  # Run in filtered packages
```

### Workspace Scripts

```bash
pnpm -r run <script>                 # Run in all workspaces
pnpm -r --parallel run <script>     # Run in parallel
pnpm --filter <selector> run <script>  # Run in filtered packages
```

### Environment Variables

Scripts have access to:
- `npm_config_*` - npm/pnpm configuration
- `PNPM_*` - pnpm-specific variables
- Standard Node.js environment variables

## Common Recipes

### Continuous Integration

**Basic CI setup:**
```bash
# Install with frozen lockfile (fail if out of sync)
pnpm install --frozen-lockfile

# Or in .npmrc:
frozen-lockfile=true
```

**GitHub Actions example:**
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm build
```

**GitLab CI example:**
```yaml
image: node:20
cache:
  paths:
    - .pnpm-store
before_script:
  - corepack enable
  - corepack prepare pnpm@latest --activate
test:
  script:
    - pnpm install --frozen-lockfile
    - pnpm test
```

**CircleCI example:**
```yaml
version: 2.1
jobs:
  build:
    docker:
      - image: node:20
    steps:
      - checkout
      - run: corepack enable
      - run: corepack prepare pnpm@latest --activate
      - restore_cache:
          keys:
            - pnpm-store-{{ checksum "pnpm-lock.yaml" }}
      - run: pnpm install --frozen-lockfile
      - save_cache:
          paths:
            - .pnpm-store
          key: pnpm-store-{{ checksum "pnpm-lock.yaml" }}
      - run: pnpm test
```

**CI Best Practices:**
- Always use `--frozen-lockfile` to ensure reproducible builds
- Cache the pnpm store for faster builds
- Use `pnpm install --prod` for production builds
- Run `pnpm audit` in CI to check for vulnerabilities

### Using Changesets

Changesets is a tool for managing versioning and changelogs in monorepos.

**Installation:**
```bash
pnpm add -Dw @changesets/cli
```

**Initialize:**
```bash
pnpm changeset init
```

This creates a `.changeset` directory with configuration.

**Adding changesets:**
```bash
pnpm changeset
```

Interactive prompt to create a changeset. Creates markdown files in `.changeset/` directory.

**Versioning packages:**
```bash
pnpm changeset version
```

Bumps package versions and updates changelogs based on changesets.

**Publishing:**
```bash
# After versioning
pnpm install                    # Update lockfile
git add .
git commit -m "Version packages"
pnpm publish -r                # Publish all updated packages
```

**GitHub Actions workflow:**
```yaml
name: Release
on:
  push:
    branches:
      - main
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm publish -r
          version: pnpm changeset version
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Changeset workflow:**
1. Developer creates changeset: `pnpm changeset`
2. Changeset file committed to repository
3. CI/CD runs `pnpm changeset version` to bump versions
4. CI/CD publishes packages: `pnpm publish -r`

### Docker

**Basic Dockerfile:**
```dockerfile
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Production dependencies
FROM base AS prod-deps
COPY pnpm-lock.yaml package.json ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile

# Build stage
FROM base AS build
COPY pnpm-lock.yaml package.json ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Final stage
FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 8000
CMD ["pnpm", "start"]
```

**Multi-stage build with BuildKit cache:**
```dockerfile
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

# Production dependencies
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile

# Build
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile
RUN pnpm run build

# Final
FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 8000
CMD ["pnpm", "start"]
```

**Monorepo with multiple apps:**
```dockerfile
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Build stage
FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=app1 --prod /prod/app1
RUN pnpm deploy --filter=app2 --prod /prod/app2

# App1
FROM base AS app1
COPY --from=build /prod/app1 /prod/app1
WORKDIR /prod/app1
EXPOSE 8000
CMD ["pnpm", "start"]

# App2
FROM base AS app2
COPY --from=build /prod/app2 /prod/app2
WORKDIR /prod/app2
EXPOSE 8001
CMD ["pnpm", "start"]
```

**Build commands:**
```bash
# Build with BuildKit cache
DOCKER_BUILDKIT=1 docker build . --target app1 --tag app1:latest

# Build specific target
docker build . --target app1 --tag app1:latest
docker build . --target app2 --tag app2:latest
```

**CI/CD without BuildKit cache:**
```dockerfile
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Production stage
FROM base AS prod
COPY pnpm-lock.yaml /app
WORKDIR /app
RUN pnpm fetch --prod
COPY . /app
RUN pnpm install --offline --prod
RUN pnpm run build

# Final stage
FROM base
COPY --from=prod /app/node_modules /app/node_modules
COPY --from=prod /app/dist /app/dist
EXPOSE 8000
CMD ["pnpm", "start"]
```

**Docker best practices:**
- Use multi-stage builds to reduce image size
- Leverage BuildKit cache mounts for faster builds
- Copy `pnpm-lock.yaml` before source code for better layer caching
- Use `pnpm fetch` in CI/CD when cache mounts aren't available
- Use `--frozen-lockfile` for reproducible builds

### Podman

Podman supports copy-on-write filesystems (Btrfs) for efficient file sharing.

**Basic Dockerfile:**
```dockerfile
FROM node:20-slim
RUN corepack enable
VOLUME [ "/pnpm-store", "/app/node_modules" ]
RUN pnpm config --global set store-dir /pnpm-store
COPY package.json pnpm-lock.yaml /app/
WORKDIR /app
RUN pnpm install
COPY . .
RUN pnpm run build
```

**Build with volume mounts:**
```bash
podman build . --tag my-app:latest \
  -v "$HOME/.local/share/pnpm/store:/pnpm-store" \
  -v "$(pwd)/node_modules:/app/node_modules"
```

**Benefits:**
- Reuses host store via reflinks (Btrfs)
- Shares `node_modules` between host and container
- Faster builds and reduced disk usage

**Note:** Requires Btrfs or similar copy-on-write filesystem on host.

### Migration from npm/Yarn

1. **Delete existing files:**
   ```bash
   rm -rf node_modules package-lock.json  # npm
   rm -rf node_modules yarn.lock          # Yarn
   ```

2. **Install with pnpm:**
   ```bash
   pnpm install
   ```

3. **Update scripts:**
   - Replace `npm run` with `pnpm run` (or just `pnpm`)
   - Replace `npx` with `pnpm dlx`

### Monorepo Setup

1. **Create `pnpm-workspace.yaml`:**
   ```yaml
   packages:
     - 'packages/*'
     - 'apps/*'
   ```

2. **Use workspace protocol:**
   ```json
   {
     "dependencies": {
       "my-package": "workspace:*"
     }
   }
   ```

3. **Run commands:**
   ```bash
   pnpm -r build                        # Build all packages
   pnpm --filter my-app start           # Start specific app
   ```

### Command Line Tab Completion

pnpm offers command-line tab-completion for Bash, Zsh, Fish, and similar shells.

**Bash:**
```bash
# Generate completion file
pnpm completion bash > ~/completion-for-pnpm.bash

# Add to .bashrc
echo 'source ~/completion-for-pnpm.bash' >> ~/.bashrc

# Reload shell
source ~/.bashrc
```

**Zsh:**
```bash
# Generate completion file
pnpm completion zsh > ~/.zsh/_pnpm

# Add to .zshrc
echo 'fpath+=~/.zsh' >> ~/.zshrc

# Reload shell
source ~/.zshrc
```

**Fish:**
```bash
# Generate completion file
pnpm completion fish > ~/.config/fish/completions/pnpm.fish

# Reload shell (or restart terminal)
```

**PowerShell (Windows):**
```powershell
# Generate completion script
pnpm completion powershell > $PROFILE

# Or add to specific profile
pnpm completion powershell >> $PROFILE.AllUsersAllHosts
```

**Removing old completions:**
If you have completions from older pnpm versions, remove them first to avoid conflicts:

```bash
# Remove old completion files
rm ~/completion-for-pnpm.bash
rm ~/.zsh/_pnpm
rm ~/.config/fish/completions/pnpm.fish
```

**Features:**
- Tab completion for all pnpm commands
- Completion for package names (when applicable)
- Completion for options and flags
- Context-aware suggestions

### Aliases

pnpm supports package aliases, allowing you to install multiple versions of the same package or create alternative names.

**Basic aliases:**
```bash
# Install package with alias
pnpm add bar@npm:foo

# In package.json
{
  "dependencies": {
    "bar": "npm:foo@^1.0.0"
  }
}
```

**Multiple versions:**
```bash
# Install multiple versions of same package
pnpm add foo@1.0.0
pnpm add foo2@npm:foo@2.0.0

# Use both in code
import foo from 'foo';      // version 1.0.0
import foo2 from 'foo2';    // version 2.0.0
```

**Workspace aliases:**
```json
{
  "dependencies": {
    "bar": "workspace:foo@*"
  }
}
```

This creates alias `bar` pointing to workspace package `foo`. Before publish, converted to: `"bar": "npm:foo@1.0.0"`.

**Use cases:**
- Install multiple versions of the same package
- Create alternative package names
- Resolve naming conflicts
- Reference workspace packages with different names

**Example: Using React 17 and 18:**
```bash
pnpm add react@17
pnpm add react18@npm:react@18
```

```javascript
// Use both versions
import React from 'react';      // React 17
import React18 from 'react18';  // React 18
```

### Git Branch Lockfiles

pnpm supports Git branch lockfiles, allowing different lockfiles for different Git branches.

**Enable:**
```bash
# In .npmrc or pnpm-workspace.yaml
git-branch-lockfile=true
```

**How it works:**
- Each Git branch can have its own `pnpm-lock.yaml`
- Lockfiles are named: `pnpm-lock.<branch-name>.yaml`
- Main branch uses `pnpm-lock.yaml`
- Other branches use branch-specific lockfiles

**Example:**
```bash
# Main branch
pnpm-lock.yaml

# Feature branch
pnpm-lock.feature-branch.yaml

# Development branch
pnpm-lock.development.yaml
```

**Benefits:**
- Different branches can have different dependency versions
- Avoids merge conflicts in lockfiles
- Allows experimentation in branches
- Easier to manage divergent dependency trees

**Workflow:**
1. Enable `git-branch-lockfile=true`
2. Create feature branch: `git checkout -b feature`
3. Install dependencies: `pnpm install`
4. Creates `pnpm-lock.feature.yaml`
5. Merge back to main when ready

**Configuration:**
```yaml
# pnpm-workspace.yaml
git-branch-lockfile: true
```

Or in `.npmrc`:
```bash
git-branch-lockfile=true
```

**Note:** When merging branches, you may need to resolve lockfile differences. Consider using a tool like Changesets for version management.

### Supply Chain Security

**Block build scripts:**
```bash
# Block all build scripts by default
ignored-built-dependencies[]=*

# Allow specific packages
only-built-dependencies[]=package-name
```

**Minimum release age:**
```bash
# Delay adoption of new versions (7 days)
minimum-release-age=7d
```

**Strict peer dependencies:**
```bash
strict-peer-dependencies=true
```

**Audit and fix:**
```bash
# Check for vulnerabilities
pnpm audit

# Fix vulnerabilities
pnpm audit --fix
```

**Exact versions:**
```bash
# Use exact versions in production
save-exact=true
```

**Security best practices:**
1. **Block build scripts by default:**
   ```yaml
   # pnpm-workspace.yaml
   ignored-built-dependencies:
     - '*'
   only-built-dependencies:
     - trusted-package
   ```

2. **Use minimum release age:**
   ```bash
   minimum-release-age=7d
   ```
   Delays adoption of new package versions to ensure stability.

3. **Enable strict peer dependencies:**
   ```bash
   strict-peer-dependencies=true
   ```
   Prevents installation with missing or mismatched peer dependencies.

4. **Regular audits:**
   ```bash
   pnpm audit
   pnpm audit --fix
   ```

5. **Use exact versions in production:**
   ```bash
   save-exact=true
   ```

6. **Review lockfile changes:**
   Always review `pnpm-lock.yaml` changes in pull requests.

7. **Use trusted registries:**
   Configure private registries for internal packages.

### TypeScript

**TypeScript support:**
pnpm works seamlessly with TypeScript projects.

**Installation:**
```bash
pnpm add -D typescript @types/node
```

**TypeScript configuration:**
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "resolveJsonModule": true
  }
}
```

**Workspace with TypeScript:**
```bash
# Install TypeScript in workspace root
pnpm add -Dw typescript

# Install in specific package
pnpm add -D typescript --filter <package>
```

**TypeScript project references:**
```json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true
  },
  "references": [
    { "path": "../shared" }
  ]
}
```

**Build TypeScript:**
```bash
# Build all TypeScript packages
pnpm -r exec tsc --build

# Build specific package
pnpm --filter <package> exec tsc
```

**TypeScript best practices:**
- Use `pnpm-workspace.yaml` for monorepo TypeScript projects
- Leverage TypeScript project references for workspace packages
- Use `pnpm exec tsc` to run TypeScript compiler
- Install `@types/*` packages as dev dependencies

### Git

**Git integration:**
pnpm works well with Git workflows.

**Git ignore:**
```gitignore
# pnpm
node_modules/
.pnpm-store/
pnpm-lock.yaml
```

**Note:** `pnpm-lock.yaml` should be committed for reproducible builds.

**Git hooks:**
```bash
# Install husky
pnpm add -D husky

# Setup hooks
pnpm exec husky install
```

**Pre-commit example:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm lint
pnpm test
```

**Git LFS (if needed):**
```bash
# Track large files
git lfs track "*.tgz"
```

**Git workflow:**
1. Commit `pnpm-lock.yaml` with code changes
2. Use `--frozen-lockfile` in CI/CD
3. Review lockfile changes in pull requests
4. Use Git hooks for linting/testing

**Git best practices:**
- Always commit `pnpm-lock.yaml`
- Use `--frozen-lockfile` in CI/CD
- Review lockfile diffs in PRs
- Use Git hooks for quality checks

### Performance Optimization

```bash
# Prune unused packages from store
pnpm store prune

# Use public hoist patterns for common tools
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*

# Enable parallel installation
prefer-frozen-lockfile=false  # Allow lockfile updates
```

## Quick Reference

### Command Aliases

- `pnpm i` = `pnpm install`
- `pnpm add` = `pnpm install <package>`
- `pnpm rm` = `pnpm remove`
- `pnpm up` = `pnpm update`
- `pnpm -r` = `pnpm --recursive`
- `pnpm -w` = `pnpm --workspace-root`

### File Locations

- **Store:** `~/.pnpm-store` (default, same drive as project)
- **Lockfile:** `pnpm-lock.yaml` (project root)
- **Workspace config:** `pnpm-workspace.yaml` (repo root)
- **Hooks:** `.pnpmfile.cjs` (project root)
- **Config:** `.npmrc` (project or global)

### Important Notes

1. **Symlinks:** Some tools may not work with symlinks. Use `node-linker=hoisted` if needed.
2. **Lockfile:** Always commit `pnpm-lock.yaml` to version control.
3. **Store:** The store is shared across all projects. Prune regularly.
4. **Workspace:** Use `workspace:*` protocol for internal packages.
5. **Peer Dependencies:** pnpm is strict about peer deps by default. Configure as needed.

## Error Codes

### ERR_PNPM_UNEXPECTED_STORE

A modules directory is present and is linked to a different store directory.

**Cause:** The project's `node_modules` was created with a different store location.

**Solution:** If you changed the store directory intentionally, run `pnpm install` to reinstall dependencies using the new store.

### ERR_PNPM_NO_MATCHING_VERSION_INSIDE_WORKSPACE

A project has a workspace dependency that does not exist in the workspace.

**Example:**
```json
{
  "name": "foo",
  "version": "1.0.0",
  "dependencies": {
    "bar": "workspace:1.0.0"
  }
}
```

If only `bar@2.0.0` exists in the workspace, installation will fail.

**Solution:** Update all workspace protocol dependencies to match versions present in the workspace:
- Manually update `package.json` files
- Or run `pnpm -r update` to update all workspace packages

### ERR_PNPM_PEER_DEP_ISSUES

Installation fails when:
- Unresolved peer dependencies exist
- Peer dependencies don't match wanted ranges

**Solution:**
1. Install missing peer dependencies explicitly
2. Use `peerDependencyRules` in `package.json`:
   ```json
   {
     "pnpm": {
       "peerDependencyRules": {
         "ignoreMissing": ["@types/*"],
         "allowedVersions": {
           "react": "17 || 18"
         }
       }
     }
   }
   ```

### ERR_PNPM_OUTDATED_LOCKFILE

Installation cannot proceed without changes to the lockfile.

**Common causes:**
- `package.json` was modified without running `pnpm install`
- Lockfile changes were not committed
- CI environment with stale lockfile

**Solution:** Run `pnpm install` and commit the updated `pnpm-lock.yaml`.

### ERR_PNPM_TARBALL_INTEGRITY

Downloaded package tarball doesn't match expected integrity checksum.

**Possible causes:**
1. **npm registry:** Lockfile has incorrect integrity (bad merge conflict resolution)
2. **Custom registry:** Local metadata cache has old integrity checksum

**Solutions:**
- For npm registry: Fix lockfile integrity manually or regenerate
- For custom registry: Run `pnpm store prune` to clear metadata cache, then retry
- Verify package is downloaded from correct URL (shown in error message)

### ERR_PNPM_MISMATCHED_RELEASE_CHANNEL

The `use-node-version` config field defines a release channel different from version suffix.

**Invalid examples:**
- `rc/20.0.0` - `rc` channel with stable version
- `release/20.0.0-rc.0` - `release` channel with RC version
- `lts/Jod` - Invalid syntax

**Valid forms:**
- Stable: `X.Y.Z` or `release/X.Y.Z`
- RC: `X.Y.Z-rc.W` or `rc/X.Y.Z-rc.W`

**Solution:** Remove release channel prefix or correct version suffix.

### ERR_PNPM_INVALID_NODE_VERSION

The `use-node-version` config value has invalid syntax.

**Valid forms:**
- Stable release: `X.Y.Z` or `release/X.Y.Z` (X, Y, Z are integers)
- RC release: `X.Y.Z-rc.W` or `rc/X.Y.Z-rc.W` (X, Y, Z, W are integers)

**Solution:** Use correct version format matching one of the valid forms above.

## Frequently Asked Questions

### Why does node_modules use disk space if packages are in a global store?

pnpm creates **hard links** from the global store to project `node_modules` folders. Hard links point to the same disk location as the original files. The same 1MB appears in both locations but occupies only 1MB total on disk, not 2MB.

**Example:** If `foo` is 1MB:
- Appears as 1MB in project's `node_modules`
- Appears as 1MB in global store
- **Total disk usage: 1MB** (same space, different paths)

### Does pnpm work on Windows?

**Yes.** pnpm works on Windows. Since symbolic linking on Windows can be problematic, pnpm uses **junctions** instead of symlinks on Windows.

### Is the nested node_modules approach incompatible with Windows?

**No.** Early npm versions had issues with deep nesting, but pnpm:
- Stores all packages **flatly** in the store
- Uses **symbolic links** to create the dependency tree structure
- Does not create deep nested folders

### What about circular symlinks?

Circular symlinks are **avoided** because:
- Parent packages are placed in the **same** `node_modules` folder as their dependencies
- `foo`'s dependencies are not in `foo/node_modules`
- `foo` is in `node_modules` **together with** its own dependencies

### Why use hard links instead of symlinking directly to the global store?

One package can have **different sets of dependencies** on the same machine:
- Project A: `foo@1.0.0` depends on `bar@1.0.0`
- Project B: `foo@1.0.0` depends on `bar@1.1.0`

pnpm hard-links `foo@1.0.0` to each project to create different dependency sets. Direct symlinking would require Node's `--preserve-symlinks` flag, which has its own issues.

### Does pnpm work across different subvolumes in one Btrfs partition?

**Yes.** While Btrfs doesn't allow cross-device hardlinks between subvolumes, it permits **reflinks**. pnpm uses reflinks to share data between subvolumes.

### Does pnpm work across multiple drives or filesystems?

**Limited support.** The package store must be on the **same drive and filesystem** as installations, otherwise packages will be **copied** instead of linked (due to hard link limitations).

**Two scenarios:**

1. **Store path is specified:**
   - If store is on disk A and project on disk B → packages are **copied** (not linked)
   - Loses storage and performance benefits
   - **Solution:** Keep store and projects on same drive

2. **Store path is NOT specified:**
   - Multiple stores are created (one per drive/filesystem)
   - Disk A: `.pnpm-store` at filesystem root
   - Disk B: independent `.pnpm-store` at filesystem root
   - Projects maintain pnpm benefits, but each drive may have redundant packages

### What does pnpm stand for?

`pnpm` stands for **"performant npm"**.

### pnpm does not work with my project

In most cases, this means a dependency requires packages **not declared in its `package.json`**. This is a common mistake caused by flat `node_modules` in npm/Yarn.

**This is an error in the dependency** and should be fixed, but workarounds exist:

#### Solution 1: Use hoisted node_modules

Set `nodeLinker: "hoisted"` in `.npmrc` or `pnpm-workspace.yaml` to create a flat structure like npm.

#### Solution 2: Add missing dependency to your project

If a dependency needs `iterall` but doesn't declare it:

```bash
pnpm add iterall
```

This adds it to your project's `package.json` and makes it available.

#### Solution 3: Use pnpmfile hooks

Create `.pnpmfile.cjs` to add missing dependencies to buggy packages:

```javascript
module.exports = {
  hooks: {
    readPackage: (pkg) => {
      if (pkg.name === "inspectpack") {
        pkg.dependencies = pkg.dependencies || {};
        pkg.dependencies['babel-traverse'] = '^6.26.0';
      }
      return pkg;
    }
  }
};
```

**After creating `.pnpmfile.cjs`:**
1. Delete `pnpm-lock.yaml` only (no need to delete `node_modules`)
2. Run `pnpm install` to rebuild dependencies

## Limitations

### npm Lockfiles Not Supported

- `npm-shrinkwrap.json` and `package-lock.json` are **ignored**
- npm can install the same `name@version` multiple times with different dependency sets
- npm's lockfile reflects flat `node_modules` layout
- pnpm creates isolated layout by default, so it cannot respect npm's lockfile format

**Workaround:** Use `pnpm import` to convert npm lockfile to pnpm's format.

### Binstubs Are Shell Files

- Files in `node_modules/.bin` are **always shell files**, not symlinks to JS files
- Shell files help pluggable CLI apps find plugins in pnpm's unusual `node_modules` structure
- Very rarely an issue
- If you need a JS file, reference the original file directly instead

## Symlinked node_modules Structure

### Overview

pnpm creates a **non-flat** `node_modules` structure using symlinks and hard links. This ensures strict dependency isolation while maintaining disk space efficiency.

### Structure Details

**Key characteristics:**
- Only **direct dependencies** appear at the root of `node_modules`
- Dependencies of dependencies are stored in a **nested structure**
- Packages are **hard-linked** from the global store
- **Symlinks** create the dependency tree structure

### How It Works

1. **Global Store:** All packages stored once in content-addressable store
2. **Hard Links:** Packages hard-linked from store to project `node_modules`
3. **Symlinks:** Dependency tree created via symlinks, not deep nesting
4. **Isolation:** Each package only sees its declared dependencies

### Benefits

- **Strict dependency resolution:** No phantom dependencies
- **Disk space efficient:** One copy per package version
- **Fast installations:** Hard linking is faster than copying
- **Security:** Prevents access to undeclared dependencies

### Compatibility

If tools don't work with symlinks:
- Set `node-linker=hoisted` in `.npmrc` or `pnpm-workspace.yaml`
- Creates flat structure similar to npm/Yarn
- Loses strict isolation benefits

## Peer Dependency Resolution

### How pnpm Resolves Peer Dependencies

pnpm resolves peer dependencies **strictly** by default, ensuring:
- Peer dependencies are properly declared
- Versions match required ranges
- Missing peers cause installation to fail (unless configured otherwise)

### Resolution Strategy

1. **Check for peer dependencies** in package manifests
2. **Match versions** against required ranges
3. **Install peers** if `auto-install-peers=true`
4. **Fail installation** if peers are missing or mismatched (unless rules allow)

### Configuration Options

**Auto-install peers:**
```bash
auto-install-peers=true
```

**Strict peer dependencies:**
```bash
strict-peer-dependencies=true  # Fail on missing/mismatched peers
```

**Peer dependency rules in `package.json`:**
```json
{
  "pnpm": {
    "peerDependencyRules": {
      "allowedVersions": {
        "react": "17 || 18"
      },
      "ignoreMissing": ["@types/*"]
    }
  }
}
```

### Common Issues

**ERR_PNPM_PEER_DEP_ISSUES:**
- Unresolved peer dependencies
- Version mismatches
- Missing peer dependencies

**Solutions:**
1. Install missing peers explicitly
2. Use `peerDependencyRules` to allow/ignore specific peers
3. Set `auto-install-peers=true` to automatically install peers

### Best Practices

1. **Declare peer dependencies** in your package's `package.json`
2. **Use peerDependencyRules** to handle known issues
3. **Test with strict mode** to catch missing peers early
4. **Document peer requirements** clearly in package README

## Uninstalling pnpm

### Remove pnpm Binary

**If installed via npm:**
```bash
npm uninstall -g pnpm
```

**If installed via standalone script:**
- Remove pnpm binary from PATH
- Typically located in `~/.local/share/pnpm` or `~/.pnpm`
- Check your shell config (`.bashrc`, `.zshrc`, etc.) for pnpm PATH additions

**If installed via Corepack:**
```bash
corepack disable
```

### Remove Global Store

The pnpm store is located at:
- Default: `~/.pnpm-store` (or `%LOCALAPPDATA%\pnpm-store` on Windows)
- Custom: Check `pnpm config get store-dir`

**To remove the store:**
```bash
# Check store location
pnpm store path

# Remove store (optional - frees disk space)
rm -rf $(pnpm store path)
# Or on Windows:
rmdir /s $(pnpm store path)
```

**Warning:** Removing the store will require reinstalling all packages in all projects.

### Remove Configuration

**Global config:**
```bash
# Check config location
pnpm config get prefix

# Remove global .npmrc
rm ~/.npmrc  # or %APPDATA%\npm\etc\npmrc on Windows
```

**Project config:**
- Remove `.npmrc` from project directories
- Remove `pnpm-workspace.yaml` if no longer using workspaces

### Clean Up Shell Completions

**Bash:**
```bash
# Remove completion file
rm ~/completion-for-pnpm.bash
# Remove from .bashrc
# Edit ~/.bashrc and remove: source ~/completion-for-pnpm.bash
```

**Zsh:**
```bash
rm ~/.zsh/_pnpm
# Remove from .zshrc if added
```

**Fish:**
```bash
rm ~/.config/fish/completions/pnpm.fish
```

### Verify Removal

```bash
# Should show "command not found"
pnpm --version

# Check PATH
which pnpm  # Should return nothing
```

### Complete Removal Checklist

- [ ] Uninstall pnpm binary (npm/Corepack/standalone)
- [ ] Remove from PATH in shell config
- [ ] Remove global store (optional)
- [ ] Remove global `.npmrc` (if pnpm-specific)
- [ ] Remove shell completions
- [ ] Remove project `.npmrc` files (if pnpm-specific)
- [ ] Verify `pnpm` command no longer exists


