/**
 * Wave 67 leftover after tip/#324 — Contig roll hover lift chrome.
 * Soft disabled opacity existed; lock hover primary-dark + lift. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 contig — style roll hover lift', () => {
  it('pins contig-roll-btn hover primary-dark + translateY leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.contig-roll-btn:hover:not\(:disabled\)\s*\{[\s\S]*?var\(--color-primary-dark\)/
    );
    expect(css).toMatch(
      /\.contig-roll-btn:hover:not\(:disabled\)\s*\{[\s\S]*?translateY\(-1px\)/
    );
    expect(css).toMatch(
      /\.contig-roll-btn:hover:not\(:disabled\)\s*\{[\s\S]*?var\(--shadow-md\)/
    );
  });
});
