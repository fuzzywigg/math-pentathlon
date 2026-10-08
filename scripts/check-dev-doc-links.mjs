#!/usr/bin/env node
/**
 * Report-only checker for docs/dev/engines/*.md path and symbol references.
 *
 * Looks for fenced blocks marked ```dev-doc-refs and verifies each line:
 *   - path/to/file.ts          → file exists under repo root
 *   - path/to/file.ts#Symbol   → file exists and Symbol appears as an identifier
 *
 * Also verifies relative markdown links that point into the repo
 * (./foo.md, ../wiki/bar.md, ../../src/...).
 *
 * Exit 0 always (report-only). Prints FAIL lines and a summary.
 *
 * Usage: node scripts/check-dev-doc-links.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs/dev/engines');

/** @type {{ file: string; ref: string; reason: string }[]} */
const failures = [];
/** @type {{ file: string; ok: number }[]} */
const perFile = [];

/**
 * @param {string} abs
 * @returns {boolean}
 */
function fileExists(abs) {
  try {
    return fs.statSync(abs).isFile();
  } catch {
    return false;
  }
}

/**
 * @param {string} source
 * @param {string} symbol
 * @returns {boolean}
 */
function symbolResolves(source, symbol) {
  // Declaration forms: export function Foo / type Foo / interface Foo / const Foo / class Foo / enum Foo
  const decl = new RegExp(
    String.raw`(?:export\s+)?(?:async\s+)?(?:function|type|interface|class|const|let|var|enum)\s+${escapeRe(symbol)}\b`,
  );
  if (decl.test(source)) return true;
  // Method / property shorthand still counts as "present" for private helpers
  const anyId = new RegExp(String.raw`\b${escapeRe(symbol)}\b`);
  return anyId.test(source);
}

/** @param {string} s */
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * @param {string} mdPath
 * @param {string} content
 */
function checkDevDocRefs(mdPath, content) {
  const relDoc = path.relative(ROOT, mdPath);
  let ok = 0;
  const blocks = content.matchAll(/```dev-doc-refs\n([\s\S]*?)```/g);
  for (const block of blocks) {
    const body = block[1];
    for (const rawLine of body.split('\n')) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const hash = line.indexOf('#');
      const filePart = hash === -1 ? line : line.slice(0, hash);
      const symbol = hash === -1 ? null : line.slice(hash + 1);
      if (!filePart || filePart.includes('..')) {
        failures.push({
          file: relDoc,
          ref: line,
          reason: 'invalid path (empty or contains ..)',
        });
        continue;
      }
      const abs = path.join(ROOT, filePart);
      if (!fileExists(abs)) {
        failures.push({
          file: relDoc,
          ref: line,
          reason: `missing file: ${filePart}`,
        });
        continue;
      }
      if (symbol) {
        const source = fs.readFileSync(abs, 'utf8');
        if (!symbolResolves(source, symbol)) {
          failures.push({
            file: relDoc,
            ref: line,
            reason: `symbol not found in ${filePart}: ${symbol}`,
          });
          continue;
        }
      }
      ok += 1;
    }
  }
  return ok;
}

/**
 * @param {string} mdPath
 * @param {string} content
 */
function checkRelativeMdLinks(mdPath, content) {
  const relDoc = path.relative(ROOT, mdPath);
  let ok = 0;
  // [text](./path) or [text](../path) — skip http(s), mailto, #anchors-only
  const linkRe = /\[[^\]]*]\(([^)]+)\)/g;
  for (const match of content.matchAll(linkRe)) {
    let href = match[1].trim();
    if (!href || href.startsWith('http') || href.startsWith('mailto:')) continue;
    if (href.startsWith('#')) continue;
    // strip optional title "..."
    href = href.replace(/\s+".*"$/, '').trim();
    const hashIdx = href.indexOf('#');
    const pathOnly = hashIdx === -1 ? href : href.slice(0, hashIdx);
    if (!pathOnly) continue;
    if (
      !pathOnly.startsWith('./') &&
      !pathOnly.startsWith('../') &&
      !pathOnly.startsWith('/')
    ) {
      // github issue links like #475 — already skipped via #; bare relative without ./ is rare
      continue;
    }
    const abs = path.resolve(path.dirname(mdPath), pathOnly);
    if (!abs.startsWith(ROOT)) {
      failures.push({
        file: relDoc,
        ref: href,
        reason: 'link escapes repo root',
      });
      continue;
    }
    if (!fileExists(abs) && !fs.existsSync(abs)) {
      failures.push({
        file: relDoc,
        ref: href,
        reason: `broken relative link → ${path.relative(ROOT, abs)}`,
      });
      continue;
    }
    ok += 1;
  }
  return ok;
}

function main() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`FAIL: missing ${path.relative(ROOT, DOCS_DIR)}`);
    console.log('check-dev-doc-links: 0 ok, 1 structural failure (report-only, exit 0)');
    process.exit(0);
  }

  const files = fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => path.join(DOCS_DIR, f));

  if (files.length === 0) {
    failures.push({
      file: 'docs/dev/engines/',
      ref: '*.md',
      reason: 'no markdown files found',
    });
  }

  for (const mdPath of files) {
    const content = fs.readFileSync(mdPath, 'utf8');
    const a = checkDevDocRefs(mdPath, content);
    const b = checkRelativeMdLinks(mdPath, content);
    perFile.push({ file: path.relative(ROOT, mdPath), ok: a + b });
    if (a === 0 && path.basename(mdPath) !== 'README.md') {
      // README may use only relative links; game docs must have a refs block
      const hasBlock = /```dev-doc-refs\n/.test(content);
      if (!hasBlock) {
        failures.push({
          file: path.relative(ROOT, mdPath),
          ref: '```dev-doc-refs',
          reason: 'missing required dev-doc-refs fence',
        });
      }
    }
  }

  // Expect one README + 20 game docs
  const gameDocs = files.filter((f) => path.basename(f) !== 'README.md');
  if (gameDocs.length !== 20) {
    failures.push({
      file: 'docs/dev/engines/',
      ref: 'game docs',
      reason: `expected 20 game docs, found ${gameDocs.length}`,
    });
  }

  console.log('check-dev-doc-links — docs/dev/engines');
  console.log(`files scanned: ${files.length}`);
  for (const row of perFile) {
    console.log(`  OK ${row.ok.toString().padStart(3)}  ${row.file}`);
  }

  if (failures.length === 0) {
    console.log('\nPASS: all path/symbol references resolve');
  } else {
    console.log(`\nFAIL: ${failures.length} issue(s)`);
    for (const f of failures) {
      console.log(`  - ${f.file}: ${f.ref} — ${f.reason}`);
    }
  }

  const totalOk = perFile.reduce((n, r) => n + r.ok, 0);
  console.log(
    `\ncheck-dev-doc-links: ${totalOk} refs ok, ${failures.length} failure(s) (report-only, exit 0)`,
  );
  process.exit(0);
}

main();
