/**
 * Wave 68 leftover after tip/#337 — Contig game-area align-items center.
 * Soft column/gap existed; lock align-items leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 contig — style game-area align center', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.contig-game-area\s*\{[\s\S]*?align-items:\s*center/);
  });
});
