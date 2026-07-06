# Skill: Security & LGPD Review

Post-apply validation harness. Run AFTER any change implementation to catch security and privacy issues before deploy.

## Usage

```
/security-lgpd-review
```

Or from command line:

```
node .opencode/skills/security-lgpd-review/validate.mjs
```

## What It Checks

| Check # | Rule | Severity |
|---------|------|----------|
| 1 | Supabase RLS enabled on all tables | CRITICAL |
| 2 | Storage buckets not public | CRITICAL |
| 3 | Auth middleware exists in protected routes | HIGH |
| 4 | No hardcoded secrets/tokens in source | HIGH |
| 5 | No console.log of request.body/user data | MEDIUM |
| 6 | `.env` files not committed to git | HIGH |
| 7 | API routes check authentication | HIGH |
| 8 | No eval() or unsafe dynamic imports | MEDIUM |

## Expected Output

```
security-lgpd-review — Validating change "<name>"
═══════════════════════════════════════════════

[PASS]  RLS enabled on all tables
[FAIL]  Storage bucket 'curriculos' is public  ← FIX: set to private in Supabase dashboard
[PASS]  Auth middleware present
[PASS]  No hardcoded secrets found
[WARN]  src/app/api/jobs/route.ts:12 — console.log(body) may leak user data
...

Summary: 5/8 passed | 1 critical | 1 warning

Result: BLOCKED — fix critical issues before deploy
```

## Integration

This runs automatically after every `/opsx-apply`. The validation result determines if the change is "safe to deploy" or needs fixes.

## Guardrails

- Script only reads files, never modifies them
- False positives can happen — review manually if unsure
- Add new checks by editing `validate.mjs`
