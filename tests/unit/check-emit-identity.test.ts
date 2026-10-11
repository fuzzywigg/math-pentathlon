/**
 * @vitest-environment node
 *
 * esbuild requires a working TextEncoder (broken under jsdom); keep this suite
 * on the unit-node project via vitest.config.ts nodePureFiles.
 */
import { describe, it, expect } from 'vitest';
import {
  transpileToJs,
  stripCommentsAndCollapseWhitespace,
  compareFileEmit,
  parseArgs,
  EMIT_TSCONFIG_RAW,
  USAGE,
  filesFromErrorMessage,
  loadFilesFromList,
} from '../../scripts/check-emit-identity.mjs';

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

  it('filesFromErrorMessage includes Usage and path (q-mp-869)', () => {
    expect(USAGE).toBe(
      'Usage: node scripts/check-emit-identity.mjs [options] [files...]'
    );
    const missing = filesFromErrorMessage('', 'missing');
    expect(missing).toContain(USAGE);
    expect(missing).toMatch(/^error: --files-from requires a path/);
    expect(missing).not.toMatch(/ENOENT|EISDIR|Error:/);

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
        'src/games/hex/ai.ts\n# comment\n\nsrc/games/fiar/ai.ts\n',
    });
    expect(loaded).toEqual({
      ok: true,
      files: ['src/games/hex/ai.ts', 'src/games/fiar/ai.ts'],
    });
  });
});
