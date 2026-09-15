/**
 * Wave 68 leftover after tip/#337 — Contig score-p2 player2 color.
 * Soft #ffcdd2 fill existed; lock color var leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 contig — style score-p2 color player2', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.contig-score-p2\s*\{[\s\S]*?color:\s*var\(--color-player2\)/
    );
  });
});
