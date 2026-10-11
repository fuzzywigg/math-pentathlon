#!/usr/bin/env node
/**
 * Report-only checker for Markdown under docs/ (recursive).
 *
 * Scopes: every .md file under docs/, including:
 *   - docs/*.md (top-level audits)
 *   - docs/dev/** (engineering notes, engines/, backlogs)
 *   - docs/wiki/**
 *   - docs/playtest/**
 *   - docs/mp3d/**, docs/gallery/**, docs/visuals/**, etc.
 *
 * Skipped generated dumps: none. (JSON/PNG siblings under docs/ are
 * not walked — only *.md. Tip-vs-alpha / triage dumps stay in scope.)
 *
 * Verifies:
 *   1. Backtick paths that look like repo files (src/, tests/, docs/, scripts/)
 *   2. Rows in "| Symbol | File |" tables — symbol must appear in that file
 *   3. Relative markdown links under docs/
 *
 * Always exits 0 (report-only). Prints a summary + any missing refs.
 * CLI --help / unknown-flag gating is not implemented: argv flags
 * (including --help / --wat) are ignored and a full scan still runs
 * (exit 0). Do not treat header docs as implementing argv behavior.
 * Tip owner may later opt into fail-on-missing; do not flip that here.
 *
 * Usage:
 *   npm run check:dev-docs
 *   node scripts/check-dev-doc-links.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
/** Walk root: whole docs/ tree (was docs/dev/ only before q-mp-857). */
const DOCS_DIR = path.join(ROOT, 'docs');

const PATH_RE =
  /`((?:src|tests|docs|scripts)\/[A-Za-z0-9_./@+-]+\.(?:ts|tsx|js|mjs|css|md|json))`/g;
const TABLE_ROW_RE =
  /^\|\s*`([^`]+)`\s*\|\s*`((?:src|tests|docs|scripts)\/[^`]+)`\s*\|/;
const MODULE_ROW_RE =
  /^\|\s*\*\(module\)\*\s*\|\s*`((?:src|tests|docs|scripts)\/[^`]+)`\s*\|/;

/**
 * True for ASCII horizontal whitespace (space / tab). Newlines end bare
 * destinations per CommonMark (destination cannot span lines unescaped).
 * @param {string} ch
 */
function isMdLinkHorizSpace(ch) {
  return ch === ' ' || ch === '\t';
}

/**
 * Scan Markdown for inline links `](destination optional-title)`.
 *
 * Destinations may be:
 *   - `<angle-bracketed>` (spaces allowed; q-mp-1175 strips the brackets later)
 *   - bare paths with **balanced** parentheses (q-mp-1174) — a RegExp like
 *     `[^)]+` / `[^)\s]+` truncates at the first `)` in `file_(draft).md`
 *
 * Optional CommonMark titles (`"…"` / `'…'` / `(…)`) stay in the captured
 * href so {@link stripMdLinkTitle} (q-mp-1095 / q-mp-1152) can remove them.
 *
 * @param {string} text
 * @returns {Array<{ 0: string, 1: string, index: number }>}
 */
export function matchAllMdLinks(text) {
  /** @type {Array<{ 0: string, 1: string, index: number }>} */
  const out = [];
  let i = 0;
  while (i < text.length) {
    const open = text.indexOf('](', i);
    if (open === -1) break;
    const parsed = parseMdLinkAfterOpen(text, open + 2);
    if (!parsed) {
      i = open + 2;
      continue;
    }
    out.push({
      0: text.slice(open, parsed.end),
      1: parsed.href,
      index: open,
    });
    i = parsed.end;
  }
  return out;
}

/**
 * @param {string} text
 * @param {number} start index immediately after `](`
 * @returns {{ href: string, end: number } | null}
 */
function parseMdLinkAfterOpen(text, start) {
  let p = start;
  while (p < text.length && isMdLinkHorizSpace(text[p])) p += 1;
  if (p >= text.length) return null;

  let destEnd;
  if (text[p] === '<') {
    // Angle destination: <…> (no unescaped '>'; we treat first '>' as close).
    const close = text.indexOf('>', p + 1);
    if (close === -1) return null;
    destEnd = close + 1;
    p = destEnd;
  } else {
    // Bare destination: non-whitespace with balanced parentheses.
    let depth = 0;
    const destStart = p;
    while (p < text.length) {
      const c = text[p];
      if (c === '\n' || c === '\r') break;
      if (isMdLinkHorizSpace(c)) break;
      if (c === '(') {
        depth += 1;
        p += 1;
        continue;
      }
      if (c === ')') {
        if (depth === 0) break; // closing paren of the link
        depth -= 1;
        p += 1;
        continue;
      }
      p += 1;
    }
    if (p === destStart || depth !== 0) return null;
    destEnd = p;
  }

  // Optional whitespace + title ("…" / '…' / (…)).
  let q = destEnd;
  while (q < text.length && isMdLinkHorizSpace(text[q])) q += 1;
  let afterTitle = destEnd;
  if (q > destEnd && q < text.length) {
    const t = text[q];
    if (t === '"' || t === "'") {
      const close = text.indexOf(t, q + 1);
      if (close === -1) return null;
      afterTitle = close + 1;
      q = afterTitle;
    } else if (t === '(') {
      const close = text.indexOf(')', q + 1);
      if (close === -1) return null;
      afterTitle = close + 1;
      q = afterTitle;
    } else {
      // Non-title token — require the link to close at destEnd.
      q = destEnd;
      afterTitle = destEnd;
    }
  }

  let r = afterTitle;
  while (r < text.length && isMdLinkHorizSpace(text[r])) r += 1;
  if (r >= text.length || text[r] !== ')') return null;

  return {
    href: text.slice(start, afterTitle).replace(/^[ \t]+/, ''),
    end: r + 1,
  };
}

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
    new RegExp(String.raw`export\s+(?:async\s+)?function\s+${escaped}\b`),
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
 * Strip an optional CommonMark link title after the destination:
 * `"title"` / `'title'` / `(title)`. Leaves the path (and any `#fragment` /
 * `?query`) intact. Parenthetical titles are q-mp-1152 (quoted: q-mp-1095).
 * @param {string} href
 * @returns {string}
 */
export function stripMdLinkTitle(href) {
  const m = /^(.*?)\s+("[^"]*"|'[^']*'|\([^)]*\))\s*$/.exec(href);
  return m ? m[1] : href;
}

/**
 * Strip CommonMark `<destination>` angle brackets (q-mp-1175).
 * Only a full wrap `<…>` (no nested `>`) is unwrapped; bare paths unchanged.
 * @param {string} dest
 * @returns {string}
 */
export function stripMdLinkAngleBrackets(dest) {
  const m = /^<([^>\n]*)>$/.exec(dest);
  return m ? m[1] : dest;
}

/**
 * @param {string} fromDocAbs
 * @param {string} href
 */
export function resolveMdLink(fromDocAbs, href) {
  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    // Absolute FS / site-root paths are out of scope (relative md links only).
    href.startsWith('/')
  ) {
    return { skip: true };
  }
  // Titles must be stripped before #/? splits — otherwise `"title"` stays in
  // the path segment and yields a false broken-md-link (q-mp-1095 / q-mp-1152).
  // Angle brackets are destination syntax and must be removed before resolve
  // (q-mp-1175); order is title → angles so `<path.md> "title"` works.
  const withoutTitle = stripMdLinkTitle(href);
  const withoutAngles = stripMdLinkAngleBrackets(withoutTitle);
  // After unwrapping <…>, absolute / external destinations may appear.
  if (
    withoutAngles.startsWith('http://') ||
    withoutAngles.startsWith('https://') ||
    withoutAngles.startsWith('#') ||
    withoutAngles.startsWith('mailto:') ||
    withoutAngles.startsWith('/')
  ) {
    return { skip: true };
  }
  const clean = withoutAngles.split('#')[0].split('?')[0];
  if (!clean) return { skip: true };
  const abs = path.resolve(path.dirname(fromDocAbs), clean);
  return { abs, rel: path.relative(ROOT, abs) };
}

/**
 * Recursively collect *.md under docs/ (or a subdirectory).
 * @param {string} dirAbs
 * @returns {string[]}
 */
function listDocs(dirAbs = DOCS_DIR) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dirAbs)) return out;
  for (const entry of fs.readdirSync(dirAbs, { withFileTypes: true })) {
    const abs = path.join(dirAbs, entry.name);
    if (entry.isDirectory()) {
      out.push(...listDocs(abs));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(abs);
    }
  }
  return out.sort();
}

/**
 * Summarize how many scanned docs sit under each immediate docs/ child.
 * @param {string[]} docAbsList
 * @returns {string}
 */
function subtreeSummary(docAbsList) {
  /** @type {Record<string, number>} */
  const counts = {};
  const docsRootRel = path.relative(ROOT, DOCS_DIR);
  for (const abs of docAbsList) {
    const rel = path.relative(DOCS_DIR, abs);
    const first = rel.includes(path.sep) ? rel.split(path.sep)[0] : '(top)';
    counts[first] = (counts[first] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, n]) =>
      k === '(top)' ? `${docsRootRel}/*.md=${n}` : `${docsRootRel}/${k}/=${n}`
    )
    .join(' ');
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
  const docsList = listDocs();
  let docsScanned = 0;

  for (const docAbs of docsList) {
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

    for (const match of matchAllMdLinks(text)) {
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
  console.log(`  docs root:       ${path.relative(ROOT, DOCS_DIR)}/`);
  console.log(`  docs scanned:    ${docsScanned}`);
  console.log(`  by subtree:      ${subtreeSummary(docsList)}`);
  console.log(`  path checks:     ${pathChecks}`);
  console.log(`  symbol checks:   ${symbolChecks}`);
  console.log(`  md link checks:  ${linkChecks}`);
  console.log(`  problems:        ${problems.length}`);

  const byKind = problems.reduce((acc, p) => {
    acc[p.kind] = (acc[p.kind] ?? 0) + 1;
    return acc;
  }, /** @type {Record<string, number>} */ ({}));
  if (Object.keys(byKind).length) {
    console.log(
      `  by kind:         ${Object.entries(byKind)
        .map(([k, n]) => `${k}=${n}`)
        .join(' ')}`
    );
  }

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

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  main();
}
