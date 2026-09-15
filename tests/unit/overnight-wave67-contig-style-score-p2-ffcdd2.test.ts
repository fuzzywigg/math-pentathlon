/**
 * Wave 67 leftover after tip/#316 — Contig score-p2 #ffcdd2 chrome.
 * Soft score-p1 #bbdefb existed; lock score-p2 pink leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 contig — style score-p2 ffcdd2', () => {
  it('pins contig-score-p2 background #ffcdd2 leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.contig-score-p2\s*\{[\s\S]*?background:\s*#ffcdd2/
    );
    expect(css).toMatch(
      /\.contig-score-p2\s*\{[\s\S]*?color:\s*var\(--color-player2\)/
    );
  });
});
