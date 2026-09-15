/**
 * Wave 68 leftover after tip/#337 — Contig no-moves text-align center.
 * Soft radius/#fff3e0 existed; lock text-align leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 68 contig — inject no-moves align center', () => {
  it('pins contig-no-moves text-align center leftover', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-no-moves\s*\{[\s\S]*?text-align:\s*center/);
  });
});
