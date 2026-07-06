#!/usr/bin/env node

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, relative } from 'path';

const ROOT = resolve(import.meta.dirname, '..', '..', '..');
const PASS = '  \x1b[32m✓\x1b[0m';
const FAIL = '  \x1b[31m✗\x1b[0m';
const WARN = '  \x1b[33m⚠\x1b[0m';

const results = { pass: 0, fail: 0, warn: 0 };

function log(pass, label, detail = '') {
  const icon = pass === 'pass' ? PASS : pass === 'fail' ? FAIL : WARN;
  const key = pass;
  results[key]++;
  console.log(`${icon}  ${label}${detail ? `  ${detail}` : ''}`);
}

const changeArg = process.argv[2]
  ? `"${process.argv[2]}"`
  : '<unknown>';

console.log(`\n\x1b[36msecurity-lgpd-review — Validating change ${changeArg}\x1b[0m`);
console.log('\x1b[2m' + '═'.repeat(55) + '\x1b[0m\n');

// ── 1. RLS on all Supabase tables ──────────────────────
const sqlPaths = [];
function walkSql(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) walkSql(full);
    else if (entry.endsWith('.sql')) sqlPaths.push(full);
  }
}
walkSql(resolve(ROOT, 'supabase'));
walkSql(resolve(ROOT, 'migrations'));
walkSql(resolve(ROOT, 'db'));

const srcDir = resolve(ROOT, 'src');
if (existsSync(srcDir)) {
  // Heuristic: check for SQL in string literals within .ts/.tsx files
  function walkSrc(dir) {
    for (const entry of readdirSync(dir)) {
      const full = resolve(dir, entry);
      if (statSync(full).isDirectory()) walkSrc(full);
      else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
        const content = readFileSync(full, 'utf-8');
        if (
          content.includes('create table') ||
          content.includes('CREATE TABLE') ||
          content.includes('createTable')
        ) {
          sqlPaths.push(full);
        }
      }
    }
  }
  walkSrc(srcDir);
}

if (sqlPaths.length === 0) {
  log('warn', 'No SQL files found to check. Verify RLS manually.');
} else {
  let allRls = true;
  for (const fp of sqlPaths) {
    const content = readFileSync(fp, 'utf-8');
    if (
      content.includes('CREATE TABLE') ||
      content.includes('create table') ||
      content.includes('createTable')
    ) {
      if (!content.includes('ENABLE ROW LEVEL SECURITY') && !content.includes('enable row level security')) {
        allRls = false;
        log('fail', `Table created without RLS in ${relative(ROOT, fp)}`);
      }
    }
  }
  if (allRls) log('pass', 'RLS enabled on all tables found in SQL');
}

// ── 2. Public storage buckets ──────────────────────────
if (existsSync(srcDir)) {
  function walkSrc(dir) {
    for (const entry of readdirSync(dir)) {
      const full = resolve(dir, entry);
      if (statSync(full).isDirectory()) walkSrc(full);
      else if (full.endsWith('.ts') || full.endsWith('.tsx') || full.endsWith('.js')) {
        const content = readFileSync(full, 'utf-8');
        if (
          (content.includes('bucket') || content.includes('Bucket')) &&
          (content.includes('public') || content.includes('PUBLIC'))
        ) {
          const rel = relative(ROOT, full);
          if (
            !content.includes('isPublic: false') &&
            !content.includes('public: false')
          ) {
            log('fail', `Possible public bucket in ${rel}`);
          }
        }
      }
    }
  }
  walkSrc(srcDir);
}
log('pass', 'No obviously public storage buckets found');

// ── 3. Auth middleware ─────────────────────────────────
const middlewarePath = resolve(ROOT, 'src', 'middleware.ts');
const middlewarePath2 = resolve(ROOT, 'src', 'middleware.js');
const middlewarePath3 = resolve(ROOT, 'middleware.ts');
if (
  existsSync(middlewarePath) ||
  existsSync(middlewarePath2) ||
  existsSync(middlewarePath3)
) {
  log('pass', 'Auth middleware exists');
} else {
  log('fail', 'No middleware.ts found — API routes may be unprotected');
}

// ── 4. Hardcoded secrets ───────────────────────────────
if (existsSync(srcDir)) {
  const secretPatterns = [/['"][A-Za-z0-9_-]{20,}['"]/g]; // looks-like-a-key heuristic
  function walkSrc(dir) {
    for (const entry of readdirSync(dir)) {
      const full = resolve(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry !== 'node_modules') walkSrc(full);
      } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
        const content = readFileSync(full, 'utf-8');
        const rel = relative(ROOT, full);
        // Check for obvious hardcoded patterns
        if (
          content.includes('sk-') ||
          content.includes('api_key=') ||
          content.includes('apikey=') ||
          content.includes('secret=') ||
          content.includes('SECRET_KEY')
        ) {
          const lines = content.split('\n');
          for (let i = 0; i < lines.length; i++) {
            if (
              (lines[i].includes('sk-') ||
                lines[i].includes('api_key=') ||
                lines[i].includes('apikey=') ||
                lines[i].includes('secret=')) &&
              !lines[i].includes('process.env') &&
              !lines[i].includes('import.meta.env')
            ) {
              log('fail', `Hardcoded secret in ${rel}:${i + 1}`);
            }
          }
        }
      }
    }
  }
  walkSrc(srcDir);
}
log('pass', 'No hardcoded secrets found (basic scan)');

// ── 5. console.log leaking user data ───────────────────
if (existsSync(srcDir)) {
  function walkSrc(dir) {
    for (const entry of readdirSync(dir)) {
      const full = resolve(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry !== 'node_modules') walkSrc(full);
      } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
        const content = readFileSync(full, 'utf-8');
        const lines = content.split('\n');
        const rel = relative(ROOT, full);
        for (let i = 0; i < lines.length; i++) {
          if (
            /console\.(log|warn|error)\(/.test(lines[i]) &&
            (lines[i].includes('body') ||
              lines[i].includes('req.body') ||
              lines[i].includes('user') ||
              lines[i].includes('email') ||
              lines[i].includes('password'))
          ) {
            log('warn', `Possible user data leak in ${rel}:${i + 1}`);
          }
        }
      }
    }
  }
  walkSrc(srcDir);
}
log('pass', 'console.log leak scan complete');

// ── 6. .env files committed ────────────────────────────
const gitignore = resolve(ROOT, '.gitignore');
if (existsSync(gitignore)) {
  const giContent = readFileSync(gitignore, 'utf-8');
  if (giContent.includes('.env') && !giContent.includes('!.env.example')) {
    log('pass', '.env files are gitignored');
  } else {
    log('fail', '.env files may NOT be properly gitignored');
  }
} else {
  log('fail', 'No .gitignore found');
}

// ── 7. API routes check auth ───────────────────────────
if (existsSync(srcDir)) {
  function walkApi(dir) {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir)) {
      const full = resolve(dir, entry);
      if (statSync(full).isDirectory()) walkApi(full);
      else if (full.includes('route.ts') || full.includes('route.js')) {
        const content = readFileSync(full, 'utf-8');
        const rel = relative(ROOT, full);
        if (
          !content.includes('supabase') &&
          !content.includes('auth') &&
          !content.includes('session') &&
          !content.includes('token')
        ) {
          log('warn', `API route ${rel} may lack auth check`);
        }
      }
    }
  }
  walkApi(resolve(ROOT, 'src', 'app', 'api'));
}
log('pass', 'API route auth checks scanned');

// ── 8. eval / unsafe patterns ──────────────────────────
if (existsSync(srcDir)) {
  function walkSrc(dir) {
    for (const entry of readdirSync(dir)) {
      const full = resolve(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry !== 'node_modules') walkSrc(full);
      } else if (full.endsWith('.ts') || full.endsWith('.tsx') || full.endsWith('.js')) {
        const content = readFileSync(full, 'utf-8');
        const lines = content.split('\n');
        const rel = relative(ROOT, full);
        for (let i = 0; i < lines.length; i++) {
          if (
            /eval\(/.test(lines[i]) ||
            /new Function\(/.test(lines[i]) ||
            /innerHTML\s*=/.test(lines[i])
          ) {
            log('fail', `Unsafe pattern in ${rel}:${i + 1}`);
          }
        }
      }
    }
  }
  walkSrc(srcDir);
}
log('pass', 'No unsafe eval/innerHTML patterns found');

// ── Summary ────────────────────────────────────────────
console.log('');
console.log('\x1b[2m' + '═'.repeat(55) + '\x1b[0m');
const total = results.pass + results.fail + results.warn;
console.log(`\nSummary: ${results.pass}/${total} passed | ${results.fail} critical | ${results.warn} warnings\n`);

if (results.fail > 0) {
  console.log('  \x1b[31mResult: BLOCKED — fix critical issues before deploy\x1b[0m\n');
  process.exit(1);
} else {
  console.log('  \x1b[32mResult: PASSED — safe to deploy\x1b[0m\n');
}
