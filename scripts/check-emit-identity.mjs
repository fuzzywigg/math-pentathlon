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
 * Exit 0 if every compared file emits identically; 1 on any mismatch or error.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

/** Match tsconfig.json compilerOptions that affect emit. */
export const EMIT_TSCONFIG_RAW = {
  compilerOptions: {
    target: 'ES2020',
    useDefineForClassFields: true,
  },
};

/**
 * @param {string} source
 * @param {string} [sourcefile]
 * @returns {Promise<string>}
 */
export async function transpileToJs(source, sourcefile = 'input.ts') {
  const result = await esbuild.transform(source, {
    loader: sourcefile.endsWith('.tsx') ? 'tsx' : 'ts',
    format: 'esm',
    target: 'es2020',
    tsconfigRaw: EMIT_TSCONFIG_RAW,
    sourcefile,
    // Keep legal comments out so comment-only type edits cannot drift emit.
    legalComments: 'none',
  });
  return result.code;
}

/**
 * Optional normalize: collapse runs of whitespace outside string/template
 * literals. Default comparison is raw byte equality of esbuild output; this
 * helper exists for callers that need whitespace-insensitive checks only.
 * @param {string} js
 * @returns {string}
 */
export function stripCommentsAndCollapseWhitespace(js) {
  // esbuild already stripped TS comments; only collapse insignificant WS.
  return (
    js
      .replace(/[ \t]+/g, ' ')
      .replace(/ ?\n ?/g, '\n')
      .replace(/\n{2,}/g, '\n')
      .trim() + '\n'
  );
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
  return r.stdout
    .replace(pa, labelA)
    .replace(pb, labelB);
}

/**
 * @param {{
 *   file: string,
 *   baseSource: string | null,
 *   headSource: string | null,
 *   normalize?: boolean,
 * }} opts
 * @returns {Promise<{ file: string, status: 'identical' | 'differ' | 'missing-base' | 'missing-head' | 'error', detail?: string }>}
 */
export async function compareFileEmit(opts) {
  const { file, baseSource, headSource, normalize = false } = opts;
  if (baseSource === null) {
    return { file, status: 'missing-base' };
  }
  if (headSource === null) {
    return { file, status: 'missing-head' };
  }
  try {
    let baseJs = await transpileToJs(baseSource, file);
    let headJs = await transpileToJs(headSource, file);
    if (normalize) {
      baseJs = stripCommentsAndCollapseWhitespace(baseJs);
      headJs = stripCommentsAndCollapseWhitespace(headJs);
    }
    if (baseJs === headJs) {
      return { file, status: 'identical' };
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
 * Default file set: ai modules touched between base and head (or working tree).
 * @param {string} baseRef
 * @param {string} headRef
 * @returns {string[]}
 */
export function defaultAiTouchedFiles(baseRef, headRef) {
  const args =
    headRef === 'WORKING_TREE'
      ? ['diff', '--name-only', baseRef, '--', 'src/games']
      : ['diff', '--name-only', baseRef, headRef, '--', 'src/games'];
  const r = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });
  const files = (r.stdout || '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /\/ai(\.|-|\.worker)/.test(l) && l.endsWith('.ts'));
  return [...new Set(files)].sort();
}

/**
 * @param {string[]} argv
 * @returns {{ base: string, head: string, files: string[], normalize: boolean, json: boolean }}
 */
export function parseArgs(argv) {
  let base = '';
  let head = 'WORKING_TREE';
  let filesFrom = '';
  /** @type {string[]} */
  const files = [];
  let normalize = false;
  let json = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--base') {
      base = argv[++i] ?? '';
    } else if (a === '--head') {
      head = argv[++i] ?? 'WORKING_TREE';
    } else if (a === '--files-from') {
      filesFrom = argv[++i] ?? '';
    } else if (a === '--normalize') {
      normalize = true;
    } else if (a === '--json') {
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
    // Prefer merge-base with preferred tip branch name; fall back to HEAD~ if alone.
    const mb = spawnSync(
      'git',
      ['merge-base', 'HEAD', 'origin/cursor/integration-fold-wave5-tip-4af0'],
      { cwd: ROOT, encoding: 'utf8' }
    );
    if (mb.status === 0 && mb.stdout.trim()) {
      base = mb.stdout.trim();
    } else {
      const tip = spawnSync('git', ['rev-parse', 'HEAD'], {
        cwd: ROOT,
        encoding: 'utf8',
      });
      base = tip.stdout.trim();
    }
  }
  if (filesFrom) {
    const text = fs.readFileSync(filesFrom, 'utf8');
    for (const line of text.split('\n')) {
      const t = line.trim();
      if (t && !t.startsWith('#')) files.push(t);
    }
  }
  return { base, head, files, normalize, json };
}

function printHelp() {
  console.log(`Usage: node scripts/check-emit-identity.mjs [options] [files...]

Options:
  --base <ref>       Git ref for the "before" side (required for meaningful check)
  --head <ref>       Git ref for the "after" side (default: WORKING_TREE)
  --files-from <f>   Read file paths (one per line)
  --normalize        Collapse whitespace before compare (off by default)
  --json             Print machine-readable summary
  -h, --help         Show help

When no files are listed, compares ai*.ts paths touched between base and head
under src/games/.`);
}

/**
 * @param {ReturnType<typeof parseArgs>} opts
 * @returns {Promise<{ ok: boolean, results: Awaited<ReturnType<typeof compareFileEmit>>[] }>}
 */
export async function runEmitIdentityCheck(opts) {
  let files = opts.files;
  if (files.length === 0) {
    files = defaultAiTouchedFiles(opts.base, opts.head);
  }
  if (files.length === 0) {
    console.log(
      `check-emit-identity: no ai/ files to compare (base=${opts.base} head=${opts.head})`
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
  const { ok, results } = await runEmitIdentityCheck(opts);

  if (opts.json) {
    console.log(JSON.stringify({ ok, base: opts.base, head: opts.head, results }, null, 2));
  } else {
    console.log(`check-emit-identity`);
    console.log(`  base: ${opts.base}`);
    console.log(`  head: ${opts.head}`);
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
