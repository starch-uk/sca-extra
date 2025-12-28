# Husky v9 Reference

Native Git hooks manager using `core.hooksPath` (Git 2.9+). Hooks = shell scripts in `.husky/`.

## Install

```bash
pnpm add -D husky
```

## Setup

```bash
pnpm exec husky init  # Creates .husky/pre-commit, adds prepare script
```

**Manual:** Add `"prepare": "husky"` to scripts, run `pnpm run prepare`, create hook files in `.husky/`.

## Hooks

Create files in `.husky/` named exactly: `pre-commit`, `pre-push`, `commit-msg`, etc. (no extensions).

```bash
echo "pnpm test" > .husky/pre-commit
echo "pnpm exec commitlint --edit \$1" > .husky/commit-msg
```

Use `$1`, `$2` for Git params (replaces v4's `HUSKY_GIT_PARAMS`).

### Hook Parameters

| Hook | Params |
|------|--------|
| `pre-commit`, `post-commit`, `pre-applypatch`, `post-applypatch`, `pre-auto-gc`, `pre-merge-commit` | None |
| `commit-msg`, `prepare-commit-msg` | `$1`=msg file |
| `pre-push` | `$1`=remote, `$2`=URL |
| `pre-rebase` | `$1`=upstream, `$2`=branch |
| `post-merge` | `$1`=squash flag |
| `post-checkout` | `$1`=prev HEAD, `$2`=new HEAD, `$3`=flag |
| `post-rewrite` | `$1`=command |

## Skip Hooks

```bash
git commit --no-verify        # Single command
HUSKY=0 git commit -m "msg"   # Session
```

Global disable: `export HUSKY=0` in `~/.config/husky/init.sh`

## Node Version Managers

For nvm/fnm/volta with Git GUIs, add to `~/.config/husky/init.sh`:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

## CI/Production

Set `HUSKY=0` env var, or:

```json
{"scripts": {"prepare": "husky || true"}}
```

## Subdirectory Projects

```json
{"scripts": {"prepare": "cd .. && husky frontend/.husky"}}
```

Hook must `cd` back: `cd frontend && pnpm test`

## Common Patterns

```bash
# .husky/pre-commit
pnpm exec lint-staged

# .husky/commit-msg
pnpm exec commitlint --edit $1

# .husky/pre-push (branch-specific)
[ "$(git rev-parse --abbrev-ref HEAD)" = "main" ] && pnpm run test:full
```

## Troubleshooting

- **Hooks not running:** Check filename exact, `git config core.hooksPath` → `.husky/_`, Git ≥2.9
- **Command not found:** Init node version manager in `~/.config/husky/init.sh`
- **After uninstall:** `git config --unset core.hooksPath`

## v4 Migration

- `package.json` hooks → `.husky/<hook>` files
- `jest` → `pnpm exec jest`
- `HUSKY_GIT_PARAMS` → `$1`, `$2`
- `HUSKY_SKIP_HOOKS` → `HUSKY=0`
