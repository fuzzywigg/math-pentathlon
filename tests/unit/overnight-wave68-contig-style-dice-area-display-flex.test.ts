/**
 * Wave 68 leftover after tip/#337 — Contig dice-area display flex.
 * Soft padding/justify existed; lock display flex leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 contig — style dice-area display flex', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.contig-dice-area\s*\{[\s\S]*?display:\s*flex/);
  });
});
