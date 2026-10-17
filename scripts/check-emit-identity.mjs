#!/usr/bin/env node
/**
 * Emit-identity checker — prove two git refs produce byte-identical JS for a
 * file set after TypeScript erasure (type annotations, `!`, `as`, `satisfies`,
 * type-only imports, interfaces/aliases do not change emit).
 *
 * Transpiles each path at both refs with esbuild using the repo's TS target /
 * class-field settings, then diffs the emitted JavaScript.
 *
 * Usage:
 *   node scripts/check-emit-identity.mjs
 *     → compares HEAD vs MERGE_BASE (or --base) for staged/unstaged ai/ diffs
 *   node scripts/check-emit-identity.mjs --base <ref> [--head <ref>] [files...]
 *   node scripts/check-emit-identity.mjs --base <ref> --files-from <list>
 *
 * Exit codes:
 *   0 — every compared file emits identically
 *   1 — any emit mismatch
 *   2 — usage / git-ref error (unknown flag, duplicate --base/--head/boolean
 *       flags, missing/flag-like --base/--head value, duplicate/missing/flag-like
 *       --files-from, bad --files-from path, path junk / comment / directory,
 *       non-zero `git diff` for an invalid --base/--head; no stack)
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

export const USAGE =
  'Usage: node scripts/check-emit-identity.mjs [options] [files...]';

/** Living tip remote (live tip / AGENTS tip stamp). Dead wave5 tip must not invent AI DIFFs (q-mp-1357 / q-mp-1500). */
export const DEFAULT_TIP_REMOTE = 'origin/cursor/mp-tip-post3c7bf5e';
/** Fallback when the living tip ref is missing locally (q-mp-1357). */
export const DEFAULT_TIP_FALLBACK_REMOTE = 'origin/alpha';

/** Match tsconfig.json compilerOptions that affect emit. */
export const EMIT_TSCONFIG_RAW = {
  compilerOptions: {
    target: 'ES2020',
    useDefineForClassFields: true,
  },
};

/**
 * Friendly usage text for a bad `--files-from` path (missing / not a file).
 * @param {string} filesFrom
 * @param {'missing' | 'not-found' | 'not-file' | 'flag-like'} reason
 */
export function filesFromErrorMessage(filesFrom, reason) {
  const detail =
    reason === 'missing' || reason === 'flag-like'
      ? 'error: --files-from requires a path to a file list (missing or flag-like value)'
      : reason === 'not-file'
        ? `error: --files-from path is not a file: ${filesFrom}`
        : `error: --files-from path not found: ${filesFrom}`;
  return [
    detail,
    USAGE,
    '  --files-from <f>   Read file paths (one per line)',
  ].join('\n');
}

/**
 * Usage text for a repeated `--files-from` (q-mp-1381; leave --base/--head
 * duplicate honesty to ba q-mp-1373 / #1478).
 * @param {string} flag
 */
export function duplicateFilesFromErrorMessage(flag = '--files-from') {
  return `error: Duplicate ${flag}\n${USAGE}`;
}

/**
 * Usage text when a list/positional path escapes the repository root
 * (q-mp-1429).
 * @param {string} file
 */
export function pathNotInRepoErrorMessage(file) {
  return `error: path escapes repository root: ${file}\n${USAGE}`;
}

/**
 * Usage text when a list/positional path carries `?` / `#` / NUL / control
 * junk (q-mp-1464), ADS / percent-encoded / `&` / `*` junk (q-mp-1473),
 * shell-metachar junk (q-mp-1478), unicode format/invisible junk (q-mp-1479),
 * junk `\segment` after a file path (q-mp-1480), or editor backup / swap /
 * temp / patch suffixes `~` / `.bak` / `.swp` / `.swo` / `.swn` / `.swx` /
 * `.tmp` / `.orig` / `.rej` / `.old` / `.save` / `.backup` (q-mp-1497 /
 * q-mp-1499 / q-mp-1503).
 * @param {string} file
 */
export function pathJunkErrorMessage(file) {
  return `error: path contains invalid characters: ${file}\n${USAGE}`;
}

/**
 * Usage text when a path still contains `//` after stripping a trailing
 * ` // comment` (q-mp-1471) — must not claim repo escape or collapse to `/`.
 * @param {string} file
 */
export function pathSlashCommentErrorMessage(file) {
  return `error: path contains '//' (use # or full-line // for list comments): ${file}\n${USAGE}`;
}

/**
 * Usage text when a normalized path resolves to a directory (q-mp-1472).
 * @param {string} file
 */
export function pathIsDirectoryErrorMessage(file) {
  return `error: path is a directory (need a file): ${file}\n${USAGE}`;
}

/**
 * `?` / `#` / NUL / C0+DEL (q-mp-1464); `%` / `&` / `*` (q-mp-1473);
 * shell metachar `|<>;"'\`$` (q-mp-1478); Unicode Format (`\p{Cf}`) invisibles
 * such as ZWSP / soft hyphen / RLO (q-mp-1479). Bare `\` is not junk here —
 * Windows relatives stay accepted (q-mp-1463); junk `file.ts\extra` is gated
 * in normalize (q-mp-1480). Editor backup suffixes (`~` / `.bak` / `.swp` /
 * `.swo` / `.swn` / `.swx` / `.tmp` / `.orig` / `.rej` / `.old` / `.save` /
 * `.backup`) are gated separately (q-mp-1497 / q-mp-1499 / q-mp-1503). Colon
 * (ADS) is checked separately so Windows drive absolutes stay valid.
 */
const PATH_JUNK_RE = /[?#\u0000-\u001F\u007F%&*|<>;"'`$]|\p{Cf}/u;

/**
 * Trailing editor backup / swap / temp / patch leftovers (q-mp-1497 /
 * q-mp-1499 / q-mp-1503). Suffix-only so shell/unicode/`\extra` / `?`/`#`/NUL /
 * ADS/`%&*` / `//` / directory gates stay untouched. Includes vim secondary
 * swaps (`.swo` / `.swn` / `.swx`) when `.swp` already exists, cheap `.orig` /
 * `.rej`, and OS/editor backups (`.old` / `.save` / `.backup`).
 */
const EDITOR_BACKUP_SUFFIX_RE =
  /(?:~|\.bak|\.swp|\.swo|\.swn|\.swx|\.tmp|\.orig|\.rej|\.old|\.save|\.backup)$/i;

/**
 * True when `raw` has invalid path characters (q-mp-1464 / q-mp-1473 /
 * q-mp-1478 / q-mp-1479). Allows a Windows drive absolute (`C:\` / `C:/`)
 * but rejects ADS colons.
 * @param {string} raw
 */
export function pathHasInvalidCharacters(raw) {
  if (PATH_JUNK_RE.test(raw)) return true;
  if (!raw.includes(':')) return false;
  const rest = /^[A-Za-z]:[\\/]/.test(raw) ? raw.slice(2) : raw;
  return rest.includes(':');
}

/**
 * True when the path ends with an editor backup / swap / temp / patch suffix
 * (`~` / `.bak` / `.swp` / `.swo` / `.swn` / `.swx` / `.tmp` / `.orig` /
 * `.rej` / `.old` / `.save` / `.backup`) — q-mp-1497 / q-mp-1499 / q-mp-1503.
 * @param {string} raw
 */
export function pathHasEditorBackupSuffix(raw) {
  return EDITOR_BACKUP_SUFFIX_RE.test(String(raw ?? ''));
}

/**
 * True when converting Windows `\` would invent a fake nested path after a
 * filename segment (e.g. `ai.ts\extra` → `ai.ts/extra`) — q-mp-1480.
 * Real relatives like `src\games\hex\ai.ts` stay accepted (q-mp-1463).
 * @param {string} convertedPosix
 */
export function pathHasJunkBackslashExtra(convertedPosix) {
  const parts = String(convertedPosix ?? '').split('/');
  for (let i = 0; i < parts.length - 1; i++) {
    if (/\.[A-Za-z0-9]+$/.test(parts[i])) return true;
  }
  return false;
}

/**
 * Strip a trailing ` // …` line comment from a list/positional path
 * (q-mp-1471). Does not touch `#` (owned by PATH_JUNK / full-line skip).
 * @param {string} line
 */
export function stripInlinePathComment(line) {
  const s = String(line ?? '');
  const idx = s.indexOf(' //');
  if (idx === -1) return s;
  return s.slice(0, idx);
}

/**
 * Normalize a file path for emit compare: strip leading `./`, map absolute
 * paths under the repo root to repo-relative, accept Windows-style relative
 * `\` separators as `/` (q-mp-1463), reject `?`/`#`/NUL/control junk
 * (q-mp-1464), reject ADS / `%` / `&` / `*` junk (q-mp-1473), reject
 * shell-metachar junk (q-mp-1478), reject unicode format/invisible junk
 * (q-mp-1479), reject junk `file.ts\extra` remaps (q-mp-1480), reject
 * editor backup suffixes `~` / `.bak` / `.swp` / `.swo` / `.swn` / `.swx` /
 * `.tmp` / `.orig` / `.rej` / `.old` / `.save` / `.backup` (q-mp-1497 /
 * q-mp-1499 / q-mp-1503), reject remaining `//` (q-mp-1471), reject directories
 * (q-mp-1472), reject escapes (q-mp-1429 / q-mp-1430).
 * @param {string} file
 * @param {string} [root]
 * @returns {{ ok: true, path: string } | { ok: false, message: string }}
 */
export function normalizeRepoRelativePath(file, root = ROOT) {
  const rawInput = stripInlinePathComment(String(file ?? '')).trim();
  const raw = rawInput;
  if (!raw) {
    return { ok: false, message: pathNotInRepoErrorMessage(file) };
  }
  if (pathHasInvalidCharacters(raw) || pathHasEditorBackupSuffix(raw)) {
    return { ok: false, message: pathJunkErrorMessage(raw) };
  }
  // Full-line `//` or any remaining `//` must not resolve as abs/UNC or
  // collapse into `/` (q-mp-1471).
  if (raw.startsWith('//') || raw.includes('//')) {
    return { ok: false, message: pathSlashCommentErrorMessage(raw) };
  }
  let candidate = raw;
  // POSIX `path.resolve` treats `\` as a literal filename char; convert
  // Windows-style relative separators before join (q-mp-1463). Absolute
  // inputs keep platform semantics via path.isAbsolute(raw). Reject
  // `file.ts\extra` before it becomes a fake `file.ts/extra` (q-mp-1480).
  if (!path.isAbsolute(raw) && candidate.includes('\\')) {
    const converted = candidate.split('\\').join('/');
    if (pathHasJunkBackslashExtra(converted)) {
      return { ok: false, message: pathJunkErrorMessage(raw) };
    }
    candidate = converted;
  }
  while (candidate.startsWith('./')) {
    candidate = candidate.slice(2);
  }
  const abs = path.isAbsolute(raw)
    ? path.resolve(raw)
    : path.resolve(root, candidate);
  const rel = path.relative(root, abs);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) {
    return { ok: false, message: pathNotInRepoErrorMessage(raw) };
  }
  const posixRel = rel.split(path.sep).join('/');
  // Reject directory / `..`-collapsed directory before EISDIR (q-mp-1472).
  try {
    if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
      return { ok: false, message: pathIsDirectoryErrorMessage(posixRel) };
    }
  } catch {
    // Missing path is fine — MISSING-BASE / MISSING-HEAD later.
  }
  return { ok: true, path: posixRel };
}

/**
 * First-wins dedupe for normalized repo-relative paths (q-mp-1430).
 * @param {string[]} files
 * @returns {string[]}
 */
export function dedupePreserveOrder(files) {
  const seen = new Set();
  /** @type {string[]} */
  const out = [];
  for (const f of files) {
    if (seen.has(f)) continue;
    seen.add(f);
    out.push(f);
  }
  return out;
}

/**
 * Read a `--files-from` list without throwing ENOENT/EISDIR stacks.
 * Normalizes `./`, Windows-style relative `\`, and absolute-under-root paths;
 * skips `#` and full-line `//` comments (q-mp-1471); strips trailing
 * ` // …` comments; rejects path junk (`?`/`#`/NUL/controls / ADS / `%` /
 * `&` / `*` / shell metachar / unicode format / junk `\extra`), directories,
 * and escapes; first-wins dedupe within the list (q-mp-1429 / q-mp-1430 /
 * q-mp-1463 / q-mp-1464 / q-mp-1471 / q-mp-1472 / q-mp-1473 / q-mp-1478 /
 * q-mp-1479 / q-mp-1480).
 * @param {string} filesFrom
 * @param {{
 *   existsSync?: (p: string) => boolean,
 *   statSync?: (p: string) => { isFile: () => boolean },
 *   readFileSync?: (p: string, enc: string) => string,
 *   root?: string,
 * }} [io]
 * @returns {{ ok: true, files: string[] } | { ok: false, message: string }}
 */
export function loadFilesFromList(filesFrom, io = {}) {
  const existsSync = io.existsSync ?? ((p) => fs.existsSync(p));
  const statSync = io.statSync ?? ((p) => fs.statSync(p));
  const readFileSync = io.readFileSync ?? ((p, enc) => fs.readFileSync(p, enc));
  const root = io.root ?? ROOT;

  if (!filesFrom) {
    return { ok: false, message: filesFromErrorMessage('', 'missing') };
  }
  if (!existsSync(filesFrom)) {
    return {
      ok: false,
      message: filesFromErrorMessage(filesFrom, 'not-found'),
    };
  }
  let st;
  try {
    st = statSync(filesFrom);
  } catch {
    return {
      ok: false,
      message: filesFromErrorMessage(filesFrom, 'not-found'),
    };
  }
  if (!st.isFile()) {
    return {
      ok: false,
      message: filesFromErrorMessage(filesFrom, 'not-file'),
    };
  }
  const text = readFileSync(filesFrom, 'utf8');
  /** @type {string[]} */
  const files = [];
  for (const line of text.split('\n')) {
    const t = stripInlinePathComment(line).trim();
    // `#` and full-line `//` are list comments (q-mp-1471); mid-line `#` is
    // still path junk via normalize (q-mp-1464).
    if (!t || t.startsWith('#') || t.startsWith('//')) continue;
    const normalized = normalizeRepoRelativePath(t, root);
    if (!normalized.ok) return normalized;
    files.push(normalized.path);
  }
  return { ok: true, files: dedupePreserveOrder(files) };
}

/**
 * @param {string} source
 * @param {string} [sourcefile]
 * @param {{ minify?: boolean }} [opts]
 * @returns {Promise<string>}
 */
export async function transpileToJs(
  source,
  sourcefile = 'input.ts',
  opts = {}
) {
  const result = await esbuild.transform(source, {
    loader: sourcefile.endsWith('.tsx') ? 'tsx' : 'ts',
    format: 'esm',
    target: 'es2020',
    tsconfigRaw: EMIT_TSCONFIG_RAW,
    sourcefile,
    // Keep legal comments out so comment-only type edits cannot drift emit.
    legalComments: 'none',
    // Minify mode: brace-only curly:all autofixes are AST-identical after minify
    // (proves no behavior change for mechanical brace wraps).
    minify: opts.minify === true,
  });
  return result.code;
}

/**
 * Optional normalize: collapse runs of whitespace outside string/template/
 * regex literals. Default comparison is raw byte equality of esbuild output;
 * this helper exists for callers that need whitespace-insensitive checks only.
 *
 * String (`'` / `"`), template (`\``), and regex (`/…/`) contents are preserved
 * byte-for-byte (including internal spaces). Whitespace inside `${…}` template
 * expressions is collapsed recursively (string/template/regex-aware).
 * @param {string} js
 * @returns {string}
 */
export function stripCommentsAndCollapseWhitespace(js) {
  // esbuild already stripped TS comments; only collapse insignificant WS.
  return collapseWhitespaceOutsideLiterals(js).trim() + '\n';
}

/**
 * @param {string} js
 * @param {number} i index of opening quote
 * @returns {number} index after closing quote
 */
function skipQuotedLiteral(js, i) {
  const quote = js[i];
  i++;
  while (i < js.length) {
    const c = js[i];
    i++;
    if (c === '\\' && i < js.length) {
      i++;
      continue;
    }
    if (c === quote) break;
  }
  return i;
}

/**
 * @param {string} js
 * @param {number} i index of opening backtick
 * @returns {number} index after closing backtick
 */
function skipTemplateLiteral(js, i) {
  i++; // past `
  while (i < js.length) {
    const c = js[i];
    if (c === '\\' && i + 1 < js.length) {
      i += 2;
      continue;
    }
    if (c === '`') return i + 1;
    if (c === '$' && js[i + 1] === '{') {
      i += 2;
      i = findTemplateExprClosingBrace(js, i) + 1;
      continue;
    }
    i++;
  }
  return i;
}

/**
 * Keywords / punctuator contexts where `/…/` starts a RegExp, not division.
 * Single-char prev is handled separately; these cover `return /x/`, etc.
 */
const REGEX_PREFIX_KEYWORDS = new Set([
  'return',
  'case',
  'throw',
  'delete',
  'typeof',
  'void',
  'await',
  'yield',
  'new',
  'in',
  'of',
  'instanceof',
  'else',
  'do',
]);

/**
 * @param {string} js
 * @param {number} i index of `/` candidate
 * @param {boolean} afterRegex prior token was a completed regex literal
 * @returns {boolean}
 */
function canStartRegexAt(js, i, afterRegex) {
  if (afterRegex) return true;
  let j = i - 1;
  while (
    j >= 0 &&
    (js[j] === ' ' || js[j] === '\t' || js[j] === '\n' || js[j] === '\r')
  ) {
    j--;
  }
  if (j < 0) return true;
  const c = js[j];
  // Division / member after value-like tokens.
  if (
    c === ')' ||
    c === ']' ||
    c === '.' ||
    c === '"' ||
    c === "'" ||
    c === '`'
  ) {
    return false;
  }
  // Postfix ++ / -- yield a value; `/` after them is division, not regex.
  // Binary `+` / `-` still allow a regex operand (`a + /x/`).
  if ((c === '+' || c === '-') && j >= 1 && js[j - 1] === c) {
    return false;
  }
  if (/[0-9]/.test(c)) return false;
  if (/[A-Za-z_$]/.test(c)) {
    let k = j;
    while (k >= 0 && /[A-Za-z0-9_$]/.test(js[k])) k--;
    const word = js.slice(k + 1, j + 1);
    return REGEX_PREFIX_KEYWORDS.has(word);
  }
  return true;
}

/**
 * @param {string} js
 * @param {number} i index of opening `/`
 * @returns {number} index after closing `/` and optional flags
 */
function skipRegexLiteral(js, i) {
  i++; // past opening /
  let inClass = false;
  while (i < js.length) {
    const c = js[i];
    if (c === '\\' && i + 1 < js.length) {
      i += 2;
      continue;
    }
    if (c === '[') {
      inClass = true;
      i++;
      continue;
    }
    if (c === ']' && inClass) {
      inClass = false;
      i++;
      continue;
    }
    if (c === '/' && !inClass) {
      i++;
      while (i < js.length && /[dgimsuvy]/.test(js[i])) i++;
      return i;
    }
    // Unterminated regex: stop at newline (same as JS lexer).
    if (c === '\n' || c === '\r') return i;
    i++;
  }
  return i;
}

/**
 * @param {string} js
 * @param {number} i index of first char inside `${`
 * @returns {number} index of the matching `}`
 */
function findTemplateExprClosingBrace(js, i) {
  let depth = 1;
  let afterRegex = false;
  while (i < js.length && depth > 0) {
    const ch = js[i];
    if (ch === "'" || ch === '"') {
      i = skipQuotedLiteral(js, i);
      afterRegex = false;
      continue;
    }
    if (ch === '`') {
      i = skipTemplateLiteral(js, i);
      afterRegex = false;
      continue;
    }
    if (ch === '/' && canStartRegexAt(js, i, afterRegex)) {
      i = skipRegexLiteral(js, i);
      afterRegex = true;
      continue;
    }
    if (ch === '{') {
      depth++;
      afterRegex = false;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
      afterRegex = false;
    } else if (ch !== ' ' && ch !== '\t' && ch !== '\n' && ch !== '\r') {
      afterRegex = false;
    }
    i++;
  }
  return i;
}

/**
 * Collapse insignificant whitespace outside string/template/regex literals.
 * Mirrors prior global replaces: `[ \t]+` → space, trim spaces beside `\n`,
 * collapse runs of newlines — but only in code regions.
 * @param {string} js
 * @returns {string}
 */
function collapseWhitespaceOutsideLiterals(js) {
  let out = '';
  let i = 0;
  /** @type {'code' | 'space' | 'newline'} */
  let ws = 'code';
  let afterRegex = false;

  function flushWs() {
    if (ws === 'newline') {
      out += '\n';
    } else if (ws === 'space') {
      out += ' ';
    }
    ws = 'code';
  }

  /**
   * @param {string} c
   */
  function emitCodeChar(c) {
    if (c === ' ' || c === '\t') {
      if (ws !== 'newline') ws = 'space';
      return;
    }
    if (c === '\n' || c === '\r') {
      ws = 'newline';
      return;
    }
    // Spaces beside `/` after postfix ++/-- are insignificant (q-mp-1326).
    // Without this, `x++ / 2` and `x++/2` normalize unequally even though
    // `/` is correctly treated as division (not as a regex start).
    if (
      ws === 'space' &&
      ((c === '/' && (out.endsWith('++') || out.endsWith('--'))) ||
        out.endsWith('++/') ||
        out.endsWith('--/'))
    ) {
      ws = 'code';
      out += c;
      afterRegex = false;
      return;
    }
    flushWs();
    out += c;
    afterRegex = false;
  }

  while (i < js.length) {
    const c = js[i];
    if (c === "'" || c === '"') {
      flushWs();
      const end = skipQuotedLiteral(js, i);
      out += js.slice(i, end);
      i = end;
      afterRegex = false;
      continue;
    }
    if (c === '`') {
      flushWs();
      out += '`';
      i++;
      afterRegex = false;
      while (i < js.length) {
        const t = js[i];
        if (t === '\\' && i + 1 < js.length) {
          out += t + js[i + 1];
          i += 2;
          continue;
        }
        if (t === '`') {
          out += t;
          i++;
          break;
        }
        if (t === '$' && js[i + 1] === '{') {
          out += '${';
          i += 2;
          const close = findTemplateExprClosingBrace(js, i);
          const expr = js.slice(i, close);
          // Spaces beside `${` / `}` are insignificant; trim after collapse.
          out += collapseWhitespaceOutsideLiterals(expr).trim();
          if (close < js.length) {
            out += '}';
            i = close + 1;
          } else {
            i = close;
          }
          continue;
        }
        out += t;
        i++;
      }
      continue;
    }
    if (c === '/' && canStartRegexAt(js, i, afterRegex)) {
      flushWs();
      const end = skipRegexLiteral(js, i);
      out += js.slice(i, end);
      i = end;
      afterRegex = true;
      continue;
    }
    emitCodeChar(c);
    i++;
  }
  flushWs();
  return out;
}

/**
 * @param {string} ref
 * @param {string} file
 * @returns {string | null} file contents at ref, or null if missing
 */
export function gitShow(ref, file) {
  const r = spawnSync('git', ['show', `${ref}:${file}`], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  if (r.status !== 0) return null;
  return r.stdout;
}

/**
 * @param {string} file
 * @returns {string}
 */
export function readWorkingTree(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {string}
 */
export function unifiedDiff(a, b, labelA = 'a', labelB = 'b') {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'emit-id-'));
  const pa = path.join(tmp, 'a.js');
  const pb = path.join(tmp, 'b.js');
  fs.writeFileSync(pa, a);
  fs.writeFileSync(pb, b);
  const r = spawnSync('diff', ['-u', pa, pb], { encoding: 'utf8' });
  fs.rmSync(tmp, { recursive: true, force: true });
  if (!r.stdout) return '';
  return r.stdout.replace(pa, labelA).replace(pb, labelB);
}

/**
 * @param {{
 *   file: string,
 *   baseSource: string | null,
 *   headSource: string | null,
 *   normalize?: boolean,
 *   minify?: boolean,
 * }} opts
 * @returns {Promise<{ file: string, status: 'identical' | 'differ' | 'missing-base' | 'missing-head' | 'error', detail?: string }>}
 */
export async function compareFileEmit(opts) {
  const {
    file,
    baseSource,
    headSource,
    normalize = false,
    minify = false,
  } = opts;
  if (baseSource === null) {
    return { file, status: 'missing-base' };
  }
  if (headSource === null) {
    return { file, status: 'missing-head' };
  }
  try {
    let baseJs = await transpileToJs(baseSource, file, { minify });
    let headJs = await transpileToJs(headSource, file, { minify });
    if (normalize) {
      baseJs = stripCommentsAndCollapseWhitespace(baseJs);
      headJs = stripCommentsAndCollapseWhitespace(headJs);
    }
    if (baseJs === headJs) {
      return { file, status: 'identical' };
    }
    // Minify can rename locals differently across identical raw emit
    // (e.g. `const e=1;export{e as x}` vs `const o=1;export{o as x}`).
    // When minify differs, fall back to non-minify compare so rename-only
    // drift is not a false DIFF; real semantic diffs still fail via raw.
    if (minify) {
      let baseRaw = await transpileToJs(baseSource, file, { minify: false });
      let headRaw = await transpileToJs(headSource, file, { minify: false });
      if (normalize) {
        baseRaw = stripCommentsAndCollapseWhitespace(baseRaw);
        headRaw = stripCommentsAndCollapseWhitespace(headRaw);
      }
      if (baseRaw === headRaw) {
        return { file, status: 'identical' };
      }
    }
    const detail = unifiedDiff(baseJs, headJs, `${file}@base`, `${file}@head`);
    return { file, status: 'differ', detail };
  } catch (err) {
    return {
      file,
      status: 'error',
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Friendly error when `git diff --name-only` fails (unknown --base/--head).
 * @param {string} baseRef
 * @param {string} headRef
 * @param {string} [detail] stderr or spawn error text
 * @param {number | null} [status] git exit status when available
 * @returns {string}
 */
export function gitDiffNameOnlyErrorMessage(
  baseRef,
  headRef,
  detail = '',
  status = null
) {
  const statusPart = status == null ? '' : ` (exit ${status})`;
  const lines = [
    `error: git diff failed for --base ${baseRef} --head ${headRef}${statusPart}`,
  ];
  const trimmed = String(detail || '').trim();
  if (trimmed) lines.push(trimmed);
  lines.push(USAGE);
  lines.push('  --base <ref>       Git ref for the "before" side');
  return lines.join('\n');
}

/**
 * List ai modules touched between base and head (or working tree).
 * Fail-closed when `git diff` is non-zero (unknown ref / bad revision).
 *
 * @param {string} baseRef
 * @param {string} headRef
 * @param {{
 *   spawnSync?: typeof spawnSync,
 *   cwd?: string,
 * }} [deps]
 * @returns {{ ok: true, files: string[] } | { ok: false, message: string }}
 */
export function listAiTouchedFiles(baseRef, headRef, deps = {}) {
  const spawn = deps.spawnSync ?? spawnSync;
  const cwd = deps.cwd ?? ROOT;
  const args =
    headRef === 'WORKING_TREE'
      ? ['diff', '--name-only', baseRef, '--', 'src/games']
      : ['diff', '--name-only', baseRef, headRef, '--', 'src/games'];
  const r = spawn('git', args, { cwd, encoding: 'utf8' });
  if (r.error || r.status !== 0) {
    const detail = r.error
      ? String(r.error.message || r.error)
      : String(r.stderr || '');
    return {
      ok: false,
      message: gitDiffNameOnlyErrorMessage(
        baseRef,
        headRef,
        detail,
        r.error ? null : (r.status ?? null)
      ),
    };
  }
  const files = (r.stdout || '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /\/ai(\.|-|\.worker)/.test(l) && l.endsWith('.ts'));
  return { ok: true, files: [...new Set(files)].sort() };
}

/**
 * Default file set: ai modules touched between base and head (or working tree).
 * Throws when `git diff` fails so callers cannot treat an invalid base as empty.
 * Prefer {@link listAiTouchedFiles} for Result-shaped handling.
 * @param {string} baseRef
 * @param {string} headRef
 * @returns {string[]}
 */
export function defaultAiTouchedFiles(baseRef, headRef) {
  const listed = listAiTouchedFiles(baseRef, headRef);
  if (!listed.ok) {
    throw new Error(listed.message);
  }
  return listed.files;
}

/**
 * True when a `--base` / `--head` value slot is missing, empty, or another flag
 * (q-mp-1333: do not treat `--normalize` / `--json` as git refs).
 * @param {string | undefined} value
 */
export function isMissingOrFlagLikeRef(value) {
  return value === undefined || value === '' || value.startsWith('-');
}

/**
 * Usage text when `--base` / `--head` is missing a git ref value.
 * @param {'--base' | '--head'} flag
 */
export function refOptionErrorMessage(flag) {
  return `error: ${flag} requires a git ref (missing or flag-like value)\n${USAGE}`;
}

/**
 * Usage text for a repeated value/boolean flag (q-mp-1373).
 * @param {string} flag
 */
export function duplicateFlagErrorMessage(flag) {
  return `error: Duplicate ${flag}\n${USAGE}`;
}

/**
 * Default --base when omitted: merge-base with living tip (AGENTS.md), then
 * origin/alpha, then HEAD. Must not use retired wave5 tip (q-mp-1357 / q-mp-1377).
 * @param {{
 *   spawnSync?: typeof spawnSync,
 *   cwd?: string,
 *   tipRemote?: string,
 *   tipFallbackRemote?: string,
 * }} [deps]
 * @returns {string}
 */
export function resolveDefaultMergeBase(deps = {}) {
  const spawn = deps.spawnSync ?? spawnSync;
  const cwd = deps.cwd ?? ROOT;
  const tipRemote = deps.tipRemote ?? DEFAULT_TIP_REMOTE;
  const tipFallbackRemote =
    deps.tipFallbackRemote ?? DEFAULT_TIP_FALLBACK_REMOTE;
  for (const tip of [tipRemote, tipFallbackRemote]) {
    const mb = spawn('git', ['merge-base', 'HEAD', tip], {
      cwd,
      encoding: 'utf8',
    });
    if (mb.status === 0 && mb.stdout.trim()) {
      return mb.stdout.trim();
    }
  }
  const head = spawn('git', ['rev-parse', 'HEAD'], {
    cwd,
    encoding: 'utf8',
  });
  return (head.stdout || '').trim();
}

/**
 * @param {string[]} argv
 * @returns {{
 *   base: string,
 *   head: string,
 *   files: string[],
 *   normalize: boolean,
 *   minify: boolean,
 *   json: boolean,
 *   filesFrom: boolean,
 * }}
 */
export function parseArgs(argv) {
  let base = '';
  let head = 'WORKING_TREE';
  /** @type {string | undefined} */
  let filesFrom;
  let sawFilesFrom = false;
  let sawBase = false;
  let sawHead = false;
  let sawNormalize = false;
  let sawMinify = false;
  let sawJson = false;
  /** @type {string[]} */
  const files = [];
  let normalize = false;
  let minify = false;
  let json = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--base') {
      // Duplicate value flags must not silently last-win (q-mp-1373).
      if (sawBase) {
        console.error(duplicateFlagErrorMessage('--base'));
        process.exit(2);
      }
      sawBase = true;
      // Bare `--base` must not fall through to silent merge-base (q-mp-1333).
      const value = argv[++i];
      if (isMissingOrFlagLikeRef(value)) {
        console.error(refOptionErrorMessage('--base'));
        process.exit(2);
      }
      base = value;
    } else if (a === '--head') {
      if (sawHead) {
        console.error(duplicateFlagErrorMessage('--head'));
        process.exit(2);
      }
      sawHead = true;
      const value = argv[++i];
      // Omitting the value (argv end) keeps default WORKING_TREE; flag-like /
      // empty tokens must not be eaten as refs (q-mp-1333).
      if (value !== undefined && (value === '' || value.startsWith('-'))) {
        console.error(refOptionErrorMessage('--head'));
        process.exit(2);
      }
      head = value ?? 'WORKING_TREE';
    } else if (a === '--files-from') {
      // Duplicate --files-from must not silently last-win (q-mp-1381).
      if (sawFilesFrom) {
        console.error(duplicateFilesFromErrorMessage('--files-from'));
        process.exit(2);
      }
      sawFilesFrom = true;
      const value = argv[++i];
      // Flag-like / missing value slot → peer --base honesty (q-mp-1382);
      // do not report “path not found: --json”.
      if (isMissingOrFlagLikeRef(value)) {
        console.error(
          filesFromErrorMessage(value ?? '', value ? 'flag-like' : 'missing')
        );
        process.exit(2);
      }
      filesFrom = value;
    } else if (a === '--normalize') {
      if (sawNormalize) {
        console.error(duplicateFlagErrorMessage('--normalize'));
        process.exit(2);
      }
      sawNormalize = true;
      normalize = true;
    } else if (a === '--minify') {
      if (sawMinify) {
        console.error(duplicateFlagErrorMessage('--minify'));
        process.exit(2);
      }
      sawMinify = true;
      minify = true;
    } else if (a === '--json') {
      if (sawJson) {
        console.error(duplicateFlagErrorMessage('--json'));
        process.exit(2);
      }
      sawJson = true;
      json = true;
    } else if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    } else if (a.startsWith('-')) {
      console.error(`Unknown flag: ${a}`);
      process.exit(2);
    } else {
      files.push(a);
    }
  }
  if (!base) {
    // Living tip (cursor/mp-tip-post3c7bf5e); fall back to origin/alpha,
    // then HEAD — never retired wave5 (q-mp-1357 / q-mp-1377 / q-mp-1500).
    base = resolveDefaultMergeBase();
  }
  if (sawFilesFrom) {
    const loaded = loadFilesFromList(filesFrom ?? '');
    if (!loaded.ok) {
      console.error(loaded.message);
      process.exit(2);
    }
    files.push(...loaded.files);
  }
  // Positionals may still carry `./` or absolute-under-root forms; normalize
  // + first-wins dedupe after merge with --files-from (q-mp-1429 / q-mp-1430).
  /** @type {string[]} */
  const normalized = [];
  for (const f of files) {
    const n = normalizeRepoRelativePath(f);
    if (!n.ok) {
      console.error(n.message);
      process.exit(2);
    }
    normalized.push(n.path);
  }
  return {
    base,
    head,
    files: dedupePreserveOrder(normalized),
    normalize,
    minify,
    json,
    // Explicit --files-from (even when the list is empty/comment-only) must
    // not fall through to AI discovery (q-mp-1428).
    filesFrom: sawFilesFrom,
  };
}

function printHelp() {
  console.log(`${USAGE}

Options:
  --base <ref>       Git ref for the "before" side (required for meaningful check)
  --head <ref>       Git ref for the "after" side (default: WORKING_TREE)
  --files-from <f>   Read file paths (one per line)
  --normalize        Collapse whitespace before compare (off by default)
  --minify           esbuild minify before compare (brace-only curly:all proof)
  --json             Print machine-readable summary
  -h, --help         Show help

When no files are listed, compares ai*.ts paths touched between base and head
under src/games/.`);
}

/**
 * @param {ReturnType<typeof parseArgs> | {
 *   base: string,
 *   head: string,
 *   files: string[],
 *   normalize?: boolean,
 *   minify?: boolean,
 *   json?: boolean,
 *   filesFrom?: boolean,
 * }} opts
 * @param {{
 *   listAiTouchedFiles?: typeof listAiTouchedFiles,
 * }} [deps]
 * @returns {Promise<{
 *   ok: boolean,
 *   results: Awaited<ReturnType<typeof compareFileEmit>>[],
 *   error?: string,
 * }>}
 */
export async function runEmitIdentityCheck(opts, deps = {}) {
  let files = opts.files;
  // Explicit --files-from with zero paths must stay empty (print “no files” /
  // exit 0) — do not discover ai*.ts as if the flag were omitted (q-mp-1428).
  if (files.length === 0 && !opts.filesFrom) {
    const listFn = deps.listAiTouchedFiles ?? listAiTouchedFiles;
    const listed = listFn(opts.base, opts.head);
    if (!listed.ok) {
      return { ok: false, results: [], error: listed.message };
    }
    files = listed.files;
  }
  if (files.length === 0) {
    console.log(
      opts.filesFrom
        ? `check-emit-identity: no files to compare (base=${opts.base} head=${opts.head})`
        : `check-emit-identity: no ai/ files to compare (base=${opts.base} head=${opts.head})`
    );
    return { ok: true, results: [] };
  }

  /** @type {Awaited<ReturnType<typeof compareFileEmit>>[]} */
  const results = [];
  for (const file of files) {
    const baseSource = gitShow(opts.base, file);
    const headSource =
      opts.head === 'WORKING_TREE'
        ? fs.existsSync(path.join(ROOT, file))
          ? readWorkingTree(file)
          : null
        : gitShow(opts.head, file);
    results.push(
      await compareFileEmit({
        file,
        baseSource,
        headSource,
        normalize: opts.normalize,
        minify: opts.minify,
      })
    );
  }
  const ok = results.every((r) => r.status === 'identical');
  return { ok, results };
}

function isMain() {
  const entry = process.argv[1] ? path.resolve(process.argv[1]) : '';
  return entry === fileURLToPath(import.meta.url);
}

if (isMain()) {
  const opts = parseArgs(process.argv.slice(2));
  const { ok, results, error } = await runEmitIdentityCheck(opts);

  if (error) {
    if (opts.json) {
      console.log(
        JSON.stringify(
          {
            ok: false,
            base: opts.base,
            head: opts.head,
            error,
            results: [],
          },
          null,
          2
        )
      );
    } else {
      console.error(error);
    }
    process.exit(2);
  }

  if (opts.json) {
    console.log(
      JSON.stringify({ ok, base: opts.base, head: opts.head, results }, null, 2)
    );
  } else {
    console.log(`check-emit-identity`);
    console.log(`  base: ${opts.base}`);
    console.log(`  head: ${opts.head}`);
    console.log(`  minify: ${opts.minify ? 'on' : 'off'}`);
    console.log(`  files: ${results.length}`);
    for (const r of results) {
      const mark =
        r.status === 'identical'
          ? 'OK'
          : r.status === 'differ'
            ? 'DIFF'
            : r.status.toUpperCase();
      console.log(`  ${mark.padEnd(12)} ${r.file}`);
      if (r.detail && r.status !== 'identical') {
        for (const line of r.detail.split('\n').slice(0, 40)) {
          console.log(`    ${line}`);
        }
      }
    }
    const identical = results.filter((r) => r.status === 'identical').length;
    console.log(
      ok
        ? `\nAll ${identical} file(s) emit-identical.`
        : `\nFAIL: ${results.length - identical} file(s) not emit-identical.`
    );
  }
  process.exit(ok ? 0 : 1);
}
