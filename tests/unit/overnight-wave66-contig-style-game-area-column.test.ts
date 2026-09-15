/**
 * Wave 66 leftover after tip/#316 — Contig game-area column chrome.
 * Soft dice-area / status seats existed; lock game-area flex chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 contig — style game-area column', () => {
  it('pins contig-game-area column center pad/gap 1rem', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.contig-game-area\s*\{[\s\S]*?flex-direction:\s*column/
    );
    expect(css).toMatch(/\.contig-game-area\s*\{[\s\S]*?padding:\s*1rem/);
    expect(css).toMatch(/\.contig-game-area\s*\{[\s\S]*?gap:\s*1rem/);
  });
});
