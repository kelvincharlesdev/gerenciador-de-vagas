#!/usr/bin/env node

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, relative } from 'path';

const ROOT = resolve(import.meta.dirname, '..', '..', '..');
const PASS = '  \x1b[32m✓\x1b[0m';
const FAIL = '  \x1b[31m✗\x1b[0m';
const WARN = '  \x1b[33m⚠\x1b[0m';

const results = { pass: 0, fail: 0, warn: 0 };

function log(status, label, detail = '') {
  const icon = status === 'pass' ? PASS : status === 'fail' ? FAIL : WARN;
  results[status]++;
  console.log(`${icon}  ${label}${detail ? `  ${detail}` : ''}`);
}

function walkFiles(dir, predicate) {
  const files = [];
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry !== 'node_modules' && entry !== '.next' && !entry.startsWith('.')) {
        files.push(...walkFiles(full, predicate));
      }
    } else if (predicate(entry)) {
      files.push(full);
    }
  }
  return files;
}

const changeName = process.argv[2] ? `"${process.argv[2]}"` : '<unknown>';

console.log(`\n\x1b[36mcode-quality-review — Validating change ${changeName}\x1b[0m`);
console.log('\x1b[2m' + '═'.repeat(55) + '\x1b[0m\n');

const srcDir = resolve(ROOT, 'src');
if (!existsSync(srcDir)) {
  log('warn', 'No src/ directory found — project may not be initialized yet');
  process.exit(0);
}

// ── 1. File naming conventions ────────────────────────
const components = walkFiles(resolve(srcDir, 'app'), (n) => n.endsWith('.tsx'));
const shared = walkFiles(resolve(srcDir, 'components'), (n) => n.endsWith('.tsx'));
const utils = walkFiles(resolve(srcDir, 'lib'), (n) => n.endsWith('.ts'));
const services = walkFiles(resolve(srcDir, 'services'), (n) => n.endsWith('.ts'));

let namingIssues = 0;
for (const fp of [...components, ...shared]) {
  const name = fp.split(/[\\/]/).pop();
  if (name === 'page.tsx' || name === 'layout.tsx' || name === 'loading.tsx' || name === 'error.tsx' || name === 'route.ts') continue;
  if (!/^[A-Z]/.test(name)) {
    namingIssues++;
    if (namingIssues <= 3) log('warn', `Component should be PascalCase: ${relative(ROOT, fp)}`);
  }
}
for (const fp of [...utils, ...services]) {
  const name = fp.split(/[\\/]/).pop();
  if (!/^[a-z]/.test(name) && !name.includes('-') && !name.includes('.')) {
    namingIssues++;
    if (namingIssues <= 3) log('warn', `Utility should be kebab-case: ${relative(ROOT, fp)}`);
  }
}
if (namingIssues === 0) log('pass', 'File naming conventions followed');
else log('warn', `File naming conventions: ${namingIssues} potential issues (showing first 3)`);

// ── 2. No console.log in production ────────────────────
consoleLogs: {
  const files = walkFiles(srcDir, (n) => n.endsWith('.ts') || n.endsWith('.tsx'));
  let count = 0;
  for (const fp of files) {
    const content = readFileSync(fp, 'utf-8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (/console\.(log|trace)\(/.test(lines[i]) && !lines[i].includes('console.error')) {
        count++;
        if (count <= 3) log('fail', `console.log in ${relative(ROOT, fp)}:${i + 1}`);
      }
    }
  }
  if (count === 0) log('pass', 'No console.log in production code');
  else log('fail', `Found ${count} console.log statements`);
}

// ── 3. TODO / FIXME / HACK ─────────────────────────────
todos: {
  const files = walkFiles(srcDir, (n) => n.endsWith('.ts') || n.endsWith('.tsx'));
  let count = 0;
  for (const fp of files) {
    const content = readFileSync(fp, 'utf-8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (/TODO|FIXME|HACK/.test(lines[i]) && !lines[i].includes('// eslint')) {
        count++;
        if (count <= 3) log('warn', `TODO/FIXME in ${relative(ROOT, fp)}:${i + 1}`);
      }
    }
  }
  if (count === 0) log('pass', 'No TODO/FIXME/HACK in code');
  else log('warn', `Found ${count} TODO/FIXME/HACK markers`);
}

// ── 4. Commented-out code blocks ───────────────────────
commentedCode: {
  const files = walkFiles(srcDir, (n) => n.endsWith('.ts') || n.endsWith('.tsx'));
  let count = 0;
  for (const fp of files) {
    const content = readFileSync(fp, 'utf-8');
    const lines = content.split('\n');
    let commentBlock = 0;
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed.startsWith('// ') && (trimmed.includes('=>') || trimmed.includes('function') || trimmed.includes('const ') || trimmed.includes('import '))) {
        commentBlock++;
        if (commentBlock >= 3) {
          count++;
          if (count <= 2) log('warn', `Commented-out code block in ${relative(ROOT, fp)}:${i + 1}`);
        }
      } else {
        commentBlock = 0;
      }
    }
  }
  if (count === 0) log('pass', 'No commented-out code blocks');
  else log('warn', `Found ${count} commented-out code blocks`);
}

// ── 5. File size limits ────────────────────────────────
fileSize: {
  const files = walkFiles(srcDir, (n) => n.endsWith('.ts') || n.endsWith('.tsx'));
  let large = 0;
  for (const fp of files) {
    const content = readFileSync(fp, 'utf-8');
    const lineCount = content.split('\n').length;
    if (lineCount > 300) {
      large++;
      if (large <= 3) log('warn', `File > 300 lines: ${relative(ROOT, fp)} (${lineCount} lines)`);
    }
  }
  if (large === 0) log('pass', 'All files under 300 lines');
  else log('warn', `${large} files exceed 300 lines`);
}

// ── 6. React Server Components — 'use client' ──────────
rsc: {
  const pageFiles = walkFiles(resolve(srcDir, 'app'), (n) => n.endsWith('.tsx'));
  let issues = 0;
  for (const fp of pageFiles) {
    const content = readFileSync(fp, 'utf-8');
    if (fp.includes('layout.tsx') || fp.includes('page.tsx')) {
      if (
        content.includes('useState') ||
        content.includes('useEffect') ||
        content.includes('onClick') ||
        content.includes('onSubmit')
      ) {
        if (!content.includes("'use client'") && !content.includes('"use client"')) {
          issues++;
          if (issues <= 3) log('fail', `Missing 'use client' in ${relative(ROOT, fp)} (has client-side code)`);
        }
      }
    }
  }
  if (issues === 0) log('pass', 'React Server Component conventions followed');
  else log('fail', `${issues} files missing 'use client' directive`);
}

// ── 7. Async functions with try/catch ──────────────────
errorHandling: {
  const files = walkFiles(srcDir, (n) => n.endsWith('.ts') || n.endsWith('.tsx'));
  let missing = 0;
  for (const fp of files) {
    const content = readFileSync(fp, 'utf-8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (/async\s+function/.test(lines[i]) || /async\s+\(/.test(lines[i]) || /\.catch\(/.test(lines[i])) {
        // Has some error handling, skip
      }
      const nextFew = lines.slice(i, i + 10).join('\n');
      if (/^\s*(export\s+)?async\s+(function|\([\w\s,]*\)\s*=>)/.test(lines[i])) {
        if (!nextFew.includes('try') && !nextFew.includes('.catch') && !nextFew.includes('.then')) {
          missing++;
          if (missing <= 3) log('warn', `Async function without try/catch in ${relative(ROOT, fp)}:${i + 1}`);
        }
      }
    }
  }
  if (missing === 0) log('pass', 'Async functions have error handling');
  else log('warn', `${missing} async functions without try/catch`);
}

// ── 8. No `any` types ─────────────────────────────────
noAny: {
  const files = walkFiles(srcDir, (n) => n.endsWith('.ts') || n.endsWith('.tsx'));
  let count = 0;
  for (const fp of files) {
    const content = readFileSync(fp, 'utf-8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (
        (trimmed.includes(': any') || trimmed.includes('<any>') || trimmed.includes('as any')) &&
        !trimmed.includes('// eslint-disable') &&
        !trimmed.includes('// @ts-')
      ) {
        count++;
        if (count <= 3) log('fail', `'any' type used in ${relative(ROOT, fp)}:${i + 1}`);
      }
    }
  }
  if (count === 0) log('pass', 'No `any` types found');
  else log('fail', `Found ${count} \`any\` type usages`);
}

// ── 9. Named vs default exports ────────────────────────
exports: {
  const files = walkFiles(srcDir, (n) => n.endsWith('.ts') || n.endsWith('.tsx'));
  let defaults = 0;
  for (const fp of files) {
    const content = readFileSync(fp, 'utf-8');
    if (/export\s+default/.test(content)) {
      defaults++;
    }
  }
  if (defaults <= files.length * 0.3) log('pass', `Most exports are named (${defaults} default out of ${files.length} files)`);
  else log('warn', `${defaults}/${files.length} files use default exports — prefer named exports`);
}

// ── 10. Tailwind class length heuristic ────────────────
tailwind: {
  const files = walkFiles(srcDir, (n) => n.endsWith('.tsx'));
  let issues = 0;
  for (const fp of files) {
    const content = readFileSync(fp, 'utf-8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(/className=["'][^"']{120,}["']/);
      if (match) {
        issues++;
        if (issues <= 3) log('warn', `Very long className (${match[0].length - 12} chars) in ${relative(ROOT, fp)}:${i + 1}`);
      }
    }
  }
  if (issues === 0) log('pass', 'Tailwind class lengths are reasonable');
  else log('warn', `${issues} very long className strings found`);
}

// ── Summary ────────────────────────────────────────────
console.log('');
console.log('\x1b[2m' + '═'.repeat(55) + '\x1b[0m');
const total = results.pass + results.fail + results.warn;
console.log(`\nSummary: ${results.pass}/${total} passed | ${results.fail} critical | ${results.warn} warnings\n`);

if (results.fail > 0) {
  console.log('  \x1b[31mResult: REVIEW NEEDED — fix critical issues before deploy\x1b[0m\n');
  process.exit(1);
} else {
  console.log('  \x1b[32mResult: PASSED — code quality OK\x1b[0m\n');
}
