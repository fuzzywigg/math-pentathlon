/**
 * Wave 67 leftover after tip/#324 — Contig game-area gap 1rem chrome.
 * Soft column/pad existed; lock gap leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 contig — style game-area gap 1rem', () => {
  it('pins contig-game-area gap 1rem leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.contig-game-area\s*\{[\s\S]*?gap:\s*1rem/);
  });
});
