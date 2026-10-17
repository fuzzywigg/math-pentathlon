/**
 * @vitest-environment node
 *
 * esbuild requires a working TextEncoder (broken under jsdom); keep this suite
 * on the unit-node project via vitest.config.ts nodePureFiles.
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import {
  transpileToJs,
  stripCommentsAndCollapseWhitespace,
  compareFileEmit,
  parseArgs,
  EMIT_TSCONFIG_RAW,
  USAGE,
  filesFromErrorMessage,
  loadFilesFromList,
  gitDiffNameOnlyErrorMessage,
  listAiTouchedFiles,
  runEmitIdentityCheck,
  isMissingOrFlagLikeRef,
  refOptionErrorMessage,
  duplicateFlagErrorMessage,
  duplicateFilesFromErrorMessage,
  resolveDefaultMergeBase,
  DEFAULT_TIP_REMOTE,
  DEFAULT_TIP_FALLBACK_REMOTE,
  normalizeRepoRelativePath,
  dedupePreserveOrder,
  pathNotInRepoErrorMessage,
  pathJunkErrorMessage,
  pathSlashCommentErrorMessage,
  pathIsDirectoryErrorMessage,
  pathHasInvalidCharacters,
  pathHasEditorBackupSuffix,
  pathHasJunkBackslashExtra,
  stripInlinePathComment,
} from '../../scripts/check-emit-identity.mjs';

const EMIT_SCRIPT = resolve(process.cwd(), 'scripts/check-emit-identity.mjs');

describe('check-emit-identity helpers', () => {
  it('erases non-null assertions, as casts, and satisfies (byte-identical emit)', async () => {
    const before = `
export function pick(xs: number[]): number {
  return xs[0] as number;
}
`;
    const after = `
export function pick(xs: number[]): number {
  // ratchet: length-gated by caller
  return xs[0]! as number;
}
`;
    const a = await transpileToJs(before, 'a.ts');
    const b = await transpileToJs(after, 'b.ts');
    expect(a).toBe(b);
    expect(a).toContain('return xs[0]');
    expect(a).not.toContain('!');
  });

  it('erases type-only annotations and interfaces without changing statements', async () => {
    const before = `export const n = 1;\n`;
    const after = `
type N = number;
export const n: N = 1;
`;
    expect(await transpileToJs(before)).toBe(await transpileToJs(after));
  });

  it('detects runtime-semantic edits as emit diffs', async () => {
    const base = `export const n = xs[0];\n`;
    const head = `export const n = xs[0] ?? 0;\n`;
    const result = await compareFileEmit({
      file: 'sample.ts',
      baseSource: base,
      headSource: head,
    });
    expect(result.status).toBe('differ');
    expect(result.detail).toMatch(/\?\?/);
  });

  it('stripCommentsAndCollapseWhitespace collapses runs of spaces', () => {
    expect(stripCommentsAndCollapseWhitespace('a  \n\n  b\n')).toBe('a\nb\n');
  });

  it('stripCommentsAndCollapseWhitespace keeps whitespace inside strings (q-mp-1053)', () => {
    const doubleSpaced = 'export const s = "hello  world";';
    const singleSpaced = 'export const s = "hello world";';
    expect(stripCommentsAndCollapseWhitespace(doubleSpaced)).not.toBe(
      stripCommentsAndCollapseWhitespace(singleSpaced)
    );
    expect(stripCommentsAndCollapseWhitespace(doubleSpaced)).toContain(
      '"hello  world"'
    );
    expect(stripCommentsAndCollapseWhitespace(singleSpaced)).toContain(
      '"hello world"'
    );

    const singleQuotes = "export const s = 'a  b';";
    expect(stripCommentsAndCollapseWhitespace(singleQuotes)).toContain(
      "'a  b'"
    );
  });

  it('stripCommentsAndCollapseWhitespace keeps whitespace inside templates (q-mp-1053)', () => {
    const a = 'export const s = `hello  world`;';
    const b = 'export const s = `hello world`;';
    expect(stripCommentsAndCollapseWhitespace(a)).not.toBe(
      stripCommentsAndCollapseWhitespace(b)
    );
    expect(stripCommentsAndCollapseWhitespace(a)).toContain('`hello  world`');

    // Expression whitespace inside ${…} still collapses; cooked text does not.
    const exprWs = 'export const s = `x${  a  +  b  }y`;';
    const exprTight = 'export const s = `x${a + b}y`;';
    expect(stripCommentsAndCollapseWhitespace(exprWs)).toBe(
      stripCommentsAndCollapseWhitespace(exprTight)
    );
  });

  it('compareFileEmit --normalize differs when only string contents differ (q-mp-1053)', async () => {
    const result = await compareFileEmit({
      file: 'sample.ts',
      baseSource: 'export const s = "hello  world";\n',
      headSource: 'export const s = "hello world";\n',
      normalize: true,
    });
    expect(result.status).toBe('differ');
  });

  it('stripCommentsAndCollapseWhitespace keeps whitespace inside regex (q-mp-1086)', () => {
    const doubleSpaced = 'const r=/a  b/g;';
    const singleSpaced = 'const r=/a b/g;';
    expect(stripCommentsAndCollapseWhitespace(doubleSpaced)).not.toBe(
      stripCommentsAndCollapseWhitespace(singleSpaced)
    );
    expect(stripCommentsAndCollapseWhitespace(doubleSpaced)).toContain(
      '/a  b/g'
    );
    expect(stripCommentsAndCollapseWhitespace(singleSpaced)).toContain(
      '/a b/g'
    );

    // Character class may contain `/` without ending the literal.
    const classed = 'const r=/a[ / ]b/;';
    expect(stripCommentsAndCollapseWhitespace(classed)).toContain('/a[ / ]b/');

    // Division must still collapse insignificant spaces.
    const divWs = 'const n = a  /  b;';
    const divTight = 'const n = a / b;';
    expect(stripCommentsAndCollapseWhitespace(divWs)).toBe(
      stripCommentsAndCollapseWhitespace(divTight)
    );
  });

  it('stripCommentsAndCollapseWhitespace collapses spaces after ++/-- division (q-mp-1326)', () => {
    // Misclassifying `/` as regex left `x++ / 2` ≠ `x++/2`.
    expect(stripCommentsAndCollapseWhitespace('return x++ / 2;')).toBe(
      stripCommentsAndCollapseWhitespace('return x++/2;')
    );
    expect(stripCommentsAndCollapseWhitespace('return x-- / 2;')).toBe(
      stripCommentsAndCollapseWhitespace('return x--/2;')
    );
    expect(stripCommentsAndCollapseWhitespace('return x++ / 2;')).toBe(
      'return x++/2;\n'
    );

    // Binary + / - may still precede a true regex literal.
    const plusRegex = 'const r = a + /x  y/;';
    const plusRegexTight = 'const r = a + /x y/;';
    expect(stripCommentsAndCollapseWhitespace(plusRegex)).not.toBe(
      stripCommentsAndCollapseWhitespace(plusRegexTight)
    );
    expect(stripCommentsAndCollapseWhitespace(plusRegex)).toContain('/x  y/');

    // Ordinary `a / b` spacing is unchanged (single spaces kept).
    expect(stripCommentsAndCollapseWhitespace('const n = a / b;')).toBe(
      'const n = a / b;\n'
    );
  });

  it('compareFileEmit --normalize differs when only regex bodies differ (q-mp-1086)', async () => {
    const result = await compareFileEmit({
      file: 'sample.ts',
      baseSource: 'export const r = /a  b/g;\n',
      headSource: 'export const r = /a b/g;\n',
      normalize: true,
    });
    expect(result.status).toBe('differ');
  });

  it('parseArgs reads --base/--head/--normalize/--minify', () => {
    const opts = parseArgs([
      '--base',
      'abc123',
      '--head',
      'def456',
      '--normalize',
      '--minify',
      'src/games/hex/ai.ts',
    ]);
    expect(opts.base).toBe('abc123');
    expect(opts.head).toBe('def456');
    expect(opts.normalize).toBe(true);
    expect(opts.minify).toBe(true);
    expect(opts.files).toEqual(['src/games/hex/ai.ts']);
    expect(EMIT_TSCONFIG_RAW.compilerOptions.target).toBe('ES2020');
  });

  it('isMissingOrFlagLikeRef / refOptionErrorMessage (q-mp-1333)', () => {
    expect(isMissingOrFlagLikeRef(undefined)).toBe(true);
    expect(isMissingOrFlagLikeRef('')).toBe(true);
    expect(isMissingOrFlagLikeRef('--normalize')).toBe(true);
    expect(isMissingOrFlagLikeRef('--json')).toBe(true);
    expect(isMissingOrFlagLikeRef('abc123')).toBe(false);
    expect(isMissingOrFlagLikeRef('HEAD~1')).toBe(false);
    const msg = refOptionErrorMessage('--base');
    expect(msg).toMatch(/^error: --base requires a git ref/);
    expect(msg).toContain(USAGE);
    expect(refOptionErrorMessage('--head')).toMatch(
      /^error: --head requires a git ref/
    );
  });

  it('CLI rejects --base --normalize without eating the flag (q-mp-1333)', () => {
    const r = spawnSync(
      process.execPath,
      [EMIT_SCRIPT, '--base', '--normalize'],
      { encoding: 'utf8' }
    );
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/error: --base requires a git ref/);
    expect(text).toContain(USAGE);
    expect(text).not.toMatch(/check-emit-identity\n/);
  });

  it('CLI rejects --head --json without eating the flag (q-mp-1333)', () => {
    const r = spawnSync(
      process.execPath,
      [EMIT_SCRIPT, '--head', '--json', '--base', 'abc'],
      { encoding: 'utf8' }
    );
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/error: --head requires a git ref/);
    expect(text).toContain(USAGE);
    // Must not proceed into a JSON payload (flag was not eaten as head).
    expect(text.trim().startsWith('{')).toBe(false);
  });

  it('CLI rejects bare --base without a value (q-mp-1333)', () => {
    const r = spawnSync(process.execPath, [EMIT_SCRIPT, '--base'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/error: --base requires a git ref/);
    expect(text).toContain(USAGE);
  });

  it('CLI accepts exact valid --base/--head/--normalize (q-mp-1333)', () => {
    // Valid refs: exercise parse path only via --help-adjacent happy parseArgs
    // (full emit compare needs real trees). Hermetic parseArgs covers refs.
    const opts = parseArgs([
      '--base',
      'abc',
      '--head',
      'def',
      '--normalize',
      '--json',
    ]);
    expect(opts.base).toBe('abc');
    expect(opts.head).toBe('def');
    expect(opts.normalize).toBe(true);
    expect(opts.json).toBe(true);
  });

  it('default tip constants leave retired wave5 (q-mp-1357/1377/1500)', () => {
    expect(DEFAULT_TIP_REMOTE).toBe('origin/cursor/mp-tip-post3c7bf5e');
    expect(DEFAULT_TIP_FALLBACK_REMOTE).toBe('origin/alpha');
    expect(DEFAULT_TIP_REMOTE).not.toMatch(/integration-fold-wave5/);
    expect(DEFAULT_TIP_REMOTE).not.toMatch(/mp-tip-post38d2/);
    expect(DEFAULT_TIP_FALLBACK_REMOTE).not.toMatch(/integration-fold-wave5/);
    // parseArgs([]) must resolve some merge-base (tip → alpha → HEAD) and must
    // not invent the retired wave5 merge-base when that remote is present.
    const opts = parseArgs([]);
    expect(opts.base.length).toBeGreaterThan(0);
    expect(opts.base).toBe(resolveDefaultMergeBase());
    const wave5 = spawnSync(
      'git',
      ['merge-base', 'HEAD', 'origin/cursor/integration-fold-wave5-tip-4af0'],
      { encoding: 'utf8' }
    );
    if (wave5.status === 0 && wave5.stdout.trim()) {
      expect(opts.base).not.toBe(wave5.stdout.trim());
    }
    const listed = listAiTouchedFiles(opts.base, 'WORKING_TREE');
    expect(listed.ok).toBe(true);
  });

  it('resolveDefaultMergeBase prefers living tip then alpha then HEAD (q-mp-1357/1500)', () => {
    const tipSpawn = (
      _cmd: string,
      args: string[],
      _opts?: { encoding?: string; cwd?: string }
    ) => {
      const key = args.join(' ');
      if (key === 'merge-base HEAD origin/cursor/mp-tip-post3c7bf5e') {
        return { status: 0, stdout: 'living-tip-mb\n', stderr: '' };
      }
      return { status: 128, stdout: '', stderr: 'unused\n' };
    };
    expect(resolveDefaultMergeBase({ spawnSync: tipSpawn as never })).toBe(
      'living-tip-mb'
    );

    const calls: string[][] = [];
    const alphaSpawn = (
      _cmd: string,
      args: string[],
      _opts?: { encoding?: string; cwd?: string }
    ) => {
      calls.push(args);
      const key = args.join(' ');
      if (key === 'merge-base HEAD origin/cursor/mp-tip-post3c7bf5e') {
        return { status: 128, stdout: '', stderr: 'missing tip\n' };
      }
      if (key === 'merge-base HEAD origin/alpha') {
        return { status: 0, stdout: 'alpha-mb\n', stderr: '' };
      }
      return { status: 0, stdout: 'HEADSHA\n', stderr: '' };
    };
    expect(resolveDefaultMergeBase({ spawnSync: alphaSpawn as never })).toBe(
      'alpha-mb'
    );
    expect(calls[0]).toEqual([
      'merge-base',
      'HEAD',
      'origin/cursor/mp-tip-post3c7bf5e',
    ]);
    expect(calls[1]).toEqual(['merge-base', 'HEAD', 'origin/alpha']);

    const spawnHeadOnly = (
      _cmd: string,
      args: string[],
      _opts?: { encoding?: string; cwd?: string }
    ) => {
      if (args[0] === 'rev-parse') {
        return { status: 0, stdout: 'only-head\n', stderr: '' };
      }
      return { status: 128, stdout: '', stderr: 'no tip\n' };
    };
    expect(resolveDefaultMergeBase({ spawnSync: spawnHeadOnly as never })).toBe(
      'only-head'
    );
  });

  it('duplicateFlagErrorMessage names the flag (q-mp-1373)', () => {
    const msg = duplicateFlagErrorMessage('--base');
    expect(msg).toMatch(/^error: Duplicate --base/);
    expect(msg).toContain(USAGE);
  });

  it('CLI rejects duplicate --base / --head (q-mp-1373)', () => {
    const dupBase = spawnSync(
      process.execPath,
      [EMIT_SCRIPT, '--base', 'aaa', '--base', 'bbb'],
      { encoding: 'utf8' }
    );
    expect(dupBase.status).toBe(2);
    const baseText = `${dupBase.stdout}\n${dupBase.stderr}`;
    expect(baseText).toMatch(/error: Duplicate --base/);
    expect(baseText).toContain(USAGE);

    const dupHead = spawnSync(
      process.execPath,
      [EMIT_SCRIPT, '--base', 'aaa', '--head', 'h1', '--head', 'h2'],
      { encoding: 'utf8' }
    );
    expect(dupHead.status).toBe(2);
    const headText = `${dupHead.stdout}\n${dupHead.stderr}`;
    expect(headText).toMatch(/error: Duplicate --head/);
    expect(headText).toContain(USAGE);
  });

  it('CLI rejects duplicate boolean flags (q-mp-1373)', () => {
    const r = spawnSync(
      process.execPath,
      [EMIT_SCRIPT, '--base', 'aaa', '--normalize', '--normalize'],
      { encoding: 'utf8' }
    );
    expect(r.status).toBe(2);
    expect(`${r.stdout}\n${r.stderr}`).toMatch(/error: Duplicate --normalize/);
  });

  it('duplicateFilesFromErrorMessage (q-mp-1381)', () => {
    const msg = duplicateFilesFromErrorMessage('--files-from');
    expect(msg).toMatch(/^error: Duplicate --files-from/);
    expect(msg).toContain(USAGE);
  });

  it('CLI rejects duplicate --files-from (q-mp-1381)', () => {
    const r = spawnSync(
      process.execPath,
      [
        EMIT_SCRIPT,
        '--base',
        'HEAD',
        '--files-from',
        '/tmp/a-list',
        '--files-from',
        '/tmp/b-list',
      ],
      { encoding: 'utf8' }
    );
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(/error: Duplicate --files-from/);
    expect(text).toContain(USAGE);
    // Must not proceed into path-not-found for either list (dup wins first).
    expect(text).not.toMatch(/path not found/);
  });

  it('CLI rejects flag-like --files-from value (q-mp-1382)', () => {
    const r = spawnSync(
      process.execPath,
      [EMIT_SCRIPT, '--base', 'HEAD', '--files-from', '--json'],
      { encoding: 'utf8' }
    );
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(
      /error: --files-from requires a path to a file list \(missing or flag-like value\)/
    );
    expect(text).toContain(USAGE);
    // Must not misreport the flag token as a missing filesystem path.
    expect(text).not.toMatch(/path not found: --json/);
  });

  it('CLI rejects bare --files-from without a value (q-mp-1382)', () => {
    const r = spawnSync(
      process.execPath,
      [EMIT_SCRIPT, '--base', 'HEAD', '--files-from'],
      { encoding: 'utf8' }
    );
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toMatch(
      /error: --files-from requires a path to a file list \(missing or flag-like value\)/
    );
    expect(text).toContain(USAGE);
  });

  it('CLI still reports path not found for a real missing list (q-mp-1382)', () => {
    const r = spawnSync(
      process.execPath,
      [
        EMIT_SCRIPT,
        '--base',
        'HEAD',
        '--files-from',
        '/tmp/no-files-from-xyz-1382',
      ],
      { encoding: 'utf8' }
    );
    expect(r.status).toBe(2);
    const text = `${r.stdout}\n${r.stderr}`;
    expect(text).toContain(
      'error: --files-from path not found: /tmp/no-files-from-xyz-1382'
    );
    expect(text).not.toMatch(/flag-like value/);
  });

  it('minify mode treats brace-only curly wraps as identical', async () => {
    const base = `export function f(x: number) {\n  if (x) return 1;\n  return 0;\n}\n`;
    const head = `export function f(x: number) {\n  if (x) {\n    return 1;\n  }\n  return 0;\n}\n`;
    const unmin = await compareFileEmit({
      file: 'brace.ts',
      baseSource: base,
      headSource: head,
    });
    expect(unmin.status).toBe('differ');
    const min = await compareFileEmit({
      file: 'brace.ts',
      baseSource: base,
      headSource: head,
      minify: true,
    });
    expect(min.status).toBe('identical');
  });

  it('minify mode ignores rename-only emit when raw emit matches (q-mp-1288)', async () => {
    // esbuild may pick different local names after minify even when raw emit
    // is byte-identical (type annotation erasure only).
    const typed = 'export const x: number = 1;\n';
    const plain = 'export const x = 1;\n';
    const raw = await compareFileEmit({
      file: 'rename.ts',
      baseSource: typed,
      headSource: plain,
    });
    expect(raw.status).toBe('identical');
    const minA = await transpileToJs(typed, 'a.ts', { minify: true });
    const minB = await transpileToJs(plain, 'b.ts', { minify: true });
    // Fixture still produces rename-only minify drift (prove the bug surface).
    expect(minA).not.toBe(minB);
    expect(minA).toMatch(/export\{[a-z] as x\}/);
    expect(minB).toMatch(/export\{[a-z] as x\}/);
    const min = await compareFileEmit({
      file: 'rename.ts',
      baseSource: typed,
      headSource: plain,
      minify: true,
    });
    expect(min.status).toBe('identical');
  });

  it('minify mode still reports real emit diffs (q-mp-1288)', async () => {
    const result = await compareFileEmit({
      file: 'real-diff.ts',
      baseSource: 'export const x = 1;\n',
      headSource: 'export const x = 2;\n',
      minify: true,
    });
    expect(result.status).toBe('differ');
    expect(result.detail).toMatch(/[12]/);
  });

  it('filesFromErrorMessage includes Usage and path (q-mp-869)', () => {
    expect(USAGE).toBe(
      'Usage: node scripts/check-emit-identity.mjs [options] [files...]'
    );
    const missing = filesFromErrorMessage('', 'missing');
    expect(missing).toContain(USAGE);
    expect(missing).toMatch(
      /^error: --files-from requires a path to a file list \(missing or flag-like value\)/
    );
    expect(missing).not.toMatch(/ENOENT|EISDIR|Error:/);
    const flagLike = filesFromErrorMessage('--json', 'flag-like');
    expect(flagLike).toMatch(/missing or flag-like value/);
    expect(flagLike).not.toMatch(/path not found/);

    const notFound = filesFromErrorMessage(
      '/tmp/no-files-from-xyz',
      'not-found'
    );
    expect(notFound).toContain('/tmp/no-files-from-xyz');
    expect(notFound).toContain(USAGE);
    expect(notFound).not.toMatch(/ENOENT|EISDIR/);

    const notFile = filesFromErrorMessage('/tmp', 'not-file');
    expect(notFile).toContain('--files-from path is not a file: /tmp');
    expect(notFile).toContain(USAGE);
  });

  it('loadFilesFromList rejects missing / non-file without throwing (q-mp-869)', () => {
    const missing = loadFilesFromList('');
    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.message).toContain(USAGE);
      expect(missing.message).not.toMatch(/ENOENT|EISDIR/);
    }

    const notFound = loadFilesFromList('/tmp/no-files-from-xyz', {
      existsSync: () => false,
    });
    expect(notFound.ok).toBe(false);
    if (!notFound.ok) {
      expect(notFound.message).toContain('not found');
      expect(notFound.message).toContain('/tmp/no-files-from-xyz');
    }

    const notFile = loadFilesFromList('/tmp', {
      existsSync: () => true,
      statSync: () => ({ isFile: () => false }),
    });
    expect(notFile.ok).toBe(false);
    if (!notFile.ok) {
      expect(notFile.message).toContain('not a file');
    }
  });

  it('loadFilesFromList reads a valid list (skip comments/blanks)', () => {
    const loaded = loadFilesFromList('/virtual/list.txt', {
      existsSync: () => true,
      statSync: () => ({ isFile: () => true }),
      readFileSync: () =>
        'src/games/hex/ai.ts\n# comment\n// c-style\n\nsrc/games/fiar/ai.ts\n',
    });
    expect(loaded).toEqual({
      ok: true,
      files: ['src/games/hex/ai.ts', 'src/games/fiar/ai.ts'],
    });
  });

  it('gitDiffNameOnlyErrorMessage includes Usage and refs (q-mp-1301)', () => {
    const msg = gitDiffNameOnlyErrorMessage(
      'does-not-exist',
      'WORKING_TREE',
      "fatal: bad revision 'does-not-exist'",
      128
    );
    expect(msg).toContain(USAGE);
    expect(msg).toMatch(/^error: git diff failed for --base does-not-exist/);
    expect(msg).toContain('--head WORKING_TREE');
    expect(msg).toContain('(exit 128)');
    expect(msg).toContain("fatal: bad revision 'does-not-exist'");
    expect(msg).not.toMatch(/ENOENT|Error:/);
  });

  it('listAiTouchedFiles fails closed on non-zero git diff (q-mp-1301)', () => {
    const listed = listAiTouchedFiles('does-not-exist', 'WORKING_TREE', {
      spawnSync: () => ({
        status: 128,
        stdout: '',
        stderr: "fatal: bad revision 'does-not-exist'\n",
        error: undefined,
      }),
    });
    expect(listed.ok).toBe(false);
    if (!listed.ok) {
      expect(listed.message).toContain('git diff failed');
      expect(listed.message).toContain('does-not-exist');
      expect(listed.message).toContain(USAGE);
      expect(listed.message).toContain("fatal: bad revision 'does-not-exist'");
    }
  });

  it('listAiTouchedFiles returns empty files when git succeeds (q-mp-1301)', () => {
    const listed = listAiTouchedFiles('HEAD', 'HEAD', {
      spawnSync: () => ({
        status: 0,
        stdout: '',
        stderr: '',
        error: undefined,
      }),
    });
    expect(listed).toEqual({ ok: true, files: [] });
  });

  it('listAiTouchedFiles filters ai modules from successful git stdout (q-mp-1301)', () => {
    const listed = listAiTouchedFiles('abc', 'def', {
      spawnSync: () => ({
        status: 0,
        stdout:
          'src/games/hex/ai.ts\nsrc/games/hex/board.ts\nsrc/games/fiar/ai-client.ts\n',
        stderr: '',
        error: undefined,
      }),
    });
    expect(listed).toEqual({
      ok: true,
      files: ['src/games/fiar/ai-client.ts', 'src/games/hex/ai.ts'],
    });
  });

  it('runEmitIdentityCheck fails closed when default file discovery cannot diff (q-mp-1301)', async () => {
    const result = await runEmitIdentityCheck(
      {
        base: 'does-not-exist',
        head: 'WORKING_TREE',
        files: [],
        normalize: false,
        minify: false,
        json: false,
      },
      {
        listAiTouchedFiles: () => ({
          ok: false,
          message: gitDiffNameOnlyErrorMessage(
            'does-not-exist',
            'WORKING_TREE',
            "fatal: bad revision 'does-not-exist'",
            128
          ),
        }),
      }
    );
    expect(result.ok).toBe(false);
    expect(result.results).toEqual([]);
    expect(result.error).toMatch(/git diff failed/);
    expect(result.error).toContain('does-not-exist');
  });

  it('runEmitIdentityCheck still ok on true empty touched set (q-mp-1301)', async () => {
    const result = await runEmitIdentityCheck(
      {
        base: 'HEAD',
        head: 'HEAD',
        files: [],
        normalize: false,
        minify: false,
        json: false,
      },
      {
        listAiTouchedFiles: () => ({ ok: true, files: [] }),
      }
    );
    expect(result.ok).toBe(true);
    expect(result.results).toEqual([]);
    expect(result.error).toBeUndefined();
  });

  it('normalizeRepoRelativePath strips ./ and maps abs under root (q-mp-1429/1430)', () => {
    expect(normalizeRepoRelativePath('./src/games/hex/ai.ts')).toEqual({
      ok: true,
      path: 'src/games/hex/ai.ts',
    });
    const abs = resolve('src/games/hex/ai.ts');
    expect(normalizeRepoRelativePath(abs)).toEqual({
      ok: true,
      path: 'src/games/hex/ai.ts',
    });
    expect(normalizeRepoRelativePath('src/games/hex/ai.ts')).toEqual({
      ok: true,
      path: 'src/games/hex/ai.ts',
    });
    const escaped = normalizeRepoRelativePath('/tmp/outside.ts');
    expect(escaped.ok).toBe(false);
    if (!escaped.ok) {
      expect(escaped.message).toContain('path escapes repository root');
      expect(escaped.message).toContain(USAGE);
    }
    expect(pathNotInRepoErrorMessage('/tmp/x')).toMatch(
      /^error: path escapes repository root: \/tmp\/x/
    );
  });

  it('dedupePreserveOrder keeps first occurrence (q-mp-1430)', () => {
    expect(
      dedupePreserveOrder([
        'src/games/hex/ai.ts',
        'src/games/fiar/ai.ts',
        'src/games/hex/ai.ts',
      ])
    ).toEqual(['src/games/hex/ai.ts', 'src/games/fiar/ai.ts']);
  });

  it('loadFilesFromList normalizes ./ , abs paths, and dedupes (q-mp-1429/1430)', () => {
    const abs = resolve('src/games/hex/ai.ts');
    const loaded = loadFilesFromList('/virtual/list.txt', {
      existsSync: () => true,
      statSync: () => ({ isFile: () => true }),
      readFileSync: () =>
        `src/games/hex/ai.ts\n./src/games/hex/ai.ts\n${abs}\nsrc/games/hex/ai.ts\n`,
    });
    expect(loaded).toEqual({
      ok: true,
      files: ['src/games/hex/ai.ts'],
    });

    const escape = loadFilesFromList('/virtual/escape.txt', {
      existsSync: () => true,
      statSync: () => ({ isFile: () => true }),
      readFileSync: () => '/tmp/outside-emit.ts\n',
    });
    expect(escape.ok).toBe(false);
    if (!escape.ok) {
      expect(escape.message).toContain('path escapes repository root');
    }
  });

  it('normalizeRepoRelativePath accepts Windows-style relative separators (q-mp-1463)', () => {
    expect(normalizeRepoRelativePath('src\\games\\hex\\ai.ts')).toEqual({
      ok: true,
      path: 'src/games/hex/ai.ts',
    });
    expect(normalizeRepoRelativePath('.\\src\\games\\hex\\ai.ts')).toEqual({
      ok: true,
      path: 'src/games/hex/ai.ts',
    });
  });

  it('loadFilesFromList normalizes backslash relatives and dedupes (q-mp-1463)', () => {
    const loaded = loadFilesFromList('/virtual/bs.txt', {
      existsSync: () => true,
      statSync: () => ({ isFile: () => true }),
      readFileSync: () =>
        'src\\games\\hex\\ai.ts\nsrc/games/hex/ai.ts\nsrc\\games\\fiar\\ai.ts\n',
    });
    expect(loaded).toEqual({
      ok: true,
      files: ['src/games/hex/ai.ts', 'src/games/fiar/ai.ts'],
    });
  });

  it('normalizeRepoRelativePath rejects ? / # / NUL / control junk (q-mp-1464)', () => {
    const q = normalizeRepoRelativePath('src/games/hex/ai.ts?x');
    expect(q.ok).toBe(false);
    if (!q.ok) {
      expect(q.message).toContain('path contains invalid characters');
      expect(q.message).toContain('src/games/hex/ai.ts?x');
      expect(q.message).toContain(USAGE);
    }
    const hash = normalizeRepoRelativePath('src/games/hex/ai.ts#frag');
    expect(hash.ok).toBe(false);
    if (!hash.ok) {
      expect(hash.message).toBe(
        pathJunkErrorMessage('src/games/hex/ai.ts#frag')
      );
    }
    const nul = normalizeRepoRelativePath('src/games/hex/ai.ts\0');
    expect(nul.ok).toBe(false);
    if (!nul.ok) {
      expect(nul.message).toContain('path contains invalid characters');
    }
    expect(normalizeRepoRelativePath('src/games/hex/ai.ts')).toEqual({
      ok: true,
      path: 'src/games/hex/ai.ts',
    });
  });

  it('loadFilesFromList rejects path junk before missing-file theater (q-mp-1464)', () => {
    const junk = loadFilesFromList('/virtual/junk.txt', {
      existsSync: () => true,
      statSync: () => ({ isFile: () => true }),
      readFileSync: () => 'src/games/hex/ai.ts?x\n',
    });
    expect(junk.ok).toBe(false);
    if (!junk.ok) {
      expect(junk.message).toContain('path contains invalid characters');
      expect(junk.message).not.toContain('MISSING-BASE');
      expect(junk.message).not.toContain('MISSING-HEAD');
    }
  });

  it('stripInlinePathComment / full-line // skip; inline // not collapsed (q-mp-1471)', () => {
    expect(stripInlinePathComment('src/games/hex/ai.ts // trailing')).toBe(
      'src/games/hex/ai.ts'
    );
    // Leading blanks + `//` strip to a blank prefix; callers trim/skip.
    expect(stripInlinePathComment('  // only').trim()).toBe('');
    expect(
      normalizeRepoRelativePath('src/games/hex/ai.ts // trailing')
    ).toEqual({
      ok: true,
      path: 'src/games/hex/ai.ts',
    });
    const fullLine = normalizeRepoRelativePath('// c-style');
    expect(fullLine.ok).toBe(false);
    if (!fullLine.ok) {
      expect(fullLine.message).toBe(pathSlashCommentErrorMessage('// c-style'));
      expect(fullLine.message).not.toContain('path escapes repository root');
    }
    const collapsed = normalizeRepoRelativePath(
      'src/games/hex/ai.ts//trailing'
    );
    expect(collapsed.ok).toBe(false);
    if (!collapsed.ok) {
      expect(collapsed.message).toContain("path contains '//'");
      expect(collapsed.message).not.toMatch(/ai\.ts \/ trailing/);
    }

    const loaded = loadFilesFromList('/virtual/slash-comments.txt', {
      existsSync: () => true,
      statSync: () => ({ isFile: () => true }),
      readFileSync: () =>
        '// full-line c-style\n# hash\nsrc/games/hex/ai.ts // trailing note\nsrc/games/fiar/ai.ts\n',
    });
    expect(loaded).toEqual({
      ok: true,
      files: ['src/games/hex/ai.ts', 'src/games/fiar/ai.ts'],
    });
  });

  it('normalizeRepoRelativePath rejects directory / ..-collapsed directory (q-mp-1472)', () => {
    const dir = normalizeRepoRelativePath('src/games/hex');
    expect(dir.ok).toBe(false);
    if (!dir.ok) {
      expect(dir.message).toBe(pathIsDirectoryErrorMessage('src/games/hex'));
      expect(dir.message).not.toMatch(/EISDIR/);
    }
    const collapsed = normalizeRepoRelativePath('src/games/hex/ai.ts/..');
    expect(collapsed.ok).toBe(false);
    if (!collapsed.ok) {
      expect(collapsed.message).toContain('path is a directory');
      expect(collapsed.message).toContain('src/games/hex');
    }
    expect(normalizeRepoRelativePath('src/games/hex/ai.ts')).toEqual({
      ok: true,
      path: 'src/games/hex/ai.ts',
    });
  });

  it('loadFilesFromList rejects directory paths before EISDIR (q-mp-1472)', () => {
    const dirList = loadFilesFromList('/virtual/dir.txt', {
      existsSync: () => true,
      statSync: () => ({ isFile: () => true }),
      readFileSync: () => 'src/games/hex\n',
    });
    expect(dirList.ok).toBe(false);
    if (!dirList.ok) {
      expect(dirList.message).toContain('path is a directory');
      expect(dirList.message).not.toMatch(/EISDIR/);
    }
  });

  it('normalizeRepoRelativePath rejects ADS / percent / & / * junk (q-mp-1473)', () => {
    expect(
      pathHasInvalidCharacters('src/games/hex/ai.ts:Zone.Identifier')
    ).toBe(true);
    expect(pathHasInvalidCharacters('src%2Fgames%2Fhex%2Fai.ts')).toBe(true);
    expect(pathHasInvalidCharacters('src/games/hex/ai.ts&x')).toBe(true);
    expect(pathHasInvalidCharacters('src/games/hex/ai.ts*')).toBe(true);
    expect(pathHasInvalidCharacters('src/games/hex/ai.ts')).toBe(false);
    // Windows drive absolute still allowed (colon after letter + slash).
    expect(pathHasInvalidCharacters('C:\\workspace\\src\\x.ts')).toBe(false);

    for (const bad of [
      'src/games/hex/ai.ts:Zone.Identifier',
      'src%2Fgames%2Fhex%2Fai.ts',
      'src/games/hex/ai.ts&x',
      'src/games/hex/ai.ts*',
    ]) {
      const r = normalizeRepoRelativePath(bad);
      expect(r.ok).toBe(false);
      if (!r.ok) {
        expect(r.message).toBe(pathJunkErrorMessage(bad));
        expect(r.message).not.toContain('MISSING-BASE');
      }
    }
  });

  it('loadFilesFromList rejects ADS / percent / & / * before missing-base (q-mp-1473)', () => {
    const junk = loadFilesFromList('/virtual/ads.txt', {
      existsSync: () => true,
      statSync: () => ({ isFile: () => true }),
      readFileSync: () => 'src/games/hex/ai.ts:Zone.Identifier\n',
    });
    expect(junk.ok).toBe(false);
    if (!junk.ok) {
      expect(junk.message).toContain('path contains invalid characters');
      expect(junk.message).not.toContain('MISSING-BASE');
    }
  });

  it('normalizeRepoRelativePath rejects shell-metachar path junk (q-mp-1478)', () => {
    for (const bad of [
      'src/games/hex/ai.ts|x',
      'src/games/hex/ai.ts<x',
      'src/games/hex/ai.ts>x',
      'src/games/hex/ai.ts;rm',
      'src/games/hex/ai.ts"x',
      "src/games/hex/ai.ts'x",
      'src/games/hex/ai.ts`x',
      'src/games/hex/ai.ts$HOME',
    ]) {
      expect(pathHasInvalidCharacters(bad)).toBe(true);
      const r = normalizeRepoRelativePath(bad);
      expect(r.ok).toBe(false);
      if (!r.ok) {
        expect(r.message).toBe(pathJunkErrorMessage(bad));
        expect(r.message).not.toContain('MISSING-BASE');
      }
    }
    expect(pathHasInvalidCharacters('src/games/hex/ai.ts')).toBe(false);
    expect(normalizeRepoRelativePath('src/games/hex/ai.ts')).toEqual({
      ok: true,
      path: 'src/games/hex/ai.ts',
    });
  });

  it('loadFilesFromList / CLI reject shell-metachar before missing-base (q-mp-1478)', () => {
    const junk = loadFilesFromList('/virtual/shell.txt', {
      existsSync: () => true,
      statSync: () => ({ isFile: () => true }),
      readFileSync: () => 'src/games/hex/ai.ts|x\n',
    });
    expect(junk.ok).toBe(false);
    if (!junk.ok) {
      expect(junk.message).toContain('path contains invalid characters');
      expect(junk.message).not.toContain('MISSING-BASE');
    }

    const dir = mkdtempSync(join(tmpdir(), 'emit-1478-'));
    const listPath = join(dir, 'pipe.txt');
    writeFileSync(listPath, 'src/games/hex/ai.ts|x\n');
    try {
      const r = spawnSync(
        process.execPath,
        [EMIT_SCRIPT, '--base', 'HEAD', '--files-from', listPath],
        { encoding: 'utf8' }
      );
      expect(r.status).toBe(2);
      expect(r.stderr + r.stdout).toContain('path contains invalid characters');
      expect(r.stderr + r.stdout).not.toContain('MISSING-BASE');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('normalizeRepoRelativePath rejects unicode format / invisible junk (q-mp-1479)', () => {
    for (const bad of [
      'src/games/hex/ai.ts\u200B',
      'src/games/hex/ai.ts\u200C',
      'src/games/hex/ai.ts\u00AD',
      'src/games/hex/ai.ts\u202E',
    ]) {
      expect(pathHasInvalidCharacters(bad)).toBe(true);
      const r = normalizeRepoRelativePath(bad);
      expect(r.ok).toBe(false);
      if (!r.ok) {
        expect(r.message).toBe(pathJunkErrorMessage(bad));
        expect(r.message).not.toContain('MISSING-BASE');
      }
    }
    expect(normalizeRepoRelativePath('src/games/hex/ai.ts')).toEqual({
      ok: true,
      path: 'src/games/hex/ai.ts',
    });
  });

  it('loadFilesFromList / CLI reject ZWSP suffix before missing-base (q-mp-1479)', () => {
    const zwsp = 'src/games/hex/ai.ts\u200B';
    const junk = loadFilesFromList('/virtual/zwsp.txt', {
      existsSync: () => true,
      statSync: () => ({ isFile: () => true }),
      readFileSync: () => `${zwsp}\n`,
    });
    expect(junk.ok).toBe(false);
    if (!junk.ok) {
      expect(junk.message).toContain('path contains invalid characters');
      expect(junk.message).not.toContain('MISSING-BASE');
    }

    const dir = mkdtempSync(join(tmpdir(), 'emit-1479-'));
    const listPath = join(dir, 'zwsp.txt');
    writeFileSync(listPath, `${zwsp}\n`);
    try {
      const r = spawnSync(
        process.execPath,
        [EMIT_SCRIPT, '--base', 'HEAD', '--files-from', listPath],
        { encoding: 'utf8' }
      );
      expect(r.status).toBe(2);
      expect(r.stderr + r.stdout).toContain('path contains invalid characters');
      expect(r.stderr + r.stdout).not.toContain('MISSING-BASE');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('normalizeRepoRelativePath rejects junk \\extra after a file path (q-mp-1480)', () => {
    expect(pathHasJunkBackslashExtra('src/games/hex/ai.ts/extra')).toBe(true);
    expect(pathHasJunkBackslashExtra('src/games/hex/ai.ts')).toBe(false);

    const junk = normalizeRepoRelativePath('src/games/hex/ai.ts\\extra');
    expect(junk.ok).toBe(false);
    if (!junk.ok) {
      expect(junk.message).toBe(
        pathJunkErrorMessage('src/games/hex/ai.ts\\extra')
      );
      expect(junk.message).not.toContain('MISSING-BASE');
      expect(junk.message).not.toMatch(/ai\.ts\/extra/);
    }
    // Nested Windows relatives with a trailing junk segment also reject.
    const nested = normalizeRepoRelativePath('src\\games\\hex\\ai.ts\\extra');
    expect(nested.ok).toBe(false);
    if (!nested.ok) {
      expect(nested.message).toContain('path contains invalid characters');
    }
    // Real Windows-style relatives still normalize (q-mp-1463).
    expect(normalizeRepoRelativePath('src\\games\\hex\\ai.ts')).toEqual({
      ok: true,
      path: 'src/games/hex/ai.ts',
    });
    expect(normalizeRepoRelativePath('src/games/hex/ai.ts')).toEqual({
      ok: true,
      path: 'src/games/hex/ai.ts',
    });
  });

  it('loadFilesFromList / CLI reject ai.ts\\extra before missing-base (q-mp-1480)', () => {
    const junk = loadFilesFromList('/virtual/bs-extra.txt', {
      existsSync: () => true,
      statSync: () => ({ isFile: () => true }),
      readFileSync: () => 'src/games/hex/ai.ts\\extra\n',
    });
    expect(junk.ok).toBe(false);
    if (!junk.ok) {
      expect(junk.message).toContain('path contains invalid characters');
      expect(junk.message).not.toContain('MISSING-BASE');
    }

    const dir = mkdtempSync(join(tmpdir(), 'emit-1480-'));
    const junkList = join(dir, 'extra.txt');
    const cleanList = join(dir, 'clean.txt');
    writeFileSync(junkList, 'src/games/hex/ai.ts\\extra\n');
    writeFileSync(cleanList, 'src/games/hex/ai.ts\n');
    try {
      const bad = spawnSync(
        process.execPath,
        [EMIT_SCRIPT, '--base', 'HEAD', '--files-from', junkList],
        { encoding: 'utf8' }
      );
      expect(bad.status).toBe(2);
      expect(bad.stderr + bad.stdout).toContain(
        'path contains invalid characters'
      );
      expect(bad.stderr + bad.stdout).not.toContain('MISSING-BASE');

      const clean = spawnSync(
        process.execPath,
        [EMIT_SCRIPT, '--base', 'HEAD', '--files-from', cleanList],
        { encoding: 'utf8' }
      );
      expect(clean.status).toBe(0);
      expect(clean.stdout).toContain('OK');
      expect(clean.stdout).toContain('src/games/hex/ai.ts');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('normalizeRepoRelativePath rejects editor backup suffixes (q-mp-1497)', () => {
    for (const bad of [
      'src/games/hex/ai.ts~',
      'src/games/hex/ai.ts.bak',
      'src/games/hex/ai.ts.swp',
      'src/games/hex/ai.ts.tmp',
      'src/games/hex/ai.ts.orig',
      'src/games/hex/ai.ts.rej',
    ]) {
      expect(pathHasEditorBackupSuffix(bad)).toBe(true);
      expect(pathHasInvalidCharacters(bad)).toBe(false);
      const r = normalizeRepoRelativePath(bad);
      expect(r.ok).toBe(false);
      if (!r.ok) {
        expect(r.message).toBe(pathJunkErrorMessage(bad));
        expect(r.message).toContain('path contains invalid characters');
        expect(r.message).not.toContain('MISSING-BASE');
      }
    }
    expect(pathHasEditorBackupSuffix('src/games/hex/ai.ts')).toBe(false);
    expect(normalizeRepoRelativePath('src/games/hex/ai.ts')).toEqual({
      ok: true,
      path: 'src/games/hex/ai.ts',
    });
  });

  it('normalizeRepoRelativePath rejects vim secondary swap suffixes (q-mp-1499)', () => {
    for (const bad of [
      'src/games/hex/ai.ts.swo',
      'src/games/hex/ai.ts.swn',
      'src/games/hex/ai.ts.swx',
      // retained primary-swap control from q-mp-1497
      'src/games/hex/ai.ts.swp',
    ]) {
      expect(pathHasEditorBackupSuffix(bad)).toBe(true);
      expect(pathHasInvalidCharacters(bad)).toBe(false);
      const r = normalizeRepoRelativePath(bad);
      expect(r.ok).toBe(false);
      if (!r.ok) {
        expect(r.message).toBe(pathJunkErrorMessage(bad));
        expect(r.message).toContain('path contains invalid characters');
        expect(r.message).not.toContain('MISSING-BASE');
      }
    }
    expect(pathHasEditorBackupSuffix('src/games/hex/ai.ts')).toBe(false);
    expect(normalizeRepoRelativePath('src/games/hex/ai.ts')).toEqual({
      ok: true,
      path: 'src/games/hex/ai.ts',
    });
  });

  it('loadFilesFromList / CLI reject ai.ts~ before missing-base (q-mp-1497)', () => {
    const junk = loadFilesFromList('/virtual/backup.txt', {
      existsSync: () => true,
      statSync: () => ({ isFile: () => true }),
      readFileSync: () => 'src/games/hex/ai.ts~\n',
    });
    expect(junk.ok).toBe(false);
    if (!junk.ok) {
      expect(junk.message).toContain('path contains invalid characters');
      expect(junk.message).not.toContain('MISSING-BASE');
    }

    const dir = mkdtempSync(join(tmpdir(), 'emit-1497-'));
    const junkList = join(dir, 'tilde.txt');
    const bakList = join(dir, 'bak.txt');
    const cleanList = join(dir, 'clean.txt');
    writeFileSync(junkList, 'src/games/hex/ai.ts~\n');
    writeFileSync(bakList, 'src/games/hex/ai.ts.bak\n');
    writeFileSync(cleanList, 'src/games/hex/ai.ts\n');
    try {
      for (const listPath of [junkList, bakList]) {
        const bad = spawnSync(
          process.execPath,
          [EMIT_SCRIPT, '--base', 'HEAD', '--files-from', listPath],
          { encoding: 'utf8' }
        );
        expect(bad.status).toBe(2);
        expect(bad.stderr + bad.stdout).toContain(
          'path contains invalid characters'
        );
        expect(bad.stderr + bad.stdout).not.toContain('MISSING-BASE');
      }

      const clean = spawnSync(
        process.execPath,
        [EMIT_SCRIPT, '--base', 'HEAD', '--files-from', cleanList],
        { encoding: 'utf8' }
      );
      expect(clean.status).toBe(0);
      expect(clean.stdout).toContain('OK');
      expect(clean.stdout).toContain('src/games/hex/ai.ts');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('loadFilesFromList / CLI reject vim secondary swaps before missing-base (q-mp-1499)', () => {
    const junk = loadFilesFromList('/virtual/swo.txt', {
      existsSync: () => true,
      statSync: () => ({ isFile: () => true }),
      readFileSync: () => 'src/games/hex/ai.ts.swo\n',
    });
    expect(junk.ok).toBe(false);
    if (!junk.ok) {
      expect(junk.message).toContain('path contains invalid characters');
      expect(junk.message).not.toContain('MISSING-BASE');
    }

    const dir = mkdtempSync(join(tmpdir(), 'emit-1499-'));
    const swoList = join(dir, 'swo.txt');
    const swnList = join(dir, 'swn.txt');
    const swxList = join(dir, 'swx.txt');
    const swpList = join(dir, 'swp.txt');
    const cleanList = join(dir, 'clean.txt');
    writeFileSync(swoList, 'src/games/hex/ai.ts.swo\n');
    writeFileSync(swnList, 'src/games/hex/ai.ts.swn\n');
    writeFileSync(swxList, 'src/games/hex/ai.ts.swx\n');
    writeFileSync(swpList, 'src/games/hex/ai.ts.swp\n');
    writeFileSync(cleanList, 'src/games/hex/ai.ts\n');
    try {
      for (const listPath of [swoList, swnList, swxList, swpList]) {
        const bad = spawnSync(
          process.execPath,
          [EMIT_SCRIPT, '--base', 'HEAD', '--files-from', listPath],
          { encoding: 'utf8' }
        );
        expect(bad.status).toBe(2);
        expect(bad.stderr + bad.stdout).toContain(
          'path contains invalid characters'
        );
        expect(bad.stderr + bad.stdout).not.toContain('MISSING-BASE');
      }

      const clean = spawnSync(
        process.execPath,
        [EMIT_SCRIPT, '--base', 'HEAD', '--files-from', cleanList],
        { encoding: 'utf8' }
      );
      expect(clean.status).toBe(0);
      expect(clean.stdout).toContain('OK');
      expect(clean.stdout).toContain('src/games/hex/ai.ts');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('normalizeRepoRelativePath rejects OS/editor backup suffixes (q-mp-1503)', () => {
    for (const bad of [
      'src/games/hex/ai.ts.old',
      'src/games/hex/ai.ts.save',
      'src/games/hex/ai.ts.backup',
      // retained primary-swap control from q-mp-1497
      'src/games/hex/ai.ts.swp',
    ]) {
      expect(pathHasEditorBackupSuffix(bad)).toBe(true);
      expect(pathHasInvalidCharacters(bad)).toBe(false);
      const r = normalizeRepoRelativePath(bad);
      expect(r.ok).toBe(false);
      if (!r.ok) {
        expect(r.message).toBe(pathJunkErrorMessage(bad));
        expect(r.message).toContain('path contains invalid characters');
        expect(r.message).not.toContain('MISSING-BASE');
      }
    }
    expect(pathHasEditorBackupSuffix('src/games/hex/ai.ts')).toBe(false);
    expect(normalizeRepoRelativePath('src/games/hex/ai.ts')).toEqual({
      ok: true,
      path: 'src/games/hex/ai.ts',
    });
  });

  it('loadFilesFromList / CLI reject OS/editor backups before missing-base (q-mp-1503)', () => {
    const junk = loadFilesFromList('/virtual/old.txt', {
      existsSync: () => true,
      statSync: () => ({ isFile: () => true }),
      readFileSync: () => 'src/games/hex/ai.ts.old\n',
    });
    expect(junk.ok).toBe(false);
    if (!junk.ok) {
      expect(junk.message).toContain('path contains invalid characters');
      expect(junk.message).not.toContain('MISSING-BASE');
    }

    const dir = mkdtempSync(join(tmpdir(), 'emit-1503-'));
    const oldList = join(dir, 'old.txt');
    const saveList = join(dir, 'save.txt');
    const backupList = join(dir, 'backup.txt');
    const swpList = join(dir, 'swp.txt');
    const cleanList = join(dir, 'clean.txt');
    writeFileSync(oldList, 'src/games/hex/ai.ts.old\n');
    writeFileSync(saveList, 'src/games/hex/ai.ts.save\n');
    writeFileSync(backupList, 'src/games/hex/ai.ts.backup\n');
    writeFileSync(swpList, 'src/games/hex/ai.ts.swp\n');
    writeFileSync(cleanList, 'src/games/hex/ai.ts\n');
    try {
      for (const listPath of [oldList, saveList, backupList, swpList]) {
        const bad = spawnSync(
          process.execPath,
          [EMIT_SCRIPT, '--base', 'HEAD', '--files-from', listPath],
          { encoding: 'utf8' }
        );
        expect(bad.status).toBe(2);
        expect(bad.stderr + bad.stdout).toContain(
          'path contains invalid characters'
        );
        expect(bad.stderr + bad.stdout).not.toContain('MISSING-BASE');
      }

      const clean = spawnSync(
        process.execPath,
        [EMIT_SCRIPT, '--base', 'HEAD', '--files-from', cleanList],
        { encoding: 'utf8' }
      );
      expect(clean.status).toBe(0);
      expect(clean.stdout).toContain('OK');
      expect(clean.stdout).toContain('src/games/hex/ai.ts');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('explicit --files-from empty/comment-only does not discover (q-mp-1428)', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'emit-1428-'));
    const listPath = join(dir, 'comment-only.txt');
    writeFileSync(listPath, '# only a comment\n\n# another\n');
    try {
      const opts = parseArgs(['--base', 'HEAD', '--files-from', listPath]);
      expect(opts.filesFrom).toBe(true);
      expect(opts.files).toEqual([]);

      let discovered = false;
      const result = await runEmitIdentityCheck(opts, {
        listAiTouchedFiles: () => {
          discovered = true;
          return { ok: true, files: ['src/games/hex/ai.ts'] };
        },
      });
      expect(discovered).toBe(false);
      expect(result.ok).toBe(true);
      expect(result.results).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('omitting --files-from still discovers via listAiTouchedFiles (q-mp-1428)', async () => {
    let discovered = false;
    const result = await runEmitIdentityCheck(
      {
        base: 'HEAD',
        head: 'WORKING_TREE',
        files: [],
        normalize: false,
        minify: false,
        json: false,
        filesFrom: false,
      },
      {
        listAiTouchedFiles: () => {
          discovered = true;
          return { ok: true, files: [] };
        },
      }
    );
    expect(discovered).toBe(true);
    expect(result.ok).toBe(true);
  });

  it('parseArgs merges positionals + files-from with ./ strip and dedupe (q-mp-1430)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'emit-1430-'));
    const listPath = join(dir, 'dup.txt');
    writeFileSync(
      listPath,
      'src/games/hex/ai.ts\n./src/games/hex/ai.ts\nsrc/games/hex/ai.ts\n'
    );
    try {
      const opts = parseArgs([
        '--base',
        'HEAD',
        '--files-from',
        listPath,
        'src/games/hex/ai.ts',
        './src/games/fiar/ai.ts',
      ]);
      expect(opts.filesFrom).toBe(true);
      expect(opts.files).toEqual([
        'src/games/hex/ai.ts',
        'src/games/fiar/ai.ts',
      ]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('runEmitIdentityCheck accepts absolute-under-root via normalized files (q-mp-1429)', async () => {
    const abs = resolve('src/games/hex/ai.ts');
    const opts = parseArgs(['--base', 'HEAD', abs]);
    expect(opts.files).toEqual(['src/games/hex/ai.ts']);
    const result = await runEmitIdentityCheck(opts);
    expect(result.results).toHaveLength(1);
    expect(result.results[0]?.status).toBe('identical');
    expect(result.results[0]?.file).toBe('src/games/hex/ai.ts');
  });
});
