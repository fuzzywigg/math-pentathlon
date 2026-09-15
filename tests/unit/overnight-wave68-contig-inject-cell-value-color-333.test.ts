/**
 * Wave 68 leftover after tip/#337 — Contig cell-value color #333.
 * Soft 14px typography existed; lock #333 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 68 contig — inject cell-value color 333', () => {
  it('pins contig-cell-value color #333 leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-cell-value\s*\{[\s\S]*?color:\s*#333/);
  });
});
