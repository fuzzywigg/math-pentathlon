/**
 * Wave 64 leftover after tip/#303 — Contig dice-area flex/pad chrome.
 * Soft dice-area class wiring existed; lock style.css chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 contig — style dice-area pad', () => {
  it('pins contig-dice-area flex center + padding 1rem', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.contig-dice-area\s*\{[\s\S]*?justify-content:\s*center/
    );
    expect(css).toMatch(/\.contig-dice-area\s*\{[\s\S]*?padding:\s*1rem/);
  });
});
