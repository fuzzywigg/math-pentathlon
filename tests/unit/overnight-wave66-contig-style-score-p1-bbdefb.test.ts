/**
 * Wave 66 leftover after tip/#316 — Contig score-p1 #bbdefb chrome.
 * Soft score seats soft-matched; lock p1 bg + player1 color. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 contig — style score-p1 bbdefb', () => {
  it('pins contig-score-p1 #bbdefb + player1 color leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.contig-score-p1\s*\{[\s\S]*?background:\s*#bbdefb/
    );
    expect(css).toMatch(
      /\.contig-score-p1\s*\{[\s\S]*?color:\s*var\(--color-player1\)/
    );
  });
});
