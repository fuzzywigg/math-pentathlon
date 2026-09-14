/**
 * Wave 60 leftover after #282 — Contig valid hover value white. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 60 contig — inject valid hover value white', () => {
  it('pins hover value color leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toContain('.contig-cell-valid:hover .contig-cell-value');
    expect(css).toMatch(
      /\.contig-cell-valid:hover \.contig-cell-value\s*\{[\s\S]*?color:\s*white/
    );
  });
});
