/**
 * Wave 66 leftover after tip/#316 — Contig cell transition ease leftover.
 * Soft cell 48px/empty bg existed; lock transition 0.15s ease. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 66 contig — inject cell transition', () => {
  it('pins contig-cell transition all 0.15s ease', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.contig-cell\s*\{[\s\S]*?transition:\s*all 0\.15s ease/
    );
  });
});
