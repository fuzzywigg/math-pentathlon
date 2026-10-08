#!/usr/bin/env node
/**
 * Report-only checker for docs/dev/engines/*.md references.
 *
 * Verifies:
 *   1. Backtick paths that look like repo files (src/, tests/, docs/, scripts/)
 *   2. Rows in "| Symbol | File |" tables — symbol must appear in that file
 *   3. Relative markdown links under docs/
 *
 * Always exits 0 (report-only). Prints a summary + any missing refs.
 *
 * Usage: node scripts/check-dev-doc-links.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs/dev/engines');

const PATH_RE =
  /`((?:src|tests|docs|scripts)\/[A-Za-z0-9_./@+-]+\.(?:ts|tsx|js|mjs|css|md|json))`/g;
const MD_LINK_RE = /\]\(([^)]+)\)/g;
const TABLE_ROW_RE =
  /^\|\s*`([^`]+)`\s*\|\s*`((?:src|tests|docs|scripts)\/[^`]+)`\s*\|/;
const MODULE_ROW_RE =
  /^\|\s*\*\(module\)\*\s*\|\s*`((?:src|tests|docs|scripts)\/[^`]+)`\s*\|/;

/**
 * @param {string} fileRel
 * @param {string} symbol
 */
function symbolInFile(fileRel, symbol) {
  if (symbol === '*(module)*') return true;
  const abs = path.join(ROOT, fileRel);
  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) return false;
  const text = fs.readFileSync(abs, 'utf8');
  const escaped = symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(
      String.raw`export\s+(?:async\s+)?function\s+${escaped}\b`
    ),
    new RegExp(
      String.raw`export\s+(?:type|interface|enum|class|const)\s+${escaped}\b`
    ),
    new RegExp(
      String.raw`\b(?:function|const|type|interface|class)\s+${escaped}\b`
    ),
    // Type-only re-exports / named exports in braces
    new RegExp(String.raw`export\s+\{[^}]*\b${escaped}\b`),
  ];
  return patterns.some((re) => re.test(text));
}

/**
 * @param {string} fromDocAbs
 * @param {string} href
 */
function resolveMdLink(fromDocAbs, href) {
  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('#') ||
    href.startsWith('mailto:')
  ) {
    return { skip: true };
  }
  const clean = href.split('#')[0].split('?')[0];
  if (!clean) return { skip: true };
  const abs = path.resolve(path.dirname(fromDocAbs), clean);
  return { abs, rel: path.relative(ROOT, abs) };
}

function listEngineDocs() {
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(DOCS_DIR, f))
    .sort();
}

function main() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.log(`check-dev-doc-links: missing ${DOCS_DIR}`);
    console.log('Report-only: exit 0');
    return;
  }

  /** @type {{ kind: string, doc: string, detail: string }[]} */
  const problems = [];
  let pathChecks = 0;
  let symbolChecks = 0;
  let linkChecks = 0;
  let docsScanned = 0;

  for (const docAbs of listEngineDocs()) {
    docsScanned += 1;
    const docRel = path.relative(ROOT, docAbs);
    const text = fs.readFileSync(docAbs, 'utf8');

    for (const match of text.matchAll(PATH_RE)) {
      pathChecks += 1;
      const rel = match[1];
      const abs = path.join(ROOT, rel);
      if (!fs.existsSync(abs)) {
        problems.push({
          kind: 'missing-path',
          doc: docRel,
          detail: rel,
        });
      }
    }

    for (const line of text.split('\n')) {
      const mod = line.match(MODULE_ROW_RE);
      if (mod) {
        pathChecks += 1;
        const rel = mod[1];
        if (!fs.existsSync(path.join(ROOT, rel))) {
          problems.push({
            kind: 'missing-module-path',
            doc: docRel,
            detail: rel,
          });
        }
        continue;
      }
      const row = line.match(TABLE_ROW_RE);
      if (!row) continue;
      const symbol = row[1];
      const fileRel = row[2];
      symbolChecks += 1;
      pathChecks += 1;
      if (!fs.existsSync(path.join(ROOT, fileRel))) {
        problems.push({
          kind: 'missing-symbol-file',
          doc: docRel,
          detail: `${symbol} -> ${fileRel}`,
        });
        continue;
      }
      if (!symbolInFile(fileRel, symbol)) {
        problems.push({
          kind: 'missing-symbol',
          doc: docRel,
          detail: `${symbol} not found in ${fileRel}`,
        });
      }
    }

    for (const match of text.matchAll(MD_LINK_RE)) {
      const href = match[1];
      const resolved = resolveMdLink(docAbs, href);
      if (resolved.skip) continue;
      linkChecks += 1;
      if (!fs.existsSync(resolved.abs)) {
        problems.push({
          kind: 'broken-md-link',
          doc: docRel,
          detail: `${href} -> ${resolved.rel}`,
        });
      }
    }
  }

  console.log('check-dev-doc-links (report-only)');
  console.log(`  docs scanned:    ${docsScanned}`);
  console.log(`  path checks:     ${pathChecks}`);
  console.log(`  symbol checks:   ${symbolChecks}`);
  console.log(`  md link checks:  ${linkChecks}`);
  console.log(`  problems:        ${problems.length}`);

  if (problems.length) {
    console.log('');
    for (const p of problems.slice(0, 200)) {
      console.log(`  [${p.kind}] ${p.doc}: ${p.detail}`);
    }
    if (problems.length > 200) {
      console.log(`  … ${problems.length - 200} more`);
    }
  } else {
    console.log('  all referenced paths/symbols resolved');
  }

  console.log('Report-only: exit 0');
}

main();
