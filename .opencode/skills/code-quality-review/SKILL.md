# Skill: Code Quality Review

Post-apply validation harness. Scans the codebase for best practices, conventions, and quality issues after any change.

## Usage

```
/code-quality-review
```

Or from command line:

```
node .opencode/skills/code-quality-review/validate.mjs
```

## What It Checks

| # | Rule | Severity |
|---|------|----------|
| 1 | File naming: components PascalCase, utilities kebab-case | HIGH |
| 2 | No `console.log` in production code | HIGH |
| 3 | No `TODO / FIXME / HACK` in committed code | MEDIUM |
| 4 | No commented-out code blocks (3+ consecutive commented lines) | MEDIUM |
| 5 | Files under 300 lines (readability) | LOW |
| 6 | React Server Components: correct `'use client'` placement | HIGH |
| 7 | Async functions have try/catch error handling | HIGH |
| 8 | No `any` types in TypeScript | MEDIUM |
| 9 | Named exports preferred over default exports | LOW |
| 10 | Tailwind class ordering (no arbitrary order) | LOW |

## Integration

Runs alongside security-lgpd-review after every `/opsx-apply`. Both must pass before deploy.

## Guardrails

- Script only reads files, never modifies them
- False positives possible — review manually if unsure
- Add new checks by editing `validate.mjs`
