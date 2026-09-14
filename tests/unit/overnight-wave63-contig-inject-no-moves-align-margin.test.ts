/**
 * Wave 63 Contig/SD residual after tip #301 — Contig no-moves align/margin leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 63 contig — inject no-moves align margin', () => {
  it('pins text-align and p margin leftovers', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.contig-no-moves\s*\{[\s\S]*?text-align:\s*center/);
    expect(css).toMatch(/\.contig-no-moves p\s*\{[\s\S]*?margin:\s*0 0 1rem 0/);
  });
});
