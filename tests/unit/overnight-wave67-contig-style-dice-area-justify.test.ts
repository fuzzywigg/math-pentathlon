/**
 * Wave 67 leftover after tip/#316 — Contig dice-area justify chrome.
 * Soft dice-area pad existed; lock justify-content center leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 contig — style dice-area justify', () => {
  it('pins contig-dice-area justify-content center leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.contig-dice-area\s*\{[\s\S]*?justify-content:\s*center/
    );
    expect(css).toMatch(/\.contig-dice-area\s*\{[\s\S]*?display:\s*flex/);
  });
});
