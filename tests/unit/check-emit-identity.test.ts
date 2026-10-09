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
});
